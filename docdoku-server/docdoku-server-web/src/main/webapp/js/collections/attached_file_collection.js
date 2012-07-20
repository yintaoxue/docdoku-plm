define([
    "models/attached_file"
], function (
    AttachedFileModel
    ) {
    var AttachedFileCollection = Backbone.Collection.extend({
        model: AttachedFileModel, // model is a Model
        url: function () {

        }
    });
    AttachedFileCollection.className="AttachedFileCollection";
    return AttachedFileCollection;
});
