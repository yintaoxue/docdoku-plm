define([
    "i18n",
    "collections/attribute_collection",
    "text!templates/search/accordion.html"
], function (i18n, AttributeCollection, accordionTemplate) {

    var SearchView = Backbone.View.extend({

        tagName:"div",
        className:"accordion document-search",
        id:"document-search",

        defaults:{

        },

        initialize:function () {
            kumo.assertNotEmpty(this.options.workspaceId, "the search component needs the workspaceId");
            var self = this;
            this.model = new SearchModel();
            this.model.on("change", function () {
                kumo.debug(self.model);
            });
            this.workspaceData = new WorkspaceData({workspaceId:this.options.workspaceId})//.fetch();
        },

        render:function () {

            var html = Mustache.render(accordionTemplate, {
                templates:this.workspaceData.get("templates"),
                authors:this.workspaceData.get("authors"),
                tags:this.workspaceData.get("tags")
            });
            this.$el.html(html);
            return this;
        }



    });

    var SearchModel = Backbone.Model.extend({

        defaults:{
            reference:null,
            title:null,
            type:null,
            version:null,
            author:null,
            creationStart:null,
            creationEnd:null,
            attributes:new Backbone.Collection(),
            tags:[],
            text:null
        }

    });


    return SearchView;


});
