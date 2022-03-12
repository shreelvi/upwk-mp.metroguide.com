var checkedLink = function (data) {
    var self = this;

    self.id = null;
    self.url = ko.observable();
    self.urlId = null;
    self.timeChecked = null;
    self.exceptionMessage = ko.observable();
    self.status = null;
    self.timeTaken = null;
    self.endUrl = null;
    self.comments = ko.observable();
           
    self.fakeTitle = ko.observable();
    self.hierarchyLoading = ko.observable(false);
    self.folderHierarchy = ko.observableArray([]);

    self.update(data);
};

checkedLink.prototype.update = function (data) {
    var self = this;

    self.id = data.id || null;
    self.url(data.url || "");
    self.urlId = data.urlId || null;
    self.timeChecked = moment(data.timeChecked).format('MM/DD/YYYY hh:mm a') || null;
    self.exceptionMessage(data.exceptionMessage || '');
    self.status = data.status || null;
    self.timeTaken = data.timeTaken || null;
    self.endUrl = data.endUrl || null;
    self.comments(data.comments || "");
};