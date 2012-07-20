define([
	"i18n",
	"common/date",
    "collections/attached_file_collection"
], function (
	i18n,
	date,
    AttachedFileCollection
) {
	var DocumentIteration = Backbone.Model.extend({
		idAttribute: "iteration",
		initialize: function () {
            var self = this;
            this.className = "DocumentIteration";
			_.bindAll(this);

            var attachedFiles = new AttachedFileCollection(this.get("attachedFiles"));
            this.set("attachedFiles",  attachedFiles);
            attachedFiles.forEach(function(file){
               file.set("documentIteration", self);
            });

            //For the moment, DocumentIteration is built BEFORE the document
            //kumo.assertNotEmpty(this.getDocument(), "no valid document assigned");
            //kumo.assertNotEmpty(this.getIteration(), "no iteration assigned");

            kumo.assert(this.getIteration() == this.id, "id attribute should be the iteration");

		},
        defaults :{
            attachedFiles :[]
        },
		fileUploadUrl: function () {
			var doc = this.collection.document;
            return this.getDocument().getUrl()+"/iterations/"+this.getIteration();
		},

        getDocument : function(){
            return this.get("document");
        },
        getIteration : function(){
            return this.get("iteration");
        },
        getDocKey : function(){
            return  this.get("documentMasterId")+"-"+this.get("documentMasterVersion");
        },
        getUrl : function(){
            kumo.assertNotAny([ this.get("workspaceId"), this.get("documentMasterId"), this.get("documentMasterVersion")]);
            var baseUrl ="/api/workspaces/" + this.get("workspaceId")+ "/documents/"+this.getDocKey();
            return baseUrl+"/iterations/"+this.getIteration();
        }
	});
	return DocumentIteration;
});
