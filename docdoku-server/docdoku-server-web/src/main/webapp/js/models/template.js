define([
    "i18n",
    "collections/template_attribute_collection"
], function (i18n, TemplateAttributeCollection) {
	var Template = Backbone.Model.extend({

        defaults : {
            templateAttributes : new TemplateAttributeCollection()
        },

        initialize:function(){
            this.className = "Template";
        }
    });
	return Template;
});
