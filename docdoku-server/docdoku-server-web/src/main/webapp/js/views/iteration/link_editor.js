define([
    "i18n",
    "models/document_iteration",
    "text!templates/linked_document/link_item.html"
], function (i18n, DocumentIteration, linkTemplate ) {

    var LinkEditor = function () {
    };

    LinkEditor.prototype = {

        setWidget:function (widget) {
            this.widget = widget;
            this.customizeWidget(widget);
        },

        customizeWidget:function (widget) {
            var self = this;
            widget.on("list:addItem", function () {

                var searchComponent =new LinkSearchComponent();
                widget.trigger("state:working");
                widget.$el.append(searchComponent.render().$el);
                searchComponent.enableAutocomplete(); // we needed to add the input to the DOM before calling jQueryUI
                searchComponent.on("itemSelected", function(iteration){
                    kumo.assert(iteration.className == 'DocumentIteration', "the selected object should be a DocumentIteration");
                    widget.trigger("list:added", iteration);//re-render the list, so add the iteration & remove the autocomplete
                });
            });

            widget.on("state:working", function(){
                widget.enableAddButton(false);
                widget.displayCancelButton();
            });

            widget.on("state:cancel", function(){
                widget.render();
            });

            widget.on("list:selected", function (item, index, element) {
                var component = widget.components[index];
                component.options.isSelected = true;
                component.render();
            })
            widget.on("list:unselected", function (item, index, element) {
                var component = widget.components[index];
                component.options.isSelected = false;
                component.render();
            })
        },

        getComponent:function (widget, item, isSelected, row) {

            var linkView = new LinkView({
                widget:widget,
                model:item,
                isSelected:isSelected,
                row:row
            });
            linkView.editor = this;

            return linkView;
        }

    }

    var LinkView = Backbone.View.extend({

        render:function () {

            var data = this.dataMapper();
            var html = Mustache.render(linkTemplate, data);
            this.$el.html(html);

        },

        dataMapper:function () {
            var iteration = this.model;
            var isSelected = this.options.isSelected;
            var title = "";
            if (kumo.isNotEmpty(iteration.getDocument())){
                title  = iteration.getDocument().get("title");
            }

            var result =  {
                cid:iteration.cid,
                id:iteration.id, //or docKey ?
                docKey : iteration.getDocKey(),
                title  : title,
                i18n : i18n,
                isSelected:isSelected
            }
            return result;
        }

    });

    var LinkSearchComponent = Backbone.View.extend({

        render:function () {
            var html = this.template();
            this.$el.html(html);
            return this;
        },

        enableAutocomplete : function(){
            var self = this;

            //Using jquery UI Autocomplete
            $( "#link-search" ).autocomplete({
                minLength: 1,
                source: function( request, response ) {
                    $.ajax({
                        url: "/api/workspaces/takata/find/documents",
                        data: {
                            id : request.term // instead of sending '&term=inputValue' queryArgument, we send '&id=inputValue'
                        },
                        success: function( data ) {
                            kumo.debug(data, "received response");
                            response( $.map( data, function( item ) {
                                //does not display iteration ; it's always last
                                var docKey = item.documentMasterId+"-"+item.documentMasterVersion;
                                var doc = new DocumentIteration(item);
                                doc.isLink = true;
                                return {
                                    label: docKey,
                                    value: doc
                                }
                            }));
                        }
                    });
                },
                select: function( event, ui ) {
                    self.trigger("itemSelected", ui.item.value);
                }
            });

        },

        template : function(){
            var str = "<input type='text' class='autocomplete' id='link-search'>";
            return str;
        }

    });

    return LinkEditor;
});


