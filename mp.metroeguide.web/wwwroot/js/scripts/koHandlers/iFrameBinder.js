ko.bindingHandlers.bindIframe = {
    init: function (element, valueAccessor, allBindings) {
        $(element).hide();
    },
    update: function (element, valueAccessor, allBindings, bindingContext) {
        bindingContext.iframeLoaded(false);

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        $(element).hide();

        var link = ko.unwrap(valueAccessor());
        if (link.id != 0) {
            var iframe = document.createElement('iframe');
            iframe.src = link.url();
            iframe.height = '600';
            iframe.width = '100%';
            iframe.onload = function () {
                bindingContext.iframeLoaded(true);
                $(element).show();
            }
            
            $(element).append(iframe);
        }
    }
}