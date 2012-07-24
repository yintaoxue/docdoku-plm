define([

], function () {
    var EditableListView = Backbone.View.extend({

        debug:true,


        tagName:'ul',
        events:{

        },

        initialize:function () {
            if (kumo.enableAssert){

                kumo.assert(_.isArray(this.model), "EditableListView.model is not an array. There will be bugs");

                //checking each object is a Model with an cid
                _.each(this.model, function(item){
                    kumo.assert(kumo.isNotEmpty(item.cid), "items must have a cid");
                });

                if (this.options.keyValue){
                    kumo.assertNotAny([this.options.keyName, this.options.valueName],
                        "when providing keyValue option, you must have a keyName and keyValue option");
                }

                if (this.options.editable){
                    kumo.assertNotEmpty(this.options.editor,
                        "an Editor must be provided when using editable option")
                }
            }

        },

        render:function () {

            this.$el.addClass('editable-list');
            if (this.options.keyValue) {
                this.model = this.modelToKeyValue(this.model);
            }

            var data = {
                model:this.model,
                editable:this.options.editable,
                keyValue: this.options.keyValue

            };

            //var html = Mustache.to_html(this.templateString(), data);
            var html = Mustache.to_html(this.fullTemplate(), data);
            this.$el.html(html);

            return this;
        },

        modelToKeyValue:function (model) {
            //var keys = _.keys(model);
            var keyName = this.options.keyName;
            var result = [];
            _.each(model, function (item) {
                var key = _.keys(item)[0];
                var val = item[key];
                result.push({
                        "key":item.get(this.options.keyName),
                        "value":item.get(this.options.valueName)
                });
            });
            if (this.debug) {
                console.log("transformed " + model + " to " + JSON.stringify(result));
            }
            return result;
        },


        templateString:function () {


            var editionLink =
                "{{#editable}}<button class='editable-list-edit-button'>Edit</button>{{/editable}}";

            var li = "<li class='editable-list-item'>{{.}}" + editionLink + "</li>";


            var str = "{{#model}}" + li + "{{/model}}";
            return str;

        },

        fullTemplate:function () {
            var str =
                "{{#model}}" +
                "<li id='item-{{cid}}' class='editable-list-item'>" +
                "{{#key}}<span class='key'>{{key}}</span>  {{value}}{{/key}}" + //keyValue mode
                "{{^key}}{{.}}{{/key}}" +                                       //toString() mode
                "{{#editable}}<button class='editable-list-edit-button'>Edit</button>{{/editable}}" + //edit Button
                "</li>" +
                "{{/model}}"
            return str;
        }

    });
    return EditableListView;
});
