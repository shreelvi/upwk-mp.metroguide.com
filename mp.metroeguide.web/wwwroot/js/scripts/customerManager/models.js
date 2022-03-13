// CUSTOMERS
var Customer = function (data) {
    this.id = -1; //set as a placeholder so knockout doesn't bitch with templates
    this.clientId = -1;
    this.name = ko.observable();
    this.userId = ko.observable();
    this.password = ko.observable();
    this.modified = ko.observable();
    this.css = ko.observable();
    this.comments = ko.observable();
    this.clientLogoImageSrc = ko.observable();
    this.clientLogoImageHref = ko.observable();
    this.clientLogoImageTarget = ko.observable();
    this.productLogoImageSrc = ko.observable();
    this.productLogoImageHref = ko.observable();
    this.productLogoImageAlt = ko.observable();
    this.productLogoImageTarget = ko.observable();
    this.backAnchorText = ko.observable();
    this.backAnchorUrl = ko.observable();
    this.backAnchorTarget = ko.observable();
    this.communityProfileIds = ko.observable();
    this.clientLogoImageAlt = ko.observable();
    this.mainTitle = ko.observable();
    this.centerGraphic = ko.observable();
    this.centerGraphicLinkUrl = ko.observable();
    this.topLeftGraphicUrl = ko.observable();
    this.topLeftGraphicTarget = ko.observable();
    this.leftButtonCount = ko.observable();
    this.leftButtonLinkPageId = ko.observable();
    this.megGraphicUrl = ko.observable();
    this.searchFolders = ko.observable();
    this.rightButtonCount = ko.observable();
    this.rightButtonLinkPageId = ko.observable();
    this.companyGraphicUrl = ko.observable();
    this.companyName = ko.observable();
    this.email = ko.observable();
    this.phoneNumber = ko.observable();
    this.phoneNumber2 = ko.observable();
    this.faxNumber = ko.observable();
    this.streetAddress = ko.observable();
    this.city = ko.observable();
    this.state = ko.observable();
    this.zip = ko.observable();
    this.otherInformation = ko.observable();
    this.mobileLogoUrl = ko.observable();
    this.mobileUrl = ko.observable();
    this.mobileGraphicPhoneNumber = ko.observable();
    this.homePageTitle = ko.observable();
    this.seoMetaKeys = ko.observable();
    this.seoMetaDesc = ko.observable();
    this.analyticsKey = ko.observable();
    this.pageBackgroundColor = ko.observable();
    this.mainTitleFontFamily = ko.observable();
    this.mainTitleFontSize = ko.observable();
    this.mainTitleFontColor = ko.observable();
    this.centerGraphicBorderColor = ko.observable();
    this.centerGraphicBorderThickness = ko.observable();
    this.copyrightFontSize = ko.observable();
    this.copyrightFontColor = ko.observable();
    this.copyrightFontFamily = ko.observable();
    this.realtorGraphicUrl = ko.observable();
    this.buttonBorderThickness = ko.observable();
    this.buttonBorderColor = ko.observable();
    this.buttonTitleFontColor = ko.observable();
    this.buttonTitleFontFamily = ko.observable();
    this.buttonTitleFontWeight = ko.observable();
    this.buttonBackgroundColor = ko.observable();
    this.buttonMouseoverBgColor = ko.observable();
    this.buttonMouseoverBorderColor = ko.observable();
    this.buttonMouseoverFontColor = ko.observable();

    this.cache = function () { };
    this.update(data);

    this.ILink = new ILink({});
    this.communityProfiles = ko.observableArray([]);
    this.loading = ko.observable(false);
};

