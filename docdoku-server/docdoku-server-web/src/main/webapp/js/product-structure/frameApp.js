var sceneManager;

define([
    "collections/part_collection"
], function (
    PartCollection
    ) {

    var FrameAppView = Backbone.View.extend({

        el: $("#workspace"),

        initialize: function() {
            var self = this;
            sceneManager = new SceneManager();
            var allParts = new PartCollection();
            allParts.bind('reset', function() {
                self.parseAllParts(allParts.models);
            });
            allParts.fetch();
            sceneManager.init();
        },

        parseAllParts: function(parts) {
            _.each(parts, this.parsePart, this);
        },

        parsePart: function(part) {
            part.filtered = true;
            if (part.isNode()) {
                var subParts = new PartCollection();
                subParts.add(part.getComponents());
                this.parseAllParts(subParts.models);
            }
        }

    });

    return FrameAppView;

});