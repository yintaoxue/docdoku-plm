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
        id : APP_CONFIG.workspaceId
    }).fetch({
        success : function(model){
            kumo.debug(model, "found workspace")
            startView(model);
        },error : function(e){
            kumo.debug (e, "error getting the workspace")
        }
    });


    function startView(workspace){
        new WorkspaceView({
            el: "#workspace",
            model: this.workspace
        }).render();
        Router.getInstance();
        Backbone.history.start();
    }


});
