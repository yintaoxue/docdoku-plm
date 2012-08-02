define([

], function () {
    var EditableListView = Backbone.View.extend({

        debug:true,
        className : 'EditableListView',
        defaults : {
          itemPartial: "{{.}}",
          listName : "Unknown List"
        },

        tagName:'ul',

        initialize:function () {
            var self = this;
            //Check validity

            if (kumo.devMode){
                if (kumo.isEmpty(this.listName)){
                    console.log("no listName set ; please set it for easier debug")
                }
                if (kumo.isEmpty(this.options.dataMapper)){
                    console.error("no dataMapper set to the List "+this.listName);
                }

                if (kumo.isEmpty(this.options.itemPartial)){
                    console.log("No 'itemPartial' set ; using toString() on objects");
                }
            }
            
            if (kumo.enableAssert) {

                kumo.assert(_.isArray(this.getModels()), "EditableListView.model is not an array. There will be bugs");

                //checking each object is a Model with an cid
                _.each(this.getModels(), function (item) {
                    kumo.assert(kumo.isNotEmpty(item.cid), "items must have a cid");
                });

                if (this.options.editable) {
                    var editor = this.options.editor;
                    editor.setWidget(this);

                    kumo.assertNotEmpty(editor,
                        "an Editor must be provided when using editable option");

                    editor.on("list:added", function(object){
                        self.onItemAdded(object);
                    });

                    this.on("state:cancel", function(){
                        console.log("forwarding cancel to editor")
                       editor.trigger("state:cancel")
                    });
                }
            }

            //initialize :
            kumo.applyIf(this.options, this.defaults);

            //events
            this.on ("state:working", this.onWorking);
            this.on("state:idle", this.onIdle);
            this.on("state:cancel", this.onCancel);

            //state lists
            this.selection = new Backbone.Collection();
            this.newItems = new Backbone.Collection();

        },

        //DOM Events
        events:{
            "click .editable-list-cancel-editor" : "bindCancelButton",
            "change input.item-selection" : "bindItemSelected"
        },


        //states
        onWorking : function(){
            this.getAddButton().attr('disabled', 'disabled');
            this.getCancelButton().show();
        },

        onIdle : function(){
            this.getAddButton().removeAttr('disabled');
            this.getCancelButton().hide();
        },

        onCancel : function(){
          this.onIdle();
        },

        getModels:function () {
            return this.model.models;
        },


        bindCancelButton : function(){
          this.getEditorPlace().empty();
          this.trigger("state:cancel");
        },

        bindItemSelected : function(evt){
            var checkbox = $(evt.target);
            var cid = checkbox.val();
            var selectedObject = this.model.getByCid(cid);
            kumo.assertNotEmpty(selectedObject, "Can't find selectedObject");

            if (checkbox.is(":checked")){
                this.trigger("list:selected", selectedObject, checkbox.parents("li"));
                kumo.assert(! _.include(this.selection, selectedObject), "The selection already contains the selectedObject :"+selectedObject);
                this.selection.add(selectedObject);
            }else{
                this.trigger("list:unselected", selectedObject, checkbox.parents("li"));
                kumo.assert(! _.include(this.selection, selectedObject), "The selection does not the selectedObject "+selectedObject);
                this.selection.remove(selectedObject);
            }

        },

        render:function () {

            this.$el.addClass('editable-list');

            var fullTemplate = this.fullTemplate();

            //Extract data from the item collection
            var itemsData = this.model.map(this.options.dataMapper);

            var data = {
                listId:this.cid,
                items: itemsData,
                editable:this.options.editable
            };

            var html = Mustache.render(fullTemplate,
                data,
                {itemPartial: this.options.itemPartial}
             );
            
            this.$el.html(html);

            this.getCancelButton().hide();
            this.trigger("component:rendered");

            return this;
        },

        fullTemplate:function () {
            return this.listTemplate() + this.editorPlaceTemplate() + this.controlBarTemplate();
        },

        listTemplate:function () {

            var list =
                "<ul id='{{listId}}'>\n" +
                    "{{#items}}\n" +
                    "<li id='item-{{cid}}' class='list-item editable-list-item'>\n" +
                    "{{#editable}}<input class='item-selection' type='checkbox' value='{{cid}}' />{{/editable}}\n" + //delete Button
                   "{{>itemPartial}}"+ //custom display of the object
                    "</li>\n" +
                    "{{/items}}\n" +
                    "</ul>\n";

            return list;
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

        addItemEditor : function () {

            this.trigger("state:working");
            //remove it if already put
            var editor = this.options.editor;

            var editorPlace = this.getEditorPlace();
            editor.setElement(editorPlace);
            console.log("editor has now cid : "+editor.cid);
            editor.render();


        },

        onItemAdded : function(item){

            this.model.add(item);
            this.getNewItems().add(item); // later list is disabled
            this.render();
            this.trigger("state:idle");

        },



        getNewItems : function(){
            //kumo.assert(this.options.editable, "Can't get new items if not editable");
            return this.newItems;
        },

        getRenderer : function(){
            return this.options.renderer;
        },

        getEditor : function(){
            return this.options.editor;
        },

        getControlsElement : function(){
            return $("#editable-list-controls");
        },
        setControls : function(html){
              $("#editable-list-controls").html(html);
        },

        getAddButton : function(){
            var button = this.$el.find(".editable-list-adder");
            kumo.assertNotEmpty(button, "Can't find addButton");
            return button;
        },

        getCancelButton : function(){
            var button = this.$el.find("button.editable-list-cancel-editor");
            kumo.assertNotEmpty(button, "Can't find cancel Button");
            return button;
        }

    });
    return EditableListView;
});
