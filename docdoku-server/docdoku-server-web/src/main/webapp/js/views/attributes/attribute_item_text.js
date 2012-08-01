define([
	"views/attributes/attribute_item",
	"text!templates/partials/document_new_attribute_list_item.html",
	"text!templates/document_new/document_new_attribute_list_item_text.html"
], function (
	AttributeItemView,
	partial,
	template
) {
	var AttributeItemTextView = AttributeItemView.extend({
		template: Mustache.compile(template),
		partials: {
			document_new_attribute_list_item: partial
		},
		initialize: function () {
            AttributeItemView.prototype.initialize.apply(this, arguments);
		}
	});
	return AttributeItemTextView;
});
