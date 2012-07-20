define([
	"views/base",
	"views/attachedfiles/file_upload",
	"text!templates/attachedfiles/iteration_edit_files.html",
    "i18n"
], function (
	BaseView,
	FileUploadView,
	template,
    i18n
) {
	var IterationEditFilesView = BaseView.extend({
		template: Mustache.compile(template),
		initialize: function () {
			BaseView.prototype.initialize.apply(this, arguments);
			this.events["click .add"] = this.addUpload;
            kumo.assertNotEmpty(this.model, "no model defined in IterationEditFilesView");
            kumo.assert (this.model.className=="DocumentIteration", "model should be a DocumentIteration");


            //list of further uploaded files view
			this.uploadViews = [];
		},

        getDocumentIteration : function(){
          return this.model;
        },

		addUpload: function () {
            //Add the view for uploading one file to the list of currently uploaded files
			var view = this.addSubView(
				new FileUploadView({
					model: this.model
				})
			).render();
			$("#file-uploads-" + this.cid).append(view.el);
			this.uploadViews.push(view);
		},
		save: function (options) {
			this.deleteFiles();
			this.uploadFiles();
		},
        render : function(){
            var data = {files :[], _:i18n, cid:this.cid}

            //current model is a DocumentIteration
            var files = this.model.get("attachedFiles");



            function build (file){
                data.files.push(
                    {
                        "shortName":file.getShortName(),
                        "fullName":file.getFullName()
                    }
                );
            }

            _.each(files.models, build);

            var elt = $(this.el);
            var html = this.template(data);
            elt.html(html);



        },
		deleteFiles: function () {
            var iterUrl = this.getDocumentIteration().getUrl();

            //TODO we should declare events into view AttachedFileView and then call the AttachedFileModel
			this.$el.find(".file-delete:checked").each(function () {
				var shortName = $(this).attr("value");
                var url = iterUrl+"/files/"+shortName;
				$.ajax(url, {
					type: "DELETE"
				});
			});
		},
		uploadFiles: function () {
			this.finishedUploads = [];
			var that = this;

			_.map(this.uploadViews, function (view) {
				view.bind("success", that.uploadSuccess);
				view.bind("error", that.uploadError);
				view.bind("finished", that.uploadFinished);
				view.upload();
			});
		},
		uploadFinished: function (evt) {
			this.finishedUploads.push(evt);
			if (this.finishedUploads.length == this.uploadViews.length) {
				_.map(this.uploadViews, function (view) {
					view.destroy();
				});
				this.trigger("saved");
			}
		},
		uploadSuccess: function (evt) {
		},
		uploadError: function (evt) {
		}
	});
	return IterationEditFilesView;
});
