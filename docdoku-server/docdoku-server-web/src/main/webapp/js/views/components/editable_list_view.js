define([
    "i18n",
    "text!templates/components/editable-list-view.html"
], function (i18n, template) {
    var EditableListView = Backbone.View.extend({

        debug:true,
        className:'editable-list',
        tagName:'ul',

        initialize:function () {
            var self = this;
            //this.$el.addClass('editable-list');
            //Check validity

            if (kumo.devMode) {
                if (kumo.isEmpty(this.options.listName)) {
                    console.log("no listName set ; please set it for easier debug")
                }

            }
            if (kumo.enableAssert) {
                kumo.assert(_.isArray(this.getModels()), "EditableListView.model is not an array. There will be bugs");


                kumo.assertNotEmpty(this.options.editor, "A listView must have a View editor with editor.getComponent(widget, item, isSelected, row) method ");
                if (kumo.isNotEmpty(this.options.editor)) {
                    kumo.assertNotEmpty(this.options.editor.getComponent,
                        "an editor must have a getComponent(widget, item, isSelected, row) method to render the item"
                    )
                }

                //checking each object is a Model with an cid
                _.each(this.getModels(), function (item) {
                    kumo.assert(kumo.isNotEmpty(item.cid), "items in the list model must have a cid");
                });
            }

            //initialize :
            this.$el.attr("data-list-id", this.cid);

            //events
            this.on("list:added", this.onItemAdded);

            /**
             * Also declaring for other objects :
             * state:idle : waiting for a user action
             * state:cancel : cancelButton has been clicked
             * state:working : addButton has been clicked, or other long action
             * list:addItem ->
             * list:selected -> selectedObject, li element : a component has been selected
             * list:unselected -> unselectedObject, li element : a component has been unselected
             * component:rendered : after component is rendered, before state:idle
             */

            //state lists
            this.components = []; // Warning : Backbone Collections takes only Models object.
            this.selection = new Backbone.Collection();
            this.newItems = new Backbone.Collection();

        },

        //DOM Events
        events:{
            "click .editable-list-cancel-editor":"bindCancelButton",
            "change input.item-selection":"bindItemSelected",
            "click .editable-list-adder":"bindAddItem"
        },



        getModels:function () {
            return this.model.models;
        },

        bindAddItem:function () {
            this.trigger("state:working");
            this.trigger("list:addItem");
        },

        bindCancelButton:function () {
            this.trigger("state:cancel");
        },

        bindItemSelected:function (evt) {
            var checkbox = $(evt.target);
            var cid = checkbox.val();
            var selectedObject = this.model.getByCid(cid);
            kumo.assertNotEmpty(selectedObject, "Can't find selectedObject");
            var index = this.model.indexOf(selectedObject);

            if (checkbox.is(":checked")) {
                this.trigger("list:selected", selectedObject, index, checkbox.parents("li"));
                kumo.assert(!_.include(this.selection, selectedObject), "The selection already contains the selectedObject :" + selectedObject);
                this.selection.add(selectedObject);
            } else {
                this.trigger("list:unselected", selectedObject, index, checkbox.parents("li"));
                kumo.assert(!_.include(this.selection, selectedObject), "The selection does not the selectedObject " + selectedObject);
                this.selection.remove(selectedObject);
            }

        },

        render:function () {

            var itemsData = this.model.map(function (item) {
                return {
                    cid:item.cid
                }
            });

            var data = {
                items:itemsData,
                editable:this.options.editable===false ? false : true, //by default it's editable
                i18n:i18n
            };

            //new way
            var html = Mustache.render(this.template(), data);
            this.$el.html(html);

            if (this.options.editor) {
                this.renderComponents();
            }

            this.getCancelButton().hide();
            this.trigger("component:rendered");
            this.trigger("state:idle");

            return this;
        },

        renderComponents:function () {
            var widget = this;
            var editor = this.options.editor;

            var row = 0;
            this.components = [];
            this.model.each(function (item) {
                var isSelected = widget.selection.include(item);
                var component = editor.getComponent(widget, item, isSelected, row);
                widget.components.push(component);
                var element = widget.$el.find("div.item-component")[row];
                component.render();
                $(element).append(component.$el);
                row++;
            });
        },

        template : function(){
            return template;
        },


        //TODO : not correctly used : the this.model.add(item); should be done in this.addItem() wich would call list:modelChanged
        onItemAdded:function (item) {

            this.model.add(item);
            this.getNewItems().add(item); // later list is disabled
            this.render();
            this.trigger("state:idle");

        },


        getNewItems:function () {
            //kumo.assert(this.options.editable, "Can't get new items if not editable");
            return this.newItems;
        },

        getUnselectedItems:function () {
            var selection = this.selection;
            var result = new Backbone.Collection();
            this.model.each(function (item) {
                if (!selection.include(item)) {
                    result.push(item);
                }
            });
            return result;
        },


        getControlsElement:function () {
            var controlsElement = $("#editable-list-controls-" + this.cid);
            kumo.assertNotEmpty(controlsElement, "can't find control element for list " + this.listName);
            return controlsElement;
        },

        getListElement:function () {
            var listElement = this.$el.find("ul:first-child");
            kumo.assertNotEmpty(listElement, "The listElement is not yet in the DOM");
            return listElement;
        },

        setControls:function (html) {
            this.getControlsElement().html(html);
        },

        getAddButton:function () {
            var button = this.$el.find(".editable-list-adder");
            kumo.assertNotEmpty(button, "Can't find addButton");
            return button;
        },

        getCancelButton:function () {
            var button = this.$el.find("button.editable-list-cancel-editor");
            kumo.assertNotEmpty(button, "Can't find cancel Button");
            return button;
        },

        enableAddButton : function(enable){
            var button = this.$el.find(".editable-list-adder");
            if (kumo.isNotEmpty(button)){
                if (enable===false){
                    button.attr('disabled', 'disabled');
                }else{
                    button.removeAttr('disabled')
                }
            }
        },

        displayCancelButton : function(show){
            var button = this.$el.find("button.editable-list-cancel-editor");
            if (kumo.isNotEmpty(button)){
                if (show===false){
                    button.hide()
                }else{
                    button.show();
                }
            }
        }


    });
    return EditableListView;
});
