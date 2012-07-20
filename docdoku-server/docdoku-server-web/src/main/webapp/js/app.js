//tricks for referencement in IDE
APP_CONFIG = APP_CONFIG;
APP_CONFIG.workspaceId = APP_CONFIG.workspaceId;
APP_CONFIG.login = APP_CONFIG.login;

define([
	"router",
	"models/workspace",
	"views/workspace"
], function (
	Router,
	Workspace,
	WorkspaceView
) {
	var workspace = new Workspace({
		id: APP_CONFIG.workspaceId
	});
	new WorkspaceView({
		el: "#workspace",
		model: this.workspace
	}).render();

	Router.getInstance();
	Backbone.history.start();
});
