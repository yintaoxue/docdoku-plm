define(["i18n", "collections/template_collection", "collections/tag"],
    function (i18n, TemplateCollection, TagList) {
        var Workspace = Backbone.Model.extend({
            initialize:function () {
                this.className = "Workspace";
                kumo.assertNotEmpty(this.get("id"), "no workspace id set");
            },

            parse : function(data){
                kumo.debug("receiving datas : ");
                kumo.debug(data);
            },
/*
            defaults:{
                templates:new TemplateCollection(),
                documentTypes:[],
                authors:["Madoff", "Nicolas", "Ibrahimovic"],
                tags : new TagList(),
                loaded : false
            },*/

            url:function () {
                var url ="/api/workspaces/" + this.get("id");
                return url;
            }
        });
        return Workspace;
    });
