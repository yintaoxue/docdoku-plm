define([
	"i18n",
	"common/date",
	"views/base",
	"views/iteration_edit",
	"text!templates/document_edit.html"
], function (
	i18n,
	date,
	BaseView,
	IterationEditView,
	template
) {
	var DocumentEditView = BaseView.extend({
		className: "document-edit",
		template: Mustache.compile(template),
		initialize: function () {
			BaseView.prototype.initialize.apply(this, arguments);
			// destroy previous document edit view if any
			if (DocumentEditView._instance) {
				DocumentEditView._oldInstance = DocumentEditView._instance;
			}
			// keep track of the created document edit view
			DocumentEditView._instance = this;

			this.events["click header .close"] = "closeAction";
		},
		modelToJSON: function () {
			var data = this.model.toJSON();
			data.documentIterations = data.documentIterations.toJSON();

			var iterations = [];
			for (var i = data.documentIterations.length - 1; i >= 0; i--){
				// Format dates
				data.documentIterations[i].creationDate = date.formatTimestamp(
					i18n._DATE_FORMAT,
					data.documentIterations[i].creationDate);
				// Invert order to have the lastIteration first in the list
				iterations[data.documentIterations.length - i] = data.documentIterations[i];
			};
			data.documentIterations = iterations;
			// Flag for templating
			// Use form if checkedout
			data.documentIterations[1]["lastIteration?"] = true;
			if (data.checkOutDate) {
				data.documentIterations[1]["editable?"] = true;
			};

			// Format dates
			if (data.creationDate) {
				data.creationDate = date.formatTimestamp(
					i18n._DATE_FORMAT,
					data.creationDate);
			}
			if (data.checkOutDate) {
				data.checkOutDate = date.formatTimestamp(
					i18n._DATE_FORMAT,
					data.checkOutDate);
			}
			return data;
		},
		renderAt: function (offset) {
			this.offset = offset;
			if (DocumentEditView._oldInstance) {
				DocumentEditView._oldInstance.hide();
				_.delay(this.render, 100);
			} else {
				this.render();
			}
		},
		rendered: function () {
			this.$el.css("left", this.offset.x)
			if (this.model.get("checkOutDate")) {
				var lastiteration = this.model.lastIteration;
				this.iterationEditView = this.addSubView(
					new IterationEditView({
						el: "#tab-iteration-" + lastiteration.id + "-" + this.cid,
						model: lastiteration
					})
				).render();
			}
		},
		hide: function () {
			var that = this;
			this.$el.fadeOut(250, function () {
				that.destroy();
			});
		},
		closeAction: function () {
			this.hide();
			return false;
		},
	});
	return DocumentEditView;
});
