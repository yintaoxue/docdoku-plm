define([
    "i18n",
    "models/workspace",
    "views/search/search"
], function (i18n, Workspace, SearchView) {

    kumo.debug("starting fake Search application");
    var workspace = new Workspace({
        id: "takata"
    }).fetch({
        success : function(model){
            kumo.debug(model, "found workspace")
            startView(model);
        }
    });


    function startView(workspace){
        var searchView = new SearchView({
            workspace : workspace
        }).render();
        $("body").append(searchView.$el);
    }




});
