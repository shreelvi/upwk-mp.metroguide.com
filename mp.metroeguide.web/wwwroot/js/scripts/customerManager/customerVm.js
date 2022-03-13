function CustomerVm() {
    var self = this;

    self.activeCustomer = ko.observable(new Customer({}));
    self.customers = ko.observableArray([]);
    self.filteredCustomers = ko.observableArray([]);
    self.activeTab = ko.observable('customerInfo');
    self.filterInput = ko.observable();
    self.throttledFilterInput = ko.observable();

    self.foldersList = ko.observableArray([]);
    self.pages = ko.observableArray([]);

    self.newCustomer = ko.observable();
    self.pendingDeleteCustomer = ko.observable();
    self.pendingDeleteCommunityProfile = ko.observable();

    self.throttledValue = ko.computed(self.filterInput).extend({ throttle: 400 });
    self.throttledValue.subscribe(function (val) {
        if (val !== '')
            self.throttledFilterInput(val);
    });

    self.activeFilter = ko.observable({});
    self.filters = [
        { displayText: 'Recent', value: 'recent' },
        { displayText: '0-9', value: '0123456789' },
        { displayText: 'A-E', value: 'abcde' },
        { displayText: 'F-J', value: 'fghij' },
        { displayText: 'K-O', value: 'klmno' },
        { displayText: 'P-T', value: 'pqrst' },
        { displayText: 'U-Z', value: 'uvwxyz' }
    ];


    self.activate = function () {
        dataService.customers.getCondensed().done(function (data) {
            for (var i = 0; i < data.resultCount; i++) {
                self.customers.push(new Customer(data.result[i]));
            }

            self.activateFilter(self.filters[0]);
            self.changeFolder("-1");
        });
    };

    self.filteredCustomers = ko.computed(function () {
        if (self.throttledFilterInput() != '' && self.throttledFilterInput() != null) {

            self.activeFilter({});
            return ko.utils.arrayFilter(self.customers(), self.throttledFilterInputArrayFilter).sort(self.nameSort);

        } else if (self.activeFilter().value == 'recent') {

            return self.customers.sort(self.recentCustomersSort).slice(0, 20);

        } else if (self.activeFilter().hasOwnProperty('value')) {
            return ko.utils.arrayFilter(self.customers(), self.preGenValueFilter).sort(self.nameSort);
        } else {
            //we are doing nothing initialize
        }
    });
    
    self.addNewCustomer = function () {
        self.newCustomer(new Customer({}));
    };

    self.createCustomer = function () {

        dataService.customers.create(ko.toJSON(self.newCustomer())).done(function (data, status, xhr) {
        });
    };

    self.updateCustomer = function () {
        var customer = ko.toJS(self.activeCustomer());
        var ilink = ko.toJS(customer.ILink);
        delete customer.ILink;

        /*
        //send back the field names the API is expecting
        var customerOB = function (customer) {
            this.id = customer.id;
            this.clientid = customer.clientId;
            this.name = customer.name;
            this.user_id = customer.userId;
            this.password = customer.password;
            this.modified = customer.modified;
            this.clientLogoImageSrc = customer.clientLogoImageSrc;
            this.clientLogoImageHref = customer.clientLogoImageHref;
            this.clientLogoImageTarget = customer.clientLogoImageTarget;
            this.productLogoImageSrc = customer.productLogoImageSrc;
            this.productLogoImageHref = customer.productLogoImageHref;
            this.productLogoImageAlt = customer.productLogoImageAlt;
            this.productLogoImageTarget = customer.productLogoImageTarget;
            this.backAnchorText = customer.backAnchorText;
            this.backAnchorUrl = customer.backAnchorUrl;
            this.backAnchorTarget = customer.backAnchorTarget;
            this.communityProfileIds = customer.communityProfileIds;
            this.clientLogoImageAlt = customer.clientLogoImageAlt;
            this.mainTitle = customer.mainTitle;
            this.centerGraphic = customer.centerGraphic;
            this.centerGraphicLinkUrl = customer.centerGraphicLinkUrl;
            this.top_Left_Graphic_Url = customer.topLeftGraphicUrl;
            this.top_Left_Graphic_Target = customer.topLeftGraphicTarget;
            this.leftButtonCount = customer.leftButtonCount;
            this.leftButtonLinkPageId = customer.leftButtonLinkPageId;
            this.meg_Graphic_Url = customer.megGraphicUrl;
            this.search_Folders = customer.searchFolders;
            this.button_Count = customer.buttonCount;
            this.buttonLinkPageId = customer.buttonLinkPageId;
            this.company_Graphic_Url = customer.companyGraphicUrl;
            this.companyName = customer.companyName;
            this.email = customer.email;
            this.phoneNumber = customer.phoneNumber;
            this.phoneNumber2 = customer.phoneNumber2;
            this.faxNumber = customer.faxNumber;
            this.streetAddress = customer.streetAddress;
            this.city = customer.city;
            this.state = customer.state;
            this.zip = customer.zip;
            this.otherInformation = customer.otherInformation;
            this.mobile_Logo_Url = customer.mobileLogoUrl;
            this.mobile_Url = customer.mobileUrl;
            this.mobile_Graphic_Phone_Number = customer.mobileGraphicPhoneNumber;
            this.home_Page_Title = customer.homePageTitle;
            this.seoMetaKeys = customer.seoMetaKeys;
            this.seoMetaDesc = customer.seoMetaDesc;
            this.analytics_Key = customer.analyticsKey;
            this.page_Background_Color = customer.pageBackgroundColor;
            this.main_Title_Font_Family = customer.mainTitleFontFamily;
            this.mainTitleFontSize = customer.mainTitleFontSize;
            this.main_Title_Font_Color = customer.mainTitleFontColor;
            this.center_Graphic_Border_Color = customer.centerGraphicBorderColor;
            this.center_Graphic_Border_Thickness = customer.centerGraphicBorderThickness;
            this.copyrightFontSize = customer.copyrightFontSize;
            this.copyright_Font_Color = customer.copyrightFontColor;
            this.copyright_Font_Family = customer.copyrightFontFamily;
            this.realtor_Graphic_Url = customer.realtorGraphicUrl;
            this.buttonBorderThickness = customer.buttonBorderThickness;
            this.button_Border_Color = customer.buttonBorderColor;
            this.button_Title_Font_Color = customer.buttonTitleFontColor;
            this.button_Title_Font_Family = customer.buttonTitleFontFamily;
            this.button_Title_Font_Weight = customer.buttonTitleFontWeight;
            this.button_Background_Color = customer.buttonBackgroundColor;
            this.button_Mouseover_Bg_Color = customer.buttonMouseoverBgColor;
            this.button_Mouseover_Border_Color = customer.buttonMouseoverBorderColor;
            this.button_Mouseover_Font_Color = customer.buttonMouseoverFontColor;
        }
        */

        dataService.customers.update(ko.toJSON(customer)).done(function (data, status, xhr) {
            if (xhr.status == 204) {
                toastr.success('Customer Updated Successfully', self.activeCustomer().name());
            } else {
                toastr.error('Update failed to process on the server!', 'Uh-oh!');
            }
        });
    };

    self.confirmDeleteCustomer = function () {
        self.pendingDeleteCustomer(self.activeCustomer());
    };

    self.deleteCustomer = function () {
                dataService.customers.remove(self.activeCustomer().id).done(function (data, status, xhr) {
                    if (xhr.status == 204) {
                        self.customers.remove(self.activeCustomer());
                        self.activeCustomer(new Customer({}));
                        self.pendingDeleteCustomer(null);
                        toastr.success('Customer removed successfully');
                    }
                });
    };

    self.addNewCommunityProfile = function (page) {
        dataService.communityProfiles.create(ko.toJSON({ clientId: self.activeCustomer().clientId, pageId: page.id })).done(function (data, status, xhr) {
            if (xhr.status == 201) {
                toastr.success('Page added to community profiles');
                self.activeCustomer().communityProfiles.push(page);
            }
        });
    };

    self.confirmDeleteCommunityProfile = function (cp) {
        self.pendingDeleteCommunityProfile(cp);
    };

    self.removeCommunityProfile = function (page) {
        dataService.communityProfiles.remove(self.activeCustomer().clientId, page.id).done(function (data, status, xhr) {
            if (xhr.status == 204) {
                self.pendingDeleteCommunityProfile(null);
                toastr.success('Page removed from community profiles');
                self.activeCustomer().communityProfiles.remove(page);
            }
        });
    };

    self.activateFilter = function (filter) {
        self.filterInput(null);
        self.activeFilter(filter);
    };

    self.activateCustomer = function (customer) {
        self.foldersList([]);
        self.changeFolder('-1');
        self.pages([]);

        self.activeCustomer(customer);
        customer.loading(true);
        dataService.customers.get(customer.id).done(function (res, status, xhr) {
            customer.update(res.result[0]);

            //dataService.iLinks.getAll(customer.clientId).done(function (res, status, xhr) {
            //    customer.ILink.update(res.result[0]);

                dataService.customerCommunityProfiles.getAll(customer.clientId).done(function (res, status, xhr) {
                    customer.communityProfiles(res.result);
                    customer.loading(false);
                    });
            customer.loading(false);
            });
    };


    self.setActiveTab = function (id) {

        self.activeTab(id);

        switch (id) {
            case 'customerInfo':
                $('#btn_communityProfiles').removeClass('btn-primary');

                if (!$('#btn_communityProfiles').hasClass('btn-default'))
                    $('#btn_communityProfiles').addClass('btn-default');

                if (!$('#btn_customerInfo').hasClass('btn-primary'))
                    $('#btn_customerInfo').addClass('btn-primary');
                break;
            case 'communityProfiles':
                $('#btn_customerInfo').removeClass('btn-primary');

                if (!$('#btn_customerInfo').hasClass('btn-default'))
                    $('#btn_customerInfo').addClass('btn-default');

                if (!$('#btn_communityProfiles').hasClass('btn-primary'))
                    $('#btn_communityProfiles').addClass('btn-primary');
                break;
        }
    };

    self.changeFolder = function (id) {
        self.pages([]);

        dataService.pages.getAll(id).done(function (data) {

            for (var i = 0; i < data.resultCount; i++) {
                self.pages.push({ id: data.result[i].id, title: data.result[i].title });
            }

            dataService.folders.getAll(id).done(function (data) {
                if (data.result.length > 0) {
                    self.foldersList.push(new FolderList(data.result, self));
                }
            });
        });
    };


    self.activate();



    //ARRAY FILTER FUNCTIONS
    self.throttledFilterInputArrayFilter = function (c) {
        var match = false;
        var name = c.name().toLowerCase();
        var tfi = self.throttledFilterInput().toLowerCase();
        var id = c.clientId.toString();

        return (name.indexOf(tfi) > -1 || id.indexOf(tfi) > -1);
    };

    self.preGenValueFilter = function (c) {
        var charArray = self.activeFilter().value.split('');
        var match = false;
        var name = c.name().toLowerCase();
        for (var i = 0; i < charArray.length; i++) {
            if (match) break;
            match = name.substring(0, 1).indexOf(charArray[i]) > -1;
        }
        return match;
    };

    //ARRAY SORT FUNCTIONS
    self.nameSort = function (a, b) {
        a = a.name().toLowerCase();
        b = b.name().toLowerCase();
        return a > b ? 1 : a < b ? -1 : 0;
    };

    self.recentCustomersSort = function (a, b) {
        a = a.modified();
        b = b.modified();
        return a > b ? -1 : a < b ? 1 : 0;
    };
}