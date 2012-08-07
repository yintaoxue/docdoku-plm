define([
    "models/template"
], function (TemplateModel) {

    var TemplateCollection = Backbone.Collection.extend({
        model: TemplateModel
    });

    TemplateCollection.className="TemplateCollection";
    return TemplateCollection;
});
