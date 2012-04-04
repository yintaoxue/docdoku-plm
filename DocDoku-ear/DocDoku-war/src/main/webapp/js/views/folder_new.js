FolderNewView = ModalView.extend({
	tagName: "div",
	template: "folder-new-tpl",
	initialize: function () {
		ModalView.prototype.initialize.apply(this, arguments);
		this.events = _.extend(this.events, {
			"submit form": "primaryAction",
		});
	},
	primaryAction: function () {
		this.nameInput = this.$el.find("input.name").first();
		var name = this.nameInput.val();
		if (name) {
			this.collection.create({
				name: name
			}, {
				success: this.success,
				error: this.error
			});
		}
		return false;
	},
	success: function () {
		this.hide();
		this.parentView.show();
	},
	error: function (model, error) {
		if (error.responseText) {
			this.alert({
				type: "error",
				message: error.responseText
			});
		} else {
			console.error(error);
		}
	}
});
