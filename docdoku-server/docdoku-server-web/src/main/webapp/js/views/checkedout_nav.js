define([
	"common/singleton_decorator",
	"views/base",
	"views/checkedout_content_list",
	"text!templates/checkedout_nav.html"
], function (
	singletonDecorator,
	BaseView,
	CheckedoutContentListView,
	template
) {
	var CheckedoutNavView = BaseView.extend({
		template: Mustache.compile(template),
		el: "#checkedout_nav",
		initialize: function () {
			BaseView.prototype.initialize.apply(this, arguments);
			this.render();
		},
		setActive: function () {
			$("#nav .active").removeClass("active");
			this.$el.find(".nav-list-entry").first().addClass("active");
		},
		showContent: function () {
			this.setActive();
			this.addSubView(
				new CheckedoutContentListView()
			).render();
		},
	});
	CheckedoutNavView = singletonDecorator(CheckedoutNavView);
	return CheckedoutNavView;
});
