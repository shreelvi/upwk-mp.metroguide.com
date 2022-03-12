ko.bindingHandlers.showModal = {
    init: function (element, valueAccessor) { },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
            // this is to focus input field inside dialog
            $("input", element).focus();
        }
        else {
            $(element).modal('hide');
        }
    }
};
