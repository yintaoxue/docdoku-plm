define([
	"views/content",
	"views/workflow_list",
	//"views/workflow_new",
	"text!templates/workflow_content_list.html"
], function (
	ContentView,
	WorkflowListView,
	//WorkflowNewView,
	template
) {
	var WorkflowContentListView = ContentView.extend({
		template: Mustache.compile(template),
		initialize: function () {
			ContentView.prototype.initialize.apply(this, arguments);
			this.events["click .actions .new"] = "actionNew";
			this.events["click .actions .delete"] = "actionDelete";
		},
		rendered: function () {
			this.listView = this.addSubView(
				new WorkflowListView({
					el: "#list-" + this.cid,
				})
			);
			this.listView.collection.fetch();
			this.listView.on("selectionChange", this.selectionChanged);
			this.selectionChanged();
		},
		selectionChanged: function () {
			var showOrHide = this.listView.checkedViews().length > 0
			var action = showOrHide ? "show" : "hide";
			this.$el.find(".actions .delete")[action]();
		},
		actionNew : function () {
			var view = this.addSubView(
				new WorkflowNewView()
			).render();
			return false;
		},
		actionDelete: function () {
			this.listView.eachChecked(function (view) {
				view.model.destroy();
			});
			return false;
		},
	});
	return WorkflowContentListView;
});
