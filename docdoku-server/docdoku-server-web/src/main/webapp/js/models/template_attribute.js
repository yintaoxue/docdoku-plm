define([
    "i18n",
    "models/Attribute"
], function (i18n, Attribute) {

    var TemplateAttribute = Backbone.Model.extend({
        initialize:function () {
            var self = this;
            this.className = "TemplateAttribute";

            kumo.assertNotEmpty(this.attributes.type,
                "an TemplateAttribute Model should have type");
            kumo.assert(
                _.any(Attribute.types,
                    function (val) {
                        return val == self.getType()
                    }),
                "TemplateAttribute type : " + this.getType() + " not in " + JSON.stringify(Attribute.types)
            );

        },

        getType:function () {
            return this.get("type");
        },

        getName:function () {
            return this.get("name");
        },

        toString:function () {
            return this.getType() + ":" + this.getName();
        },

        //from backbone Doc : If the attributes are valid, don't return anything from validate
        validate:function () {
            if (kumo.any([this.getType(), this.getName()])) {
                return i18n.VALIDATION_FAILED_FOR+this.getType()+":"+this.getName();
            }
        }

    });

    return TemplateAttribute;
});