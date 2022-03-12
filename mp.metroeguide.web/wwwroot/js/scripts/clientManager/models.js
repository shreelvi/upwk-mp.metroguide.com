// CLIENTS
var Client = function (data) {
    this.id = -1; //set as a placeholder so knockout doesn't bitch with templates
    this.name = ko.observable();
    this.userId = ko.observable();
    this.password = ko.observable();
    this.modified = ko.observable();

    this.cache = function () { };
    this.update(data);

    this.ILink = new ILink({});
    this.communityProfiles = ko.observableArray([]);
    this.loading = ko.observable(false);
};

ko.utils.extend(Client.prototype, {
    update: function (data) {
        this.id = data.id || -1;
        this.name(data.name || '');
        this.userId(data.userId || '');
        this.password(data.password || '');
        this.modified('modified' in data ? moment(data.modified, 'YYYY-MM-DD HH:mm') : null);

        if (data.hasOwnProperty('ILink')) {
            this.ILink.update(data.ILink);
        }
    }
});


// ILINKS (MORE INFO ABOUT THE CLIENT, STUPID NAMING, CONSIDER CHANGING)
var ILink = function (data) {
    this.id = -1;
    this.clientId = -1;
    this.clientLogoImageSrc = ko.observable();
    this.clientLogoImageHref = ko.observable();
    this.clientLogoImageTarget = ko.observable();
    this.productLogoImageSrc = ko.observable();
    this.productLogoImageHref = ko.observable();
    this.productLogoImageTarget = ko.observable();
    this.backAnchorText = ko.observable();
    this.backAnchorUrl = ko.observable();
    this.backAnchorTarget = ko.observable();

    this.cache = function () { };
    this.update(data);
}

ko.utils.extend(ILink.prototype, {
    update: function (data) {
        this.id = data.id || -1;
        this.clientId = data.clientId || -1;
        this.clientLogoImageSrc(data.clientLogoImageSrc || '');
        this.clientLogoImageHref(data.clientLogoImageHref || '');
        this.clientLogoImageTarget(data.clientLogoImageTarget || '');
        this.productLogoImageSrc(data.productLogoImageSrc || '');
        this.productLogoImageHref(data.productLogoImageHref || '');
        this.productLogoImageTarget(data.productLogoImageTarget || '');
        this.backAnchorText(data.backAnchorText || '');
        this.backAnchorUrl(data.backAnchorUrl || '');
        this.backAnchorTarget(data.backAnchorTarget || '');
    }
});




///pasted and not yet converted
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
            if (i > index)
                removeList.push(folder);
        });

        self.Parent().foldersList.removeAll(removeList);
        self.Parent().changeFolder(newValue);
    });
};

