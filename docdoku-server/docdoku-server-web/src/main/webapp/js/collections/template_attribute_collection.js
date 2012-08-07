define([
    "models/template_attribute"
], function (TemplateAttributeModel) {

    var TemplateAttributeCollection = Backbone.Collection.extend({
        model: TemplateAttributeModel
    });

    TemplateAttributeCollection.className="TemplateAttributeCollection";
    return TemplateAttributeCollection;
});
