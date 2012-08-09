define([
    "i18n",
    "models/attribute"
], function (i18n, Attribute) {

    var TemplateAttribute = Backbone.Model.extend({
        initialize:function () {
            var self = this;
            this.className = "TemplateAttribute";

            kumo.assertNotEmpty(this.attributes.attributeType,
                "an TemplateAttribute Model should have attributeType");
            if (kumo.devMode)
                kumo.assert(
                _.any(Attribute.types,
                    function (val) {
                        return val == self.getAttributeType()
                    }),
                "TemplateAttribute type : " + this.getAttributeType() + " not in " + JSON.stringify(Attribute.types)
            );

        },

        getAttributeType:function () {
            return this.get("attributeType");
        },

        getName:function () {
            return this.get("name");
        },

        toString:function () {
            return this.getAttributeType() + ":" + this.getName();
        },

        //from backbone Doc : If the attributes are valid, don't return anything from validate
        validate:function () {
            if (kumo.any([this.getAttributeType(), this.getName()])) {
                return i18n.VALIDATION_FAILED_FOR+this.getAttributeType()+":"+this.getName();
            }
        }

    });

    return TemplateAttribute;
});