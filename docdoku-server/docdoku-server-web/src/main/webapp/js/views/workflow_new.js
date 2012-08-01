/**
 * Created with IntelliJ IDEA.
 * User: yannsergent
 * Date: 01/08/12
 * Time: 15:12
 * To change this template use File | Settings | File Templates.
 */

define([
    "views/components/modal",
    "text!templates/workflow_new.html"
], function (
    ModalView,
    template
    ) {
    var WorkflowNewView = ModalView.extend({
        template: Mustache.compile(template),
        tagName: "div",
        initialize: function () {
            ModalView.prototype.initialize.apply(this, arguments);
            this.events["submit form"] = "primaryAction";
        },
        primaryAction: function () {
            this.nameInput = this.$el.find("input.name").first();
            var name = this.nameInput.val();
            if (name) {
                this.collection.create({
                    name: name
                }, {
                    success: this.success,
                    error: this.error
                });
            }
            return false;
        },
        success: function () {
            this.hide();
            this.parentView.show();
        },
        error: function (model, error) {
            if (error.responseText) {
                this.alert({
                    type: "error",
                    message: error.responseText
                });
            } else {
                console.error(error);
            }
        }
    });
    return WorkflowNewView;
});

