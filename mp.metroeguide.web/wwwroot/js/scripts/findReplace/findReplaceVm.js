function FindReplaceVm() {
    var self = this;

    self.loading = ko.observable(true);

    self.searchTitle = ko.observable('');
    self.searchUrl = ko.observable('');
    self.replaceTitle = ko.observable('');
    self.replaceUrl = ko.observable('');

    self.foundLinks = ko.observableArray();

    self.activate = function () {
        self.loading(false);
    };

    self.find = function () {
        var searchTitle = self.searchTitle();
        var searchUrl = self.searchUrl();

        dataService.links.find(searchTitle, searchUrl).done(function (data, status, xhr) {
            $.each(data.result, function (k, v) {
                self.foundLinks.push({ id: v.id, title: v.title, url: v.url });
            });
        });
    };

    self.activate();
}