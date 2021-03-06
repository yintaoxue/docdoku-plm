define([
	"common/singleton_decorator",
	"views/base",
	"views/template_content_list",
	"text!templates/template_nav.html"
], function (
	singletonDecorator,
	BaseView,
	TemplateContentListView,
	template
) {
	var TemplateNavView = BaseView.extend({
		template: Mustache.compile(template),
		el: "#template-nav",
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
				new TemplateContentListView()
			).render();
		},
	});
	TemplateNavView = singletonDecorator(TemplateNavView);
	return TemplateNavView;
});
