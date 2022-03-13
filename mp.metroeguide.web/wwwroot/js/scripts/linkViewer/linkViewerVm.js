function LinkViewerVm(pageId) {
    var self = this;

    self.loading = ko.observable(true);
    self.pageId = ko.observable(pageId);
    self.links = ko.observableArray();

    self.activeLinkIndex = ko.observable(0);
    self.activeLink = ko.observable(new LinkModel(self.pageId()));
    self.similarLinks = ko.observableArray();
    self.iframeLoaded = ko.observable(false);

    self.activate = function () {
        if (self.pageId() != -1) {
            dataService.links.get(self.pageId()).done(function (data) {
                if (data.result.length > 0) {
                    $.each(data.result, function (index, link) {
                        self.links.push(new LinkModel(link));
                    });

                    self.activateLink(self.links()[self.activeLinkIndex()]);
                }

                self.loading(false);
            });
        }
    }

    self.activateLink = function (link) {
        self.activeLink(link);
        self.similarLinks([]);
        dataService.links.getSimilar(link.title(), link.url()).done(function (data) {
            $.each(data.result, function (index, link) {
                var pageUrl = "/manage/page/" + link.pageId + "#links"
                var folderHierarchy = ko.observable({ linkId: link.id, folderStructure: ko.observable(""), url: link.url, checked: ko.observable(true), openInNewUrl: pageUrl, pageName: '' });

                dataService.pages.get(link.pageId).done(function (data) {
                    var pageId = data.result[0].id;
                    var pageTitle = data.result[0].title;
                    dataService.folders.getHierarchy(data.result[0].folderId).done(function (data) {
                        for (var i = 0; i < data.result.length; i++) {
                            var hierarchy = data.result[i],
                                fs = folderHierarchy().folderStructure();

                            folderHierarchy().folderStructure(fs += hierarchy.id + " - " + hierarchy.name + (i == data.result.length - 1 ? " > " + pageId + " - " + pageTitle : " > "));
                        }
                    });
                });

                self.similarLinks.push(folderHierarchy);
            });
        });
    };

    self.activateNextLink = function () {
        self.activeLinkIndex(self.activeLinkIndex() + 1);
        self.activateLink(self.links()[self.activeLinkIndex()]);
    }

    self.activatePreviousLink = function () {
        self.activeLinkIndex(self.activeLinkIndex() - 1);
        self.activateLink(self.links()[self.activeLinkIndex()]);
    }

    self.updateSelected = function () {
        var links = [];

        $.each(self.similarLinks(), function (i, link) {
            link = link();

            if (link.checked()) {
                links.push({
                    id: link.linkId,
                    url: self.activeLink().url(),
                    urlId: self.activeLink().urlId,
                    title: self.activeLink().title(),
                    isSuspended: self.activeLink().isSuspended(),
                    isElevated: self.activeLink().isElevated(),
                    comments:self.activeLink().comments()
                });
            }
        });

        dataService.links.bulkUpdate(ko.toJSON({ links: links })).done(function (d, x, s) {
            if (s.status == 204) {
                toastr.success('Links update successfully!');
            } else {
                console.log(s);
                toastr.error('Update failed on server! Check console output.');
            }
        });

    }
    
    self.selectedLinkCount = ko.observable(0);
    self.showConfirmDeleteDialog = ko.observable(false);
    self.launchConfirmDeleteDialog = function () {
        $.each(self.similarLinks(), function (i, link) {
            if (link().checked())
                self.selectedLinkCount(self.selectedLinkCount() + 1);
        });

        self.showConfirmDeleteDialog(true);
    };

    self.deleteSelected = function () {

        var links = [];
        $.each(self.similarLinks(), function (i, link) {
            link = link();
            if (link.checked()) {
                links.push({ id: link.linkId });
            }
        });

        dataService.links.bulkRemove(ko.toJSON({ links: links })).done(function (d, x, s) {
            if (s.status == 204) {
                self.showConfirmDeleteDialog(false);
                toastr.success('Links Deleted!');
                setTimeout(function () {
                    location.reload()
                }, 800);
            }
            else {
                toastr.error('Links failed to delete on the server!', 'Failed!');
            }
        });
    }

    self.activate();
}