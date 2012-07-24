define([
	"views/document_new/document_new_attribute_list_item",
	"text!templates/partials/document_new_attribute_list_item.html",
	"text!templates/document_new/document_new_attribute_list_item_text.html"
], function (
	DocumentNewAttributeListItemView,
	document_new_attribute_list_item,
	template
) {
	var DocumentNewAttributeListItemTextView = DocumentNewAttributeListItemView.extend({
		template: Mustache.compile(template),
		partials: {
			document_new_attribute_list_item: document_new_attribute_list_item
		},
		initialize: function () {
			DocumentNewAttributeListItemView.prototype.initialize.apply(this, arguments);
		},
	});
	return DocumentNewAttributeListItemTextView;
});
