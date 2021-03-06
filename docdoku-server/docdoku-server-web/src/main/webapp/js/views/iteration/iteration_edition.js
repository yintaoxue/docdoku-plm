define([
    "views/components/modal",
    "views/iteration/file_editor",
    "views/iteration/attribute_editor",
    //  "views/attributes/attributes",
    // "views/document_new/document_new_template_list",
    // "views/document_new/document_new_workflow_list",
    "views/components/editable_list_view",
    "views/document_new/document_new_attributes",
    "text!templates/iteration/iteration_new.html",
    "text!templates/attributes/attribute_item.html",
    "i18n"
], function (ModalView, FileEditor, AttributeEditor, //  AttributesView,
             //DocumentNewTemplateListView,
             //DocumentNewWorkflowListView,
             EditableListView, DocumentNewAttributesView, template, attributePartial, i18n) {
    var IterationEditView = ModalView.extend({

        template:Mustache.compile(template),


        initialize:function () {

            /*the model is the MasterDocument*/
            kumo.assert(this.model.className == "Document");

            /*we are fetching the last iteration*/
            this.iteration = this.model.getLastIteration();

            ModalView.prototype.initialize.apply(this, arguments);


        },

        validation:function () {

            /*checking attributes*/
            var ok = true;
            var attributes = this.attributesView.model;
            attributes.each(function (item) {
                if (!item.isValid()) {
                    ok = false;
                }
            });
            if (!ok) {
                this.getPrimaryButton().attr("disabled", "disabled");
            } else {
                this.getPrimaryButton().removeAttr("disabled");
            }
        },


        render:function () {
            var self = this;
            this.deleteSubViews();


            var data = {
                iteration:this.iteration.toJSON(),
                master:this.model.toJSON(),
                reference:this.iteration.getReference(),
                //attributes : attrHtml,
                // files : filesViewHtml,
                _:i18n
            }

            /*Main window*/
            var html = this.template(data);
            this.$el.html(html);

            /*Attributes tab*/
            kumo.assertNotEmpty($("#iteration-attributes"), "no tab for attributes");

            /***** Document new attributes component re-use and upgrade *****/

            this.customAttributesView =
                this.addSubView(
                    new DocumentNewAttributesView({
                        el:"#iteration-additional-attributes-container"
                    })
                );
            this.customAttributesView.render();

            var that = this;

            var iterationAttributes = this.iteration.getAttributes();
            iterationAttributes.each(function (item) {
                item.validate();
                that.customAttributesView.addAndFillAttribute(item);
            });

            /***************************************************************/

            /*File Tab*/
            kumo.assertNotEmpty($("#iteration-files"), "no tab for files");

            /*main view*/
            var files = this.iteration.getAttachedFiles();
            var filePartial = "{{#created}}<a href='{{url}}'>{{shortName}}</a>{{/created}}" + //created : link
                "{{^created}}{{shortName}}{{/created}}"; //not created : only shortName


            this.filesView = new EditableListView({
                model:this.iteration.getAttachedFiles(), /*domain objects set directly in view.model*/
                editable:true, /*we will have to look at view.options.editable*/
                itemPartial:filePartial,
                dataMapper:this.fileDataMapper, /*datas needed in partial*/
                listName:"Attached files for " + this.iteration//,
                //el : $("#iteration-files")
            }).render();
            $("#iteration-files").append(this.filesView.$el);

            /*defines the view when we create a new File*/
            this.fileEditor = new FileEditor({
                documentIteration:this.iteration,
                widget:this.filesView
            });

            this.cutomizeRendering();

            return this;
        },

        rendered:function () {


        },

        primaryAction:function () {

            /*saving new attributes*/
            this.iteration.save({
                instanceAttributes:this.customAttributesView.collection.toJSON()
            });

            /*There is a parsing problem at saving time*/
            var files = this.iteration.get("attachedFiles");

            /*tracking back files*/
            this.iteration.set({
                attachedFiles:files
            });

            /*
             *saving new files : nothing to do : it's already saved
             *deleting unwanted files
             */

            var filesToDelete = this.filesView.selection;

            /*we need to reverse read because model.destroy() remove elements from collection*/
            while (filesToDelete.length != 0) {
                var file = filesToDelete.pop();
                file.destroy({
                    error:function () {
                        alert("file " + file + " could not be deleted");
                    }
                });
            }

            this.hide();

        },

        cancelAction:function () {

            /*deleting unwanted files that have been added by upload*/
            var filesToDelete = this.filesView.newItems;

            /*we need to reverse read because model.destroy() remove elements from collection*/
            while (filesToDelete.length != 0) {
                var file = filesToDelete.pop();
                file.destroy({
                    error:function () {
                        alert("file " + file + " could not be deleted");
                    }
                });
            }

            ModalView.prototype.cancelAction.call(this);
        },

        /*
         * Here are some jquery adjustments to render the list specially
         */

        cutomizeRendering:function () {

            this.filesView.on("list:selected", function (selectedObject, index, line) {
                line.addClass("stroke");
                line.find("a").addClass("stroke");
            });

            this.filesView.on("list:unselected", function (selectedObject, index, line) {
                line.find(".stroke").removeClass("stroke");
                line.removeClass("stroke")
            });

            this.fileEditor.render();
        },

        /*
         * Extract datas needed for the partial
         */

        fileDataMapper:function (file) {

            return {
                created:file.isCreated(),
                url:file.isCreated() ? file.getUrl() : false,
                shortName:file.getShortName(),
                fullName:file.getFullName(),
                cid:file.cid
            }
        },

        getPrimaryButton:function () {
            var button = this.$el.find("div.modal-footer button.btn-primary");
            kumo.assertNotEmpty(button, "can't find primary button");
            return button;
        }




    });
    return IterationEditView;
});