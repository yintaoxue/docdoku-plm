define([
    "views/components/modal",
    "views/iteration/file_editor",
    "views/document_new/document_new_attributes",
    "views/document_new/document_new_template_list",
    "views/document_new/document_new_workflow_list",
    "views/components/editable_list_view",
    "text!templates/iteration/iteration_new.html",
    "i18n"
], function (
    ModalView,
    FileEditor,
    DocumentNewAttributesView,
    DocumentNewTemplateListView,
    DocumentNewWorkflowListView,
    EditableListView,
    template,
    i18n
    ) {
    var IterationEditView = ModalView.extend({

        template: Mustache.compile(template),

        initialize: function(){

            //the model is the MasterDocument
            kumo.assert(this.model.className=="Document");
            //we are fetching the last iteration
            this.iteration = this.model.getLastIteration();

            var attributes = this.iteration.getAttributes(); // [{"a":"x"}, {"b":"y"}, {"c":"z"}];


           /* this.attributesView = new EditableListView({
                model : attributes, // this will be set directly in view.model
                editable : true, // we will have to look at view.options.editable
                keyValue : true,
                keyName : "name",
                valueName : "value"
            });*/

            console.log("files length : "+this.iteration.getAttachedFiles().length);
            ModalView.prototype.initialize.apply(this, arguments);




        },


        render : function(){
            this.deleteSubViews();



            //var attrView = this.attributesView.render();
            //var attrHtml = attrView.$el.clone().wrap('<p>').parent().html();

          //  var filesView = this.filesView.render();
           // var filesViewHtml = $('<div>').append(filesView.$el.clone()).remove().html();

            var data = {
                iteration : this.iteration.toJSON(),
                master : this.model.toJSON(),
                reference : this.iteration.getReference(),
                //attributes : attrHtml,
               // files : filesViewHtml,
                _ : i18n
            }

            var html = this.template(data);

            this.$el.html(html);

            kumo.assertNotEmpty($("#iteration-files"), "no tab for files");



            // adding components
            this.filesView = new  EditableListView({
                model : this.iteration.getAttachedFiles(), // this will be set directly in view.model
                editable : true, // we will have to look at view.options.editable
                keyValue : false,
                renderer : this.getFileRenderer(),
                editor : new FileEditor({documentIteration:this.iteration}),
                el : $("#iteration-files")
            }).render();

            //$("div.attribute-list-view").append(attrHtml);
            return this;
        },

        /**
         * Returns the link if the fullName exists, or just a text if it does not exist yet on server
         */
        getFileRenderer : function(){

            var partial = "{{#created}}<a href='{{url}}'>{{shortName}}</a>{{/created}}" +
                "{{^created}}{{shortName}}{{/created}}";

            var mapper = function(file){
                return {
                    created : file.isCreated(),
                    url : file.isCreated() ? file.getUrl() : false,
                    shortName : file.getShortName(),
                    fullName : file.getFullName(),
                    cid : file.cid
                }
            }

            return {
                partial:partial,
                mapper : mapper
            };

        }

    });
    return IterationEditView;
});