define([
    "i18n",
    "collections/template_attribute_collection"
], function (i18n, TemplateAttributeCollection) {
	var Template = Backbone.Model.extend({

        defaults : {
            attributeTemplates : new TemplateAttributeCollection()
        },

        initialize:function(){
            this.className = "Template";
            kumo.assertNotEmpty(this.get("documentType"), "A template must have a documentType")
        }
    });
	return Template;
});
