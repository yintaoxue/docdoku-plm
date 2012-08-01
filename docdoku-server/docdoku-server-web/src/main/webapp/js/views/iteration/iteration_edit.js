define([
    "views/components/modal",
    "views/iteration/file_editor",
    "views/attributes/attributes",
   // "views/document_new/document_new_template_list",
   // "views/document_new/document_new_workflow_list",
    "views/components/editable_list_view",
    "text!templates/iteration/iteration_new.html",
    "i18n"
], function (
    ModalView,
    FileEditor,
    AttributesView,
    //DocumentNewTemplateListView,
    //DocumentNewWorkflowListView,
    EditableListView,
    template,
    i18n
    ) {
    var IterationEditView = ModalView.extend({

        template: Mustache.compile(template),

        events : {
            "click .btn-primary":"bindSaveButton",
            "click .cancel":"bindCancelButton"
        },

        initialize: function(){

            //the model is the MasterDocument
            kumo.assert(this.model.className=="Document");
            //we are fetching the last iteration
            this.iteration = this.model.getLastIteration();

            var attributes = this.iteration.getAttributes();


            ModalView.prototype.initialize.apply(this, arguments);

        },


        render : function(){
            this.deleteSubViews();

            //var attrView = this.attributesView.render();
            //var attrHtml = attrView.$el.clone().wrap('<p>').parent().html();

            var data = {
                iteration : this.iteration.toJSON(),
                master : this.model.toJSON(),
                reference : this.iteration.getReference(),
                //attributes : attrHtml,
               // files : filesViewHtml,
                _ : i18n
            }
            //Main window
            var html = this.template(data);
            this.$el.html(html);

            //Attributes tab
            kumo.assertNotEmpty($("#iteration-attributes"), "no tab for attributes");
           /* this.attributesView = new AttributesView({
                el : $("#iteration-attributes")
            }).render();

            */


            //File Tab
            kumo.assertNotEmpty($("#iteration-files"), "no tab for files");

            //defines the view when we create a new File
            this.fileEditor = new FileEditor({documentIteration:this.iteration});

            //main view
            var files = this.iteration.getAttachedFiles();
            var partial = "{{#created}}<a href='{{url}}'>{{shortName}}</a>{{/created}}" +//created : link
                "{{^created}}{{shortName}}{{/created}}"; //not created : only shortName


            this.filesView = new  EditableListView({
                model : this.iteration.getAttachedFiles(), // domain objects set directly in view.model
                editable : true, // we will have to look at view.options.editable
                itemPartial :  partial,
                dataMapper : this.fileDataMapper,//datas needed in partial
                editor : this.fileEditor,
                el : $("#iteration-files")
            }).render();


            this.cutomizeRendering();

            return this;
        },

        primaryAction : function(){
            //saving new files : nothing to do : it's already saved
            //deleting unwanted files
            var filesToDelete =this.filesView.selection;

            //we need to reverse read because model.destroy() remove elements from collection
            while (filesToDelete.length !=0){
                var file = filesToDelete.pop();
                file.destroy({
                    error : function(){
                        alert("file "+file+" could not be deleted");
                    }
                });
            }
            this.hide();

        },

        cancelAction : function(){

            //deleting unwanted files that have been added by upload
            var filesToDelete =this.filesView.newItems;

            //we need to reverse read because model.destroy() remove elements from collection
            while (filesToDelete.length !=0){
                var file = filesToDelete.pop();
                file.destroy({
                    error : function(){
                        alert("file "+file+" could not be deleted");
                    }
                });
            }

            ModalView.prototype.cancelAction.call(this);
        },

        /**
         * Here are some jquery adjustments to render the list specially
         */
        cutomizeRendering : function(){

            this.filesView.on("list:selected", function(selectedObject, line){
                    line.addClass("stroke");
                    line.find("a").addClass("stroke");
            });

            this.filesView.on("list:unselected", function(selectedObject, line){
                line.find(".stroke").removeClass("stroke");
                line.removeClass("stroke")
            });

            this.fileEditor.render();
        },

        /**
         * Extract datas needed for the partial
         */
        fileDataMapper : function(file){

                return {
                    created : file.isCreated(),
                    url : file.isCreated() ? file.getUrl() : false,
                    shortName : file.getShortName(),
                    fullName : file.getFullName(),
                    cid : file.cid
                }
        }

    });
    return IterationEditView;
});