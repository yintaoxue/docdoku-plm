define([
    "i18n",
    "models/attribute",
    "text!templates/attributes/attribute_item.html"
], function (i18n, Attribute, attributeTemplate) {

    var AttributeEditor = function () {
    };

    AttributeEditor.prototype = {


        tagName:'div',

        initialize:function () {
            this.attribute = new Attribute({
                type:"TEXT",
                name:"",
                value:""
            });
        },

        setWidget:function (widget) {
            this.widget = widget;
            this.customizeWidget(widget);
        },

        customizeWidget:function (widget) {
            var self = this;
            widget.on("list:addItem", function (listElement) {
                var newAttribute = new Attribute({
                    type:Attribute.types.TEXT,
                    name:"",
                    value:""
                });
                widget.trigger("list:added", newAttribute);
            });


            widget.on("list:selected", function (item, index, element) {
                console.log ("index : "+index);
                var component = widget.components[index];
                component.options.isSelected = true;
                component.render();
            })
            widget.on("list:unselected", function (item, index, element) {
                console.log ("index : "+index);
                var component = widget.components[index];
                component.options.isSelected = false;
                component.render();
            })

        },

        getComponent:function (widget, item, isSelected, row) {

            var attributeView = new AttributeView({
                widget:widget,
                model:item,
                isSelected:isSelected,
                row:row
            });

            return attributeView;
        }
    }

    var AttributeView = Backbone.View.extend({

        events:{
            "change .type":"typeChanged",
            "change .name":"updateName",
            "change .value":"updateValue"
        },

        render:function () {

            var data = this.dataMapper();
            var html = Mustache.render(attributeTemplate, data);
            this.$el.html(html);

        },

        dataMapper:function () {
            var attribute = this.model;
            var widget = this.options.widget;
            var isSelected = this.options.isSelected;
            var type = attribute.get("type");

            var result =  {
                cid:attribute.cid,
                id:attribute.id,
                type:type,
                name:attribute.get("name"),
                value:attribute.get("value"),
                _:i18n,
                isText:type == Attribute.types.TEXT,
                isBoolean:type == Attribute.types.BOOLEAN,
                isNumber:type == Attribute.types.NUMBER,
                isDate:type == Attribute.types.DATE,
                isSelected:isSelected
            }
                return result;
        },

        typeChanged:function (evt) {
            var type = $(evt.target).val();
            console.log("changed model type to" + type);
            this.model.set({
                type:type,
                value:"" // TODO: Validate and convert if possible between types
            });
            this.render()
        },
        updateName:function () {
            var attributeName =this.$el.find("input.attribute-name").val();
            this.model.set({
                name:attributeName
            });
        },
        updateValue:function () {
            var attributeValue = this.$el.find("input.attribute-value").val();
            this.model.set({
                value:attributeValue
            });
        }
    });

    return AttributeEditor;
});