ko.utils.extend(Customer.prototype, {
    update: function (data) {
        this.id = data.id || -1;
        this.clientId = data.clientId || -1;
        this.name(data.name || '');
        this.userId(data.userId || '');
        this.password(data.password || '');
        this.modified('modified' in data ? moment(data.modified, 'YYYY-MM-DD HH:mm') : null);
        this.css(data.css || '');
        this.comments(data.comments || '');
        this.clientLogoImageSrc(data.clientLogoImageSrc || '');
        this.clientLogoImageHref(data.clientLogoImageHref || '');
        this.clientLogoImageTarget(data.clientLogoImageTarget || '');
        this.productLogoImageSrc(data.productLogoImageSrc || '');
        this.productLogoImageHref(data.productLogoImageHref || '');
        this.productLogoImageAlt(data.productLogoImageAlt || '');
        this.productLogoImageTarget(data.productLogoImageTarget || '');
        this.backAnchorText(data.backAnchorText || '');
        this.backAnchorUrl(data.backAnchorUrl || '');
        this.backAnchorTarget(data.backAnchorTarget || '');
        this.communityProfileIds(data.communityProfileIds || '');
        this.clientLogoImageAlt(data.clientLogoImageAlt || '');
        this.mainTitle(data.mainTitle || '');
        this.centerGraphic(data.centerGraphic || '');
        this.centerGraphicLinkUrl(data.centerGraphicLinkUrl || '');
        this.topLeftGraphicUrl(data.topLeftGraphicUrl || '');
        this.topLeftGraphicTarget(data.topLeftGraphicTarget || '');
        this.leftButtonCount(data.leftButtonCount || -1);
        this.leftButtonLinkPageId(data.leftButtonLinkPageId || -1);
        this.megGraphicUrl(data.megGraphicUrl || '');
        this.searchFolders(data.searchFolders || '');
        this.rightButtonCount(data.rightButtonCount || -1);
        this.rightButtonLinkPageId(data.rightButtonLinkPageId || -1);
        this.companyGraphicUrl(data.companyGraphicUrl || '');
        this.companyName(data.companyName || '');
        this.email(data.email || '');
        this.phoneNumber(data.phoneNumber || '');
        this.phoneNumber2(data.phoneNumber2 || '');
        this.faxNumber(data.faxNumber || '');
        this.streetAddress(data.streetAddress || '');
        this.city(data.city || '');
        this.state(data.state || '');
        this.zip(data.zip || '');
        this.otherInformation(data.otherInformation || '');
        this.mobileLogoUrl(data.mobileLogoUrl || '');
        this.mobileUrl(data.mobileUrl || '');
        this.mobileGraphicPhoneNumber(data.mobileGraphicPhoneNumber || '');
        this.homePageTitle(data.homePageTitle || '');
        this.seoMetaKeys(data.seoMetaKeys || '');
        this.seoMetaDesc(data.seoMetaDesc || '');
        this.analyticsKey(data.analyticsKey || '');
        this.pageBackgroundColor(data.pageBackgroundColor || '');
        this.mainTitleFontFamily(data.mainTitleFontFamily || '');
        this.mainTitleFontSize(data.mainTitleFontSize || -1);
        this.mainTitleFontColor(data.mainTitleFontColor || '');
        this.centerGraphicBorderColor(data.centerGraphicBorderColor || '');
        this.centerGraphicBorderThickness(data.centerGraphicBorderThickness || -1);
        this.copyrightFontSize(data.copyrightFontSize || -1);
        this.copyrightFontColor(data.copyrightFontColor || '');
        this.copyrightFontFamily(data.copyrightFontFamily || '');
        this.realtorGraphicUrl(data.realtorGraphicUrl || '');
        this.buttonBorderThickness(data.buttonBorderThickness || -1);
        this.buttonBorderColor(data.buttonBorderColor || '');
        this.buttonTitleFontColor(data.buttonTitleFontColor || '');
        this.buttonTitleFontFamily(data.buttonTitleFontFamily || '');
        this.buttonTitleFontWeight(data.buttonTitleFontWeight || '');
        this.buttonBackgroundColor(data.buttonBackgroundColor || '');
        this.buttonMouseoverBgColor(data.buttonMouseoverBgColor || '');
        this.buttonMouseoverBorderColor(data.buttonMouseoverBorderColor || '');
        this.buttonMouseoverFontColor(data.buttonMouseoverFontColor || '');
    }
});

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
    });

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

