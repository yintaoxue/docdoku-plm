define([
    "views/components/modal",
    "views/document_new/document_new_attributes",
    "views/document_new/document_new_template_list",
    "views/document_new/document_new_workflow_list",
    "views/components/editable_list_view",
    "text!templates/iteration/iteration_new.html",
    "i18n"
], function (
    ModalView,
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

            console.log("OK for that model : "+this.model);
            var attributes = [{"a":"x"}, {"b":"y"}, {"c":"z"}];

            this.attributesView = new EditableListView({
                model : attributes, // this will be set directly in view.model
                editable : true, // we will have to look at view.options.editable
                keyValue : true,
                keyName : "name",
                valueName : "value"
            });

            ModalView.prototype.initialize.apply(this, arguments);


        },

        render : function(){
            console.log("rendering attributes");
            var attrView = this.attributesView.render();
            var attrHtml = attrView.$el.clone().wrap('<p>').parent().html();
            var data = {
                iteration : this.iteration.toJSON(),
                master : this.model.toJSON(),
                reference : this.iteration.getReference(),
                attributes : attrHtml,
                _ : i18n
            }

            var html = this.template(data);
            console.log("rendering IterationView");
            this.$el.html(html);
            //$("div.attribute-list-view").append(attrHtml);
            return this;
        }

    });
    return IterationEditView;
});