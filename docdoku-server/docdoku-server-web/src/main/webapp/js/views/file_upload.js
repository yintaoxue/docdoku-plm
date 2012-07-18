define([
	"views/base",
	"text!templates/file_upload.html"
], function (
	BaseView,
	template
) {
	var FileUploadView = BaseView.extend({
		template: Mustache.compile(template),
		tagName:  "li",
		className: "list-item",
		initialize: function () {
			BaseView.prototype.initialize.apply(this, arguments);
			this.events["click .upload"] = this.upload;
			this.events["click .remove"] = this.destroy;
		},
		upload: function () {
			var form = document.getElementById("form-" + this.cid);
			if (form.upload.value) {
				var filename = form.upload.value.split(/(\\|\/)/g).pop();
				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener("progress", this.progress, false);
				xhr.addEventListener("load", this.load, false);
				xhr.addEventListener("error", this.error, false);
				xhr.addEventListener("abort", this.abort, false);
				xhr.open("POST", this.model.fileUploadUrl() + "/" + filename);

                var files = $('input[type=file]');
                var fd = new FormData();
                fd.append("testKey", "testValue");

                for (var i = 0 ; i <files.length ; i++){
                    var fileId = files[i].id;
                    var html5File = document.getElementById(fileId);
                    fd.append("upload", html5File.files[0]);
                }

				xhr.send(fd);
			} else {
				// Nothing to upload
				this.trigger("finished", evt, this);
			}
			return false;
		},
		progress: function (evt) {
			console.debug("progress", evt, this);
		},
		load: function (evt) {
			this.trigger("success", evt, this);
			this.trigger("finished", evt, this);
		},
		error: function (evt) {
			this.trigger("error", evt, this);
			this.trigger("finished", evt, this);
		},
		abort: function (evt) {
			this.trigger("finished", evt, this);
		}
	});
	return FileUploadView;
});
