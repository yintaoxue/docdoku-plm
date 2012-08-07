define([
    "i18n",
    "views/search/search"
], function (i18n, SearchView) {


    kumo.debug("starting fake Search application");
    var searchView = new SearchView({
        workspaceId : "takata"
    }).render();
    $("body").append(searchView.$el);

});
