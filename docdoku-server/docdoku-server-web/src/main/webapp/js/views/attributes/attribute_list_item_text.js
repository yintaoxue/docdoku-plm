define([
    "views/attributes/attribute_list_item",
    "text!templates/partials/document_new_attribute_list_item.html",
    "text!templates/document_new/document_new_attribute_list_item_text.html"
], function (
    AttributeListItemView,
    document_new_attribute_list_item,
    template
    ) {
    var AttributeListItemTextView = AttributeListItemView.extend({
        template: Mustache.compile(template),
        partials: {
            document_new_attribute_list_item: document_new_attribute_list_item
        },
        initialize: function () {
            AttributeListItemView.prototype.initialize.apply(this, arguments);
        }
    });
    return AttributeListItemTextView;
});
