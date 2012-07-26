define([

], function () {
    var EditableListView = Backbone.View.extend({

        debug:true,
        className : 'EditableListView',


        tagName:'ul',

        initialize:function () {
            var self = this;
            //Check validity
            if (kumo.enableAssert) {

                kumo.assert(_.isArray(this.getModels()), "EditableListView.model is not an array. There will be bugs");

                //checking each object is a Model with an cid
                _.each(this.getModels(), function (item) {
                    kumo.assert(kumo.isNotEmpty(item.cid), "items must have a cid");
                });

                if (kumo.isEmpty(this.options.renderer)){
                    console.log("No renderer set ; using toString() on objects");
                }

                if (this.options.keyValue) {
                    kumo.assertNotAny([this.options.keyName, this.options.valueName],
                        "when providing keyValue option, you must have a keyName and keyValue option");
                }

                if (this.options.editable) {
                    var editor = this.options.editor;
                    kumo.assertNotEmpty(editor,
                        "an Editor must be provided when using editable option");
                    kumo.assert(! _.isUndefined(editor.newItems),
                        "The editor must provide a collection for new items");

                    editor.on("list:added", function(object){
                        self.onItemAdded(object);
                    });

                }
            }

            this.model.each(function (item) {
                item.mustacheHtml = _.isFunction(item.toHtml) ? item.toHtml() : item.toString();
            });
            kumo.debug("cid : "+this.cid+ " ; className :"+this.className);

            //events
        },

        events:{
            "click button.editable-list-adder":"addItemEditor",
            "click .editable-list-cancel-editor" : "cancelAddItem",
            "list:added" : "onItemAdded"
        },


        getModels:function () {
            return this.model.models;
        },

        partial : function (item){
            return _.isFunction(item.toHtml) ? item.toHtml() : item.toString();
        },

        render:function () {

            this.$el.addClass('editable-list');
            if (this.options.keyValue) {
                this.model = this.modelToKeyValue(this.model);
            }



            var data = {
                model: this.model.map(this.getRenderer().mapper),
                later : this.getNewItems().map(this.getRenderer().mapper),
                editable:this.options.editable,
                keyValue:this.options.keyValue
            };

            var partial;
            if (kumo.isEmpty(this.options.renderer)){
                partial = {renderer : "{{.}}"}
            }else{
                partial = {renderer : this.getRenderer().partial};
            }

            var fullTemplate = this.fullTemplate();
            var html = Mustache.to_html(fullTemplate, data, partial);
            kumo.debug(html);
            this.$el.html(html);

            return this;
        },

        modelToKeyValue:function (model) {
            //var keys = _.keys(model);
            var keyName = this.options.keyName;
            var valueName = this.options.valueName;
            var result = [];
            //model is a collection
            model.each(function (item) {

                result.push({
                    "key":item.get(keyName),
                    "value":item.get(valueName)
                });

            });

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
            return this.listTemplate() + this.laterItemsTemplate() + this.editorPlaceTemplate() + this.controlBarTemplate();
        },

        listTemplate:function () {



            var list =
                "<ul id=editable-list>\n" +
                    "{{#model}}\n" +
                    "<li id='item-{{cid}}' class='editable-list-item'>\n" +
                    "{{#editable}}<span class='editable-list-delete-button'> x </span>{{/editable}}\n" + //delete Button
                    //"{{#keyValue}}<span class='key'>{{key}}</span>  {{value}}{{/keyValue}}\n" + //keyValue mode
                    //"{{^key}}{{{mustacheHtml}}}{{/key}}\n" + //toString() or toHtml() mode
                    "{{>renderer}}"+
                    "</li>\n" +
                    "{{/model}}\n" +


                    "</ul>\n";

            return list;
        },

        //Display items that are not yet saved
        laterItemsTemplate:function () {
            return "<ul id='editable-list-later-" + this.cid + "' class='editable-list-later'>" +
                "{{#later}}" +
                "<li id='item-{{cid}}' class='editable-list-added-item'><span class='editable-list-delete-button'> x </span>{{>renderer}}</li>" +
                "{{/later}}" +
                "</ul>";
        },

        editorPlaceTemplate:function () {
            return "<div id='editable-list-editor-" + this.cid + "' class='editable-list-editor'>" +
                "</div>"
        },


        getLaterList:function () {
            var elt = this.$el.find("#editable-list-later-" + this.cid);
            kumo.assertNotEmpty(elt, "can't find later-list element");
            return elt;
        },

        getEditorPlace:function () {
            var elt = this.$el.find("#editable-list-editor-" + this.cid);
            kumo.assertNotEmpty(elt, "can't find editor-place element");
            return elt;
        },

        controlBarTemplate:function () {
            var controls = "{{#editable}}<div id='editable-list-controls'>" +
                "<button class='editable-list-adder'>Add item</button>" +
                "<button id='editable-list-cancel-editor-"  + this.cid + "' class='editable-list-cancel-editor'>Cancel Add</button>" +
                "</div>{{/editable}}\n";
            return controls;
        },

        addItemEditor:function () {

            //remove it if already put
            var editor = this.options.editor;
            editor.delegateEvents();
            //editor.remove();

            var editorPlace = this.getEditorPlace();
            editor.setElement(editorPlace);
            console.log("editor has now cid : "+editor.cid);
            editor.render();

        },


        cancelAddItem : function(){
            kumo.debug("cancel Add Item");
            this.getEditorPlace().empty();
        },

        onItemAdded : function(item){
            //kumo.assert (item instanceof this.getNewItems().model, "Item "+item+" has not the right Model");
            this.getNewItems().add(item);
            //rerender
            this.render();

        },

        getNewItems : function(){
            kumo.assert(this.options.editable, "Can't get new items if not editable");
            kumo.assert(! _.isUndefined(this.options.editor.newItems), "No newItems collection set in the editor");
            return this.options.editor.newItems;
        },

        getRenderer : function(){
            return this.options.renderer;
        },

        getEditor : function(){
            return this.options.editor;
        }

    });
    return EditableListView;
});
