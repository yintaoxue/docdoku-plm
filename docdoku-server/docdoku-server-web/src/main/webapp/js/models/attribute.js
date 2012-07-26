define([
    "i18n",
    "models/document_iteration"
], function (
    i18n,
    iteration
    ) {



    var Attribute = Backbone.Model.extend({
        initialize: function () {
            this.className = "Attribute";

            //expected : documentIteration
            kumo.assertNotAny([this.attributes.type, this.attributes.name, this.attributes.value],
                "an Attribute Model should have type, name and value");
            kumo.assert(_.include(this.types, this.getType()),
                "Attribute type : "+this.getType()+" not in "+JSON.stringify(this.types));

            _.bindAll(this);
        },

        getType : function(){
            return this.get("type");
        },

        getName : function(){
            return this.get("name");
        },

        getVersion : function(){
            return this.get("version");
        }

    });

    Attribute.prototype.types = ["NUMBER", "DATE", "BOOLEAN", "TEXT"];

    return Attribute;
});