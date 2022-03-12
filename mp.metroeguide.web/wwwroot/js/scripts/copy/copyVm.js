var CopyVm = function () {

    var self = this;
    self.oldPageId = ko.observable();
    self.newPageExists = ko.observable(false);
    self.newPageTitle = ko.observable();
    self.newPageId = ko.observable();
    self.folderStructure = ko.observable();
    self.foldersList = ko.observableArray([]);
    self.pageData = ko.observable(new AzPage({}));
    self.links = ko.observableArray([]);

    self.pendingDeleteLink = ko.observable();
    self.pendingEditLink = ko.observable();

    self.getPageData = function () {
        dataService.pages.get(self.oldPageId()).done(function (data) {
            if (data.result.length > 0 && data.result[0].title != undefined) {
                self.newPageExists(true);
                self.newPageTitle(data.result[0].title);
            } else {
                self.loadLegacyData();
            }
        });
    };

    self.createPageWithNewId = function () {
        dataService.pages.get(self.newPageId()).done(function (data) {
            if (data.result.length > 0 && data.result[0].title != undefined) {
                toastr.error('This page id is already taken, please choose another', 'Uh oh!');
            } else {
                self.loadLegacyData();
                self.newPageExists(false);
                self.newPageTitle(null);
            }
        });
    }

    self.loadLegacyData = function () {
        dataService.legacy.getPage(self.oldPageId()).done(function (data) {
            if (data == null) {
                toastr.info('There is no page in Azure corresponding to that ID');
            }

            self.configureLinks(data.links);
            delete data.links;

            self.pageData(new AzPage(data));
            
            if (self.newPageId() != undefined) {
                self.pageData().id(self.newPageId());
                self.newPageId(null);
            }

            dataService.folders.getHierarchy(data.folderId).done(function (data) {
                self.setFolderStructure(data.result);
            });
        });
    }

    self.changeFolder = function (id) {
        if (typeof id == "object") id = "-1";

        dataService.folders.getAll(id).done(function (data) {
            if (data.result.length > 0) {
                self.foldersList.push(new FolderList(data.result, self));
            }
        });
    };

    self.cancelNewFolder = function () {
        self.foldersList.removeAll();
    };

    self.saveNewFolder = function () {
        var maxLength = self.foldersList().length;
        var folders = self.foldersList();
        var folderIdSet = false;
        var _folderStructure = [];

        if (maxLength == 1 && folders[0].selection() == undefined) {
            toastr.error('You must select at least one folder level', 'Hang on!');
        }
        else {
            for (i = maxLength - 1; i >= 0; i--) {
                if (folders[i].selection() != undefined) {
                    if (folderIdSet == false) {
                        self.pageData().folderId(folders[i].selection());
                        folderIdSet = true;
                    }

                    _folderStructure.push({ name: folders[i].folderName() });
                }
            }

            self.setFolderStructure(_folderStructure.reverse());
            self.foldersList.removeAll();
        }
    };

    self.setFolderStructure = function (data) {
        var _tempFolder = "";
        for (var i = 0; i < data.length; i++) {
            if (i != data.length - 1) {
                _tempFolder += data[i].name + " > ";
            } else {
                _tempFolder += "<strong>" + data[i].name + "</strong>";
            }
        }

        self.folderStructure(_tempFolder);
    };

    self.configureLinks = function (data) {
        for (var i = 0; i < data.length; i++) {
            self.links.push(new AzLink(data[i]));
        }
    };

    self.confirmRemoveLink = function (link) {
        self.pendingDeleteLink(link);
    };

    self.removeLink = function (link) {
        self.links.remove(link);
        self.pendingDeleteLink(null);
    };

    self.editLink = function (link) {
        self.pendingEditLink(link);
    };

    self.cancelLinkEdit = function (link) {
        link.revert();
        self.pendingEditLink(null);
    };

    self.commitLinkChanges = function (link) {
        link.commit();
        self.pendingEditLink(null);
    };

    self.saveAll = function () {
        var pageJson = ko.toJSON(self.pageData());
        dataService.pages.create(pageJson).done(function (data, status, xhr) {
            if (status == "success") {
                var bulkLinks = [];
                $.each(self.links(), function (i, link) {
                    link.pageId(parseInt(self.pageData().id()));
                    bulkLinks.push(link);
                });
                
                dataService.links.bulkCreate(ko.toJSON({ links: bulkLinks })).done(function (data, status, xhr) {
                    if (status == "success") {
                        toastr.success('Page copied successfully!');
                        self.oldPageId(null);
                        self.newPageTitle(null);
                        self.newPageId(null);
                        self.folderStructure(null);
                        self.foldersList.removeAll();
                        self.pageData(new AzPage({}));
                        self.links.removeAll();
                    } else {
                        toastr.error('Something went wrong with the link creation!', 'Uh oh.');
                    }
                });
            } else {
                toastr.error('Something went wrong with the page creation!', 'Uh oh.');
            }
        });

    }
}