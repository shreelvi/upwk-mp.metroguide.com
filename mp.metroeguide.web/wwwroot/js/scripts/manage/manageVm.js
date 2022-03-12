
function ManageVm() {
    var self = this;

    self.loading = ko.observable();
    self.folders = ko.observableArray();
    self.folderHistory = ko.observableArray();
    self.folder = ko.observable();
    self.folderId = ko.observable("-1");
    self.newFolderName = ko.observable();
    self.showFolderCreateModal = ko.observable(false);
    self.showFindPane = ko.observable(false);

    //FOLDER SELECT DROP DOWN LIST FOR MOVE
    self.showFolderSelectModal = ko.observable(false);
    self.foldersList = ko.observableArray([]);
    self.selListFolders = ko.observableArray();
    self.closeFolderSelectModal = function () { self.showFolderSelectModal(false); };
    self.selectFolder = function () {
        var maxLength = self.foldersList().length;
        var folderIdSet = false;
        var selectedParentFolderId = 0;

        if (maxLength == 1 && self.foldersList()[0].selection() == undefined) {
            toastr.error('You must select at least one folder level', 'Hang on!');
        }
        else {

            for (i = maxLength - 1; i >= 0; i--) {
                if (self.foldersList()[i].selection() != undefined) {
                    if (folderIdSet == false) {
                        selectedParentFolderId = self.foldersList()[i].selection();
                        folderIdSet = true;
                    }
            
                }
            }
            
            var bulkUpdate = ko.toJSON({ NewParentFolderId: selectedParentFolderId, PageIds: self.selectedPages().join(',') });
            dataService.pages.update(bulkUpdate).done(function (data, status, xhr) {
                if (xhr.status == 204) {
                    toastr.success("", "Pages Successfully moved!");
                    //clear those page ids from loaded pages
                    self.foldersList.removeAll();
                    self.changeFolder({});
                    self.selectedPages([]);
                    self.closeFolderSelectModal();
                    self.activate();
                }
            });
        }
    };

    self.changeFolder = function (id) {
        if (typeof id == "object") id = "-1";

        dataService.folders.getAll(id).done(function (data) {
            if (data.result.length > 0) {
                self.foldersList.push(new FolderList(data.result, self));
            }
        });
    };
    /////////////////////////////////////////


    self.pages = ko.observableArray();
    self.pendingDeletePages = ko.observableArray(); //coming soon - on click of text box, add link to this list, on un-check, remove from list, on 'delete all', send to api
    self.pendingDeletePage = ko.observable();
    self.newPageName = ko.observable();
    self.showPageCreateModal = ko.observable(false);
    self.selectedPages = ko.observableArray([]);

    self.activate = function () {
        self.showFindPane(false);
        self.loading(true);

        self.selectedPages([]);
        var hash = window.location.hash;

        if (hash) {
            self.folderId(hash.substring(hash.indexOf("/") + 1));
        }

        dataService.folders.getAll(self.folderId()).done(function (data) {
            self.folders.removeAll();
            self.rebuildBreadCrumbs(self.folderId());

            $.each(data.result, function (index, folder) {
                self.folders.push({id: folder.id, name: folder.name});
            });

            dataService.pages.getAll(self.folderId()).done(function (data) {
                self.pages.removeAll();

                $.each(data.result, function (index, page) {
                    self.pages.push({ id: page.id, title: page.title });
                });

                self.loading(false);
            });
        });
        
        if (!hash) {
            window.location.hash = "folder/" + self.folderId();
        }

        self.changeFolder({});
    };

    self.rebuildBreadCrumbs = function (folderId) {
        var baseFolder = { id: -1, title: 'Home', active: true };
        self.folder(baseFolder.title);
        self.folderHistory.removeAll();
        self.folderHistory.push(baseFolder);

        dataService.folders.getHierarchy(folderId).done(function (data) {
            if (data.result.length > 0) {
                $.each(data.result, function (i, f) {
                    var folder = { id: f.id, title: f.id + ' - ' + f.name, active: i == data.result.length - 1 };
                    self.folderHistory.push(folder);
                    if (i == data.result.length - 1) {
                        self.folder(f.name);
                    }
                });
            }
        });
    };

    self.toggleAllPages = function () {
        if (self.pages().length == self.selectedPages().length) {
            self.selectedPages.removeAll();
        }
        else {
            self.selectedPages.removeAll();
            for (var i = 0; i < self.pages().length; i++) {
                self.selectedPages.push(self.pages()[i].id);
            }
        }
    };

    self.movePages = function () {
        if (self.selectedPages().length > 0) {
            self.showFolderSelectModal(true);
            //toastr.success("Pages moved successfully " + self.selectedPages().join(', '));
        }
        else {
            toastr.info("No pages selected");
        }
    };

    self.deletePages = function () {
        console.log(self.selectedPages());
        toastr.success("Pages deleted successfully");
    }

    self.getChildFolders = function (folder) {
        window.location.hash = "folder/" + folder.id;
    };

    self.confirmDelete = function (page) {
        self.pendingDeletePage(page);
    };

    self.removePage = function (page) {
        dataService.pages.remove(page.id).done(function (data, status, xhr) {
            if (xhr.status == 204) {
                dataService.links.bulkRemoveByPageId(page.id).done(function (data, status, xhr) {
                    if (xhr.status == 204) {
                        self.pendingDeletePage(null);
                        self.pages.remove(page);
                        toastr.success('Successfully Removed', 'Page ' + page.id);
                    }
                    else {
                        toastr.error('Something went wrong on the page', 'Error!');
                    }
                }).fail(function () {
                    toastr.error('Something went wrong on the server', 'Error!');
                })
            }
        }).fail(function() {
            toastr.error('Something went wrong on the server', 'Error!');
        });
    };

    self.showCreateFolderModal = function () {
        self.showFolderCreateModal(true);
        setTimeout(function () {
            $("#folderName").focus();
        }, 500);
    };

    self.saveNewFolder = function () {

        var _parentFolderId = self.folderId() == "-1" ? "NULL" : self.folderId();
        var folder = ko.toJSON({ name: self.newFolderName(), parentFolderId: _parentFolderId });

        dataService.folders.create(folder).done(function (newFolderId, status) {
            if (!isNaN(newFolderId) && status == "success") {
                self.showFolderCreateModal(false);
                toastr.success('Successfully Added!', 'Folder: ' + self.newFolderName());
                self.newFolderName(null);
                self.activate();
            }
        }).fail(function() {
            toastr.error('Something went wrong on the server', 'Error!');
        });
    };

    self.closeNewFolderModal = function () {
        self.showFolderCreateModal(false);
    };

    self.showCreatePageButton = function () {
        return self.folderId() != "-1";
    };

    self.showCreatePageModal = function () {
        self.showPageCreateModal(true);
        setTimeout(function () {
            $("#pageName").focus();
        }, 500);
    };

    self.saveNewPage = function () {
        var page = ko.toJSON({ title: self.newPageName(), folderId: self.folderId() });

        dataService.pages.create(page).done(function (newPageId, status) {
            if (!isNaN(newPageId) && status == "success") {
                self.showPageCreateModal(false);
                self.pages.push({ id: newPageId, title: self.newPageName() });
                toastr.success('Successfully Added!', 'Page: ' + self.newPageName());
                self.newPageName(null);
            }
        }).fail(function() {
            toastr.error('Something went wrong on the server', 'Error!');
        });
    };

    self.closeNewPageModal = function () {
        self.showPageCreateModal(false);
    };


    self.showRemoveFolderModal = ko.observable(false);
    self.pendingRemoveFolder = ko.observable();
    self.toggleRemoveFolderModal = function (folder) {
        self.showRemoveFolderModal(true);
        self.pendingRemoveFolder(folder);
    };


    self.removeFolder = function (folder) {
        dataService.folders.remove(folder.id).done(function (data, xhr, status) {
            self.pendingRemoveFolder({});
            self.showRemoveFolderModal(false);
            self.activate();
            toastr.success('Folder <strong>' + folder.name + '</strong> removed');
        }).fail(function () {
            toastr.error('Server error!');
        });
    };


    self.findByDDL = ko.observable('findById');
    self.searchTypeDDL = ko.observable('folder');
    self.findByRaw = ko.observable();
    self.foundFolders = ko.observableArray();
    self.foundPages = ko.observableArray();

    self.findBy = function () {
        if (self.findByDDL() == 'findById' && !parseInt(self.findByRaw())) {
            toastr.error("Value must be a number when searching by Ids");
            return;
        }

        self.loading(true);

        if (self.searchTypeDDL() == 'folder') {
            dataService.folders.findBy(self.findByDDL(), self.findByRaw()).done(function (data, status, xhr) {
                self.foundFolders([]);
                if (status == "success") {
                    $.each(data.result, function (k, v) {
                        self.foundFolders.push({ name: v.name, url: '/manage#folder/' + v.id });
                    });
                }
                self.loading(false);
                self.showFindPane(true);
            }).fail(function () {
                toastr.error('There was an error on the server!');
            });
        }
        else if (self.searchTypeDDL() == 'page') {
            dataService.pages.findBy(self.findByDDL(), self.findByRaw()).done(function (data, status, xhr) {
                self.foundPages([]);
                if (status == "success") {
                    $.each(data.result, function (k, v) {
                        self.foundPages.push({ title: v.title, url: '/manage/page/' + v.id + '/#links' });
                    });
                    self.loading(false);
                    self.showFindPane(true);
                }
            }).fail(function () {
                toastr.error('There was an error on the server!');
            });
        }
    };

    self.clearFind = function () {
        self.loading(true);

        self.findByRaw(null);
        self.showFindPane(false);
        self.loading(false);
    }

    $(window).bind('hashchange', function (e) {
        self.activate();
    });

    self.activate();
};