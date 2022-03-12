function PageManageVm() {
    var self = this;

    self.loading = ko.observable();

    self.pageId = ko.observable();
    self.page = ko.observable({});
    self.pageOptions = ko.observable(new pageOptionModel());

    self.folderHistory = ko.observableArray();
    self.links = ko.observableArray();
    self.sortedLinks = ko.computed(function () {
        return self.links().sort(function (a, b) {
            if (a.position() < b.position()) return -1;
            if (a.position() == b.position()) return 0;
            if (a.position() > b.position()) return 1;
        });
    });

    self.newLink = ko.observable();
    self.pendingLink = ko.observable();
    self.pendingDeleteLink = ko.observable();

    self.showLinks = ko.observable(true);
    self.showPageOptions = ko.observable(false);

    self.targetMovement = ko.observable();
    self.positionMovements = ko.observableArray();

    self.activate = function () {
        self.loading(true);

        var path = window.location.pathname;
        path = path.substring(path.indexOf('/') + 1);
        var urlParts = path.split('/');

        self.pageId = urlParts[2];

        var hash = window.location.hash;
        if (hash) {
            if (hash.indexOf('links') != -1) {
                self.showLinks(true);
                self.showPageOptions(false);
            }
            else if (hash.indexOf('pageOptions') != -1) {
                self.showLinks(false);
                self.showPageOptions(true);
            }
        }
        else {
            window.location.hash = "links";
        }

        dataService.pages.get(self.pageId).done(function (data) {
            self.page(data.result[0]);
            self.rebuildBreadCrumbs(data.result[0].folderId);
            self.pageOptions(new pageOptionModel(data.result[0]));
            dataService.links.get(self.pageId).done(function (data) {
                $.each(data.result, function (index, link) {
                    self.links.push(new linkModel(link));
                });

                self.loading(false);
            });
        });
    };



    self.toggleLinks = function () {
        self.showLinks(true);
        self.showPageOptions(false);
        window.location.hash = "links";
    };

    self.rebuildBreadCrumbs = function (folderId) {

        dataService.folders.get(folderId).done(function (folderData) {
            var baseFolder = { id: -1, title: 'Home', linkHref: '/manage#folder/-1', isPage: false };
            self.folderHistory.removeAll();
            self.folderHistory.push(baseFolder);

            dataService.folders.getHierarchy(folderId).done(function (data) {
                if (data.result.length > 0) {
                    $.each(data.result, function (i, f) {
                        var folder = { id: f.id, title: f.id + ' - ' + f.name, linkHref: '/manage#folder/' + f.id, isPage: false };
                        self.folderHistory.push(folder);
                    });

                    var currentPage = { id: self.pageId, title: self.pageId + ' - ' + self.page().title, linkHref: '', isPage: true };
                    self.folderHistory.push(currentPage);
                }
            });

        });
    };

    self.positionUp = function (link) {
        var currentPosition = link.position();
        var currentIndex = self.sortedLinks().indexOf(link);
        var nextRecord = self.sortedLinks()[currentIndex + 1];

        if (nextRecord == undefined)
            return;

        if (currentPosition + 1 == nextRecord.position()) {
            self.addMovement({ id: nextRecord.id, originalPosition: nextRecord.position(), position: nextRecord.position() - 1 });
            nextRecord.position(nextRecord.position() - 1);
        }
        
        self.addMovement({ id: link.id, originalPosition: currentPosition, position: currentPosition + 1 });
        link.position(currentPosition + 1);
        console.log(self.positionMovements());
    }

    self.positionDown = function (link) {
        var currentPosition = link.position();
        var currentIndex = self.sortedLinks().indexOf(link);
        var previousRecord = self.sortedLinks()[currentIndex - 1];
        var previousRecordMovement;

        if (previousRecord != undefined) {
            if (currentPosition - 1 == previousRecord.position()) {
                self.addMovement({ id: previousRecord.id, originalPosition: previousRecord.position(), position: previousRecord.position() + 1 });
                previousRecord.position(previousRecord.position() + 1);
            }
        }

        self.addMovement({ id: link.id, originalPosition: currentPosition, position: currentPosition - 1 });
        link.position(currentPosition - 1);
        console.log(self.positionMovements());
    }

    self.addMovement = function (movement) {
        var existingRecord = ko.utils.arrayFilter(self.positionMovements(), function (m) {
            return m.id == movement.id;
        });

        if (existingRecord.length == 0) {
            self.positionMovements.push(movement);
        } else {
            existingRecord[0].position = movement.position;
        }

    }

    self.savePositionMovements = function () {
        dataService.links.bulkUpdate(ko.toJSON({ links: self.positionMovements() })).done(function (d, status, xhr) {
            if (xhr.status == 204) {
                toastr.success('Positions saved!');
            } else {
                toastr.error('Position save failed on the server!');
            }
        });
    };

    self.undoPositionMovements = function () {
        ko.utils.arrayForEach(self.positionMovements(), function (m) {
            var link = ko.utils.arrayFilter(self.links(), function (l) { return m.id == l.id; });
            if (link.length > 0) {
                link[0].position(m.originalPosition);
            }
        });
        this.positionMovements.removeAll();
    }

    self.togglePageOptions = function () {
        self.showLinks(false);
        self.showPageOptions(true);
        window.location.hash = "pageOptions";
    };

    self.updatePageOptions = function () {

        dataService.pages.update(ko.toJSON(self.pageOptions))
            .done(function (data, status, xhr) {
                if (xhr.status == 204) {
                    toastr.success('Update Successful', 'Page <strong>' + self.pageOptions().id() +'</strong> ');
                }
            })
            .fail(function() {
                toastr.error('Something went wrong on the server.', 'Error!');
            });
    }

    self.editLink = function (link) {
        self.pendingLink(link);
    };

    self.updateLink = function (link) {
        dataService.links.update(ko.toJSON(link)).done(function (data) {
            self.pendingLink(null);
            toastr.success("Link Updated");
        });
    }

    self.showCreateLinkModal = function () {
        self.newLink(new linkModel(parseInt(self.pageId)));
    };

    self.createLink = function (link) {
        dataService.links.create(ko.toJSON(link)).done(function (data) {
            self.newLink(null);
            self.links.removeAll();
            toastr.success("New Link Created!");
            self.activate();
        });
    };

    self.confirmDeleteLink = function (link) {
        self.pendingDeleteLink(link);
    };

    self.removeLink = function (link) {
        dataService.links.remove(link.id).done(function () {
            toastr.success('Link Deleted');
            self.links.remove(link);
            self.pendingDeleteLink(null);
        })
    }

    self.activate();




};