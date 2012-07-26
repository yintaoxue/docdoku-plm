define([
    "i18n",
    "models/attached_file",
    "collections/attached_file_collection"
], function (i18n, AttachedFile, AttachedFileCollection) {
    var FileEditor = Backbone.View.extend({

        className : 'FileEditor',

        initialize:function () {

            kumo.assertNotEmpty(this.options.documentIteration, "No documentIteration set");
            kumo.debug("cid : "+this.cid+ " ; className :"+this.className);

            this.newItems = new AttachedFileCollection();
        },

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
            kumo.debug("adding file "+shortName);


            var newFile = new AttachedFile({
                shortName:shortName,
                created : false
            });
            newFile.set("documentIteration", this.options.documentIteration);


            this.trigger("list:added", newFile);

            this.startUpload(form, newFile);
        },

        startUpload : function(form, newFile){
            //find correct $el
            $("#item-"+newFile.cid).append("  <span id='progress-"+newFile.cid+"'> loading ....</span>");
            var progressElement = $("#progress-"+newFile.cid);
            //xhr
            if (form.upload.value) {
                var shortName = form.upload.value.split(/(\\|\/)/g).pop();
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", loaded, false);
                //xhr.addEventListener("error", this.error, false);
                //xhr.addEventListener("abort", this.abort, false);
                var url = this.options.documentIteration.getUploadUrl(newFile.getShortName());
                xhr.open("POST", url);

                var file = form.upload.files[0]
                var fd = new FormData();

                fd.append("upload", file);
                xhr.send(fd);
            } else {
                // Nothing to upload
                //this.trigger("finished", evt, this);
                console.error("No data");
                finished()
            }

            //on progress
            function uploadProgress(evt) {
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
                progressElement.empty();
                finished();
            }

            function finished(){
                console.log("file "+newFile+" finished");
            }

        },

        render : function(){

            var html = Mustache.to_html(this.templateString(), this.getRenderData());
            kumo.debug("rendering : \n"+html);
            this.$el.html(html);
            return this;

        },

        getRenderData : function(){
            return {
                cid : this.cid
            }
        },


        templateString:function () {
            var str = "<form id='form-{{cid}}'  enctype='multipart/form-data' class='list-item'>" +
                "<div class='controls'>" +
                "<a class='remove'>×</a>" +
                "</div>" +
                "<div class='controls'>" +
                "<input id='input-{{cid}}' name='upload' type='file' class='input-xlarge value' />" +
                "</div>" +
                "</form>"
            return str;
        },

        getForm : function(){
            return this.$el.find("form");
        },

        getListViewWidget : function(){
            var listElt = this.$el.parent('div.editable-list');
            kumo.assertNotEmpty(listElt, "can't find listView widget");
            return listElt;
        }

    });
    return FileEditor;
});
