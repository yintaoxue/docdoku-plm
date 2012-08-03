define([
    "i18n",
    "models/document_iteration"
], function (
    i18n,
    iteration
    ) {

    var Attribute = Backbone.Model.extend({
        initialize: function () {
            var self = this;
            this.className = "Attribute";

            //expected : documentIteration
            kumo.assertNotEmpty(this.attributes.type,
                "an Attribute Model should have type");
            kumo.assert(
                _.any(Attribute.types,
                function(val){
                    return val == self.getType()
                }),
                "Attribute type : "+this.getType()+" not in "+JSON.stringify(Attribute.types)
            );

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

    Attribute.types = {
        NUMBER:"NUMBER", DATE : "DATE", BOOLEAN:"BOOLEAN", TEXT:"TEXT"};

    return Attribute;
});