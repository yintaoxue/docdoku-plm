define([
    "models/document_iteration"
], function (DocumentIteration) {

    var LinkedDocumentCollection = Backbone.Collection.extend({
        model: DocumentIteration

        //parse : {} // there will probably something to do there
    });

    LinkedDocumentCollection.className="LinkedDocumentCollection";
    return LinkedDocumentCollection;
});

