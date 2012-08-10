define([
    "i18n",
    "models/attached_file",
    "collections/attached_file_collection"
], function (i18n, AttachedFile, AttachedFileCollection) {

    /**
     * Unlike LinkEditor, The FileEditor contains its own EditorComponent and extends Backbone.View
     * There is also the getComponent()
     */
    var FileEditor = Backbone.View.extend({

        className : 'FileEditor',

        initialize:function () {

            kumo.assertNotEmpty(this.options.documentIteration, "No documentIteration set");
            this.newItems = new AttachedFileCollection();


        /*    var widget = this.options.widget;
            kumo.assertNotEmpty(widget, "the widget is not set for the FileEditor "+this.cid);
            this.setWidget(widget);
            */

            //events
            //_.bindAll(this);


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
            var progressElement = $("#progressVisualization");
            kumo.assertNotEmpty(progressElement, "no progress element found");
            //xhr
            if (form.upload.value) {

                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", loaded, false);

                widget.on("state:cancel", function(){
                    console.log("canceling upload")
                  //  xhr.removeEventListener("progress", uploadProgress, false);
                    xhr.abort();
                    finished();
                    return false;
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
                finished();
                widget.addItem(newFile);
            }

            function finished(){
                progressElement.empty();
                widget.trigger("status:idle");
            }

        },

        render : function(){

            var data = {
                cid : this.cid,
                i18n:i18n
            };

            var html = Mustache.render(this.templateString(), data);
            this.setElement(this.widget.getControlsElement());
            this.$el.html(html);
            this.delegateEvents();
            var cancelButton = this.$el.find("form button");
            cancelButton.hide();
            return this;

        },



        templateString:function () {

            var str = "<div id='progressVisualization'></div>" +
                "<form id='form-{{cid}}'  enctype='multipart/form-data' class='list-item'>" +
                    "<input id='input-{{cid}}' name='upload' type='file' class='input-xlarge value'  />" +
                    "<button id='editable-list-cancel-editor-"  + this.cid + "' class='btn cancel editable-list-cancel-editor'>{{i18n.CANCEL}}</button>" +
                "</form>"
            return str;
        },

        getForm : function(){
            return this.$el.find("form");
        },

        widget : null,

        setWidget : function(widget){
            this.widget = widget;
            this.customizeWidget(widget)
        },


        customizeWidget : function(widget){
            var self = this;
            kumo.assertNotEmpty(widget, "no Widget assigned");
            widget.on("state:idle", function(){
                self.render();
            });

            widget.on("state:working", function(){
                var uploadButton =self.$el.find("form input");
                var cancelButton =self.$el.find("form button");

                uploadButton.hide();
                cancelButton.show();
                //cancelButton.removeAttr("visibility");
            });

            widget.on("state:cancel", function(){
                self.trigger("state:cancel")
            });



        },
        getComponent:function (widget, item, isSelected, row) {

            var fileView = new FileComponent({
                widget:widget,
                model:item,
                isSelected:isSelected,
                row:row
            });
            fileView.editor = this;

            return fileView;
        }

    });

    var FileComponent = Backbone.View.extend({

        initialize : function(){
            kumo.assertNotEmpty(this.model, "no file model set to the View");
        },

        render:function () {
            var data = this.dataMapper();
            var html = Mustache.render(this.template(), data);
            this.$el.html(html);
            return this;
        },

        /**
         * Extract datas needed for the partial
         */
        dataMapper : function(){
            return {
                created : this.model.isCreated(),
                url : this.model.isCreated() ? this.model.getUrl() : false,
                shortName : this.model.getShortName(),
                fullName : this.model.getFullName(),
                cid : this.model.cid
            }
        },

        template : function(){
            var str ="{{#created}}<a href='{{url}}'>{{shortName}}</a>{{/created}}" +//created : link
                "{{^created}}{{shortName}}{{/created}}"; //not created : only shortName
            return str;
        }

    });

    return FileEditor;
});
