define([
    "i18n",
    "models/attached_file",
    "collections/attached_file_collection"
], function (i18n, AttachedFile, AttachedFileCollection) {
    var FileEditor = Backbone.View.extend({

        className : 'FileEditor',

        initialize:function () {

            kumo.assertNotEmpty(this.options.documentIteration, "No documentIteration set");

            this.newItems = new AttachedFileCollection();

            //events
            _.bindAll(this);


        },

        //DOM Events
        events : {
            //when form changes, we upload the file
            "change form input" : "onFileSelected"
        },

        validate:function () {

        },
        

        onFileSelected : function(){

            var form = document.getElementById("form-" + this.cid);
            if (kumo.any([form, form.upload, form.upload.value])){
                console.error("no acceptable value found");
                return;
            }

            var shortName = form.upload.value.split(/(\\|\/)/g).pop();

            var newFile = new AttachedFile({
                shortName:shortName,
                created : false
            });
            newFile.set("documentIteration", this.options.documentIteration);




            this.startUpload(form, newFile);
        },

        startUpload : function(form, newFile){

            var self = this;
            var widget =this.widget;
            widget.trigger("state:working");


            //find correct $el
            //$("#item-"+newFile.cid).append("<span id='progress-"+newFile.cid+"'> loading ....</span>");
            var progressElement = $("#progressVisualization");
            kumo.assertNotEmpty(progressElement, "no progress element found");
            //xhr
            if (form.upload.value) {

                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", loaded, false);

                this.on("state:cancel", function(){
                    console.log("canceling upload")
                  //  xhr.removeEventListener("progress", uploadProgress, false);
                    xhr.abort();
                    finished();
                });
                //xhr.addEventListener("error", this.error, false);
                //xhr.addEventListener("abort", this.abort, false);
                var url = this.options.documentIteration.getUploadUrl(newFile.getShortName());
                xhr.open("POST", url);

                var file = form.upload.files[0]
                var fd = new FormData();

                fd.append("upload", file);
                xhr.send(fd);
            } else {
                finished()
            }



            //on progress
            function uploadProgress(evt) {
                console.log("progressing")
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    progressElement.html(
                        "<div class='progress progress-striped'>"+
                            "<div class='bar' style='width: "+percentComplete+"%;'></div>"+
                    "</div>");
                }
            }

            function loaded (){
                console.log("file "+newFile+" loaded");
                self.trigger("list:added", newFile);
                finished();
            }

            function finished(){
                console.log("file "+newFile+" finished");
                progressElement.empty();
                widget.trigger("status:idle");

            }



        },

        render : function(){

            var data = {cid : this.cid};

            var html = Mustache.to_html(this.templateString(), data);

            this.setElement(this.widget.getControlsElement());
            this.$el.html(html);

           // this.widget.trigger("state:idle");

            //this.$el.on("click")

            return this;

        },



        templateString:function () {
            //change controls
            //"<button class='editable-list-adder'>Add item</button>" +
            //"<button id='editable-list-cancel-editor-"  + this.cid + "' class='editable-list-cancel-editor'>Cancel Add</button>" +



            var str = "<div id='progressVisualization'></div>" +
                "<form id='form-{{cid}}'  enctype='multipart/form-data' class='list-item'>" +
                "<input id='input-{{cid}}' name='upload' type='file' class='input-xlarge value editable-list-adder'  />" +
                "<button id='editable-list-cancel-editor-"  + this.cid + "' class='editable-list-cancel-editor hidden'>Cancel Add</button>" +

                "</form>"
            return str;
        },

        getForm : function(){
            return this.$el.find("form");
        },

        widget : null,

        setWidget : function(widget){
            this.widget = widget;
            this.customizeWidget()
        },


        customizeWidget : function(){
            kumo.assertNotEmpty(this.widget, "no Widget assigned");
            this.widget.on("state:idle", this.render);

        }

    });
    return FileEditor;
});
