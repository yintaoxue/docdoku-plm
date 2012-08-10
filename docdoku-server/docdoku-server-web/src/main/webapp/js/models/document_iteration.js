define([
	"i18n",
	"common/date",
    "collections/attribute_collection",
    "collections/attached_file_collection",
    "collections/linked_document_collection"
], function (
	i18n,
	date,
    AttributeCollection,
    AttachedFileCollection,
    LinkedDocumentCollection
) {
	var DocumentIteration = Backbone.Model.extend({
		//idAttribute: "iteration",
		initialize: function () {
            var self = this;
            this.className = "DocumentIteration";
            this.id = this.getReference();
            this.isLink = false;
			//_.bindAll(this);

            var attributes = new AttributeCollection(this.get("instanceAttributes"));

            var filesMapping = _.map(this.get("attachedFiles"), function(fullName){
                return {
                    "fullName":fullName,
                    shortName : _.last(fullName.split("/")),
                    created : true
                }
            });
            var attachedFiles = new AttachedFileCollection(filesMapping);

            //'attributes' is a special name for Backbone
            this.set("instanceAttributes", attributes);
            this.set("attachedFiles",  attachedFiles);

            var uploadUrl = this.getUploadUrl();
            attachedFiles.forEach(function(file){
               file.set("uploadUrl", uploadUrl);
                file.set("documentIteration", self);
            });

            attributes.forEach(function(attr){
              //  attr.set("documentIteration", self);
            });


            kumo.assertNotAny([ this.get("workspaceId"), this.get("documentMasterId"), this.get("documentMasterVersion")]);

		},

        /**
         * implementation is : return _.clone(this.attributes);
         * Deep copy of nested attributes
         * See http://backbonejs.org/#FAQ-nested for more documentation
         */
        toJSON : function(){
            var attr = _.clone(this.attributes);
            delete attr.document;

            for (var key in attr){
                var value = attr[key];
                if (value instanceof Backbone.Model){
                    attr[key] = value.toJSON();
                }
                if (value instanceof Backbone.Collection){
                    var array = [];
                    value.each(function(item){
                       array.push(item.toJSON());
                    });
                    attr[key] = array;
                }
            }

            if (this.isLink){
                delete attr.linkedDocuments;
                delete attr.instanceAttributes;
                delete attr.attachedFiles;
            }
            return attr;
        },

        parse : function(data){

        },

        defaults :{
            attachedFiles :[],
            instanceAttributes : [],
            linkedDocuments : new LinkedDocumentCollection()
        },

        getAttachedFiles : function(){
          return this.get("attachedFiles");
        },

        getAttributes : function(){
            return this.get("instanceAttributes");
        },

        getWorkspace : function(){
            return this.get("workspaceId");
        },

        getDocument : function(){
            return this.get("document");
        },

        getReference : function(){
            return this.getDocKey()+"-"+this.getIteration();
        },

        getIteration : function(){
            return this.get("iteration");
        },
        getDocKey : function(){
            return  this.get("documentMasterId")+"-"+this.get("documentMasterVersion");
        },

        url : function(){
            kumo.assertNotAny([ this.get("workspaceId"), this.get("documentMasterId"), this.get("documentMasterVersion")]);
            var baseUrl ="/api/workspaces/" + this.get("workspaceId")+ "/documents/"+this.getDocKey();
            return baseUrl+"/iterations/"+this.getIteration();


        },
        //TODO : deprecated
        getUrl : function(){
            return this.url();
        },
        /**
         *
         * file Upload uses the old servlet, not the JAXRS Api         *
         * return /files/{workspace}/documents/{docId}/{version}/{iteration}/{shortName}
         * @param shortName shortName of the file
         * @returns string
         */
        getUploadUrl: function (shortName) {
           // var doc = this.collection.document;

            return "/files/"
                + this.getWorkspace()
                + "/documents/"
                + this.getDocKey().split("-").join("/") // 'doc-B' gives 'doc/B'
                + "/"+this.getIteration()+"/"+shortName
        }
	});
	return DocumentIteration;
});
