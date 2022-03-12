ko.bindingHandlers.img = {
    update: function (element, valueAccessor) {
        //grab the value of the parameters, making sure to unwrap anything that could be observable
        var value = ko.utils.unwrapObservable(valueAccessor()),
            src = ko.utils.unwrapObservable(value.src),
            fallback = ko.utils.unwrapObservable(value.fallback),
            $element = $(element);

        //now set the src attribute to either the bound or the fallback value
        if (src) {
            $element.attr("src", src);
        } else {
            $element.attr("src", fallback);
        }
    },
    init: function (element, valueAccessor) {
        var $element = $(element);

        //hook up error handling that will unwrap and set the fallback value
        $element.error(function () {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                fallback = ko.utils.unwrapObservable(value.fallback);

            $element.attr("src", fallback);
        });
    },
};