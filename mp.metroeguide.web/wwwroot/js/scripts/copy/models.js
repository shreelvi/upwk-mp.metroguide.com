var AzPage = function (data) {
    this.id = ko.observable();
    this.folderId = ko.observable();
    this.title = ko.observable();
    this.metaKeys = ko.observable();
    this.metaDesc = ko.observable();
    this.route = ko.observable();
    this.zipcode = ko.observable();
    this.comments = ko.observable();
    this.headerHtml = ko.observable();
    this.footerHtml = ko.observable();
    this.autoOrdering = ko.observable();
    this.canonicalUrl = ko.observable();

    this.cache = function () { };
    this.update(data);
};

ko.utils.extend(AzPage.prototype, {
    update: function (data) {
        this.id(data.id || 0);
        this.folderId(data.folderId || 0);
        this.title(data.title || '');
        this.metaKeys(data.metaKeys || '');
        this.metaDesc(data.metaDesc || '');
        this.route(data.route || '');
        this.zipcode(data.zipcode || '');
        this.comments(data.comments || '');
        this.headerHtml(data.extraHtml || '');
        this.footerHtml(data.footerHtml || '');
        this.autoOrdering = ko.observable(data.autoOrdering || '');
        this.canonicalUrl = ko.observable(data.canonicalUrl || '');
    }
});

var AzLink = function (data) {
    this.id = ko.observable();
    this.pageId = ko.observable();
    this.position = ko.observable();
    this.isLink = ko.observable();
    this.title = ko.observable();
    this.url = ko.observable();
    this.target = ko.observable();
    this.comments = ko.observable();

    this.cache = function () { };
    this.update(data);
};

ko.utils.extend(AzLink.prototype, {
    update: function (data) {
        this.id(data.id || 0);
        this.pageId(data.pageId || 0);
        this.position(data.position || 0);
        this.isLink(data.isLink || false);
        this.title(data.title || '');
        this.url(data.url || '');
        this.target(data.target || '');
        this.comments = ko.observable(data.comments || '');

        this.cache.latestData = data;
    },
    revert: function () {
        this.update(this.cache.latestData);
    },
    commit: function () {
        this.cache.latestData = ko.toJS(this);
    }
});

var FolderList = function (data, parent) {
    var self = this;
    self.Parent = ko.observable(parent);

    self.folders = ko.observableArray(data);
    self.selection = ko.observable();
    self.folderName = ko.computed(function () {
        var folderName = "";

        $.each(self.folders(), function (i, folder) {
            if (folder.id == self.selection()) {
                folderName = folder.name;
            }
        });

        return folderName;
    })

    self.selection.subscribe(function (newValue) {
        var index = self.Parent().foldersList().indexOf(self);
        var removeList = [];

        $.each(self.Parent().foldersList(), function (i, folder) {
            if(i > index) 
                removeList.push(folder);
        });

        self.Parent().foldersList.removeAll(removeList);
        self.Parent().changeFolder(newValue);
    });
};

