define([
	"i18n",
	"common/date",
	"views/checkbox_list_item",
    /*"views/document_edit",*/
    "views/iteration/iteration_edition",
	"text!templates/document_list_item.html"
], function (
	i18n,
	date,
	CheckboxListItemView,
    /*DocumentEditView,*/
    IterationEditView,
	template
) {
	var DocumentListItemView = CheckboxListItemView.extend({
		template: Mustache.compile(template),
		tagName: "tr",
		initialize: function () {
			CheckboxListItemView.prototype.initialize.apply(this, arguments);
			this.events["click .reference"] = this.actionEdit;
		},
		modelToJSON: function () {
			var data = this.model.toJSON();
			if (this.model.lastIteration) {
				data.lastIteration = this.model.lastIteration.toJSON();
			}

			// Format dates
			if (data.lastIteration && data.lastIteration.creationDate) {
				data.lastIteration.creationDate = date.formatTimestamp(
					i18n._DATE_FORMAT,
					data.lastIteration.creationDate);
			}
			if (data.checkOutDate) {
				data.checkOutDate = date.formatTimestamp(
					i18n._DATE_FORMAT,
					data.checkOutDate);
			}
			return data;
		},
		actionEdit: function (evt) {
			var that = this;
			var target = $(evt.target); 
			var targetOffset = target.offset(); 
			var offset = {
				x: targetOffset.left + target.width(),
				y: targetOffset.top + (target.height() / 2)
			};
			this.model.fetch().success(function () {


                /*that.editView = that.addSubView(
                    new DocumentEditView({
                        model: that.model
                    })
                );
                $("#content").append(that.editView.el);
                that.editView.renderAt(offset);*/

                new IterationEditView({
                    model: that.model
                }).show();



            });
        }
    });
    return DocumentListItemView;
});
