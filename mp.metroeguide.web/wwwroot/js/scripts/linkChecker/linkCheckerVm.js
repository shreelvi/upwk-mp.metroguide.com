function LinkCheckerVm() {
    var self = this;

    self.loading = ko.observable(true);
    self.activeTab = ko.observable('');

    self.goodLinks = ko.observableArray([]);
    self.unmatchedLinks = ko.observableArray([]);
    self.badLinks = ko.observableArray([]);
    self.elevatedLinks = ko.observableArray([]);

    self.pendingUrl = ko.observable(null);
    self.pendingCommentUrl = ko.observable(null);
    self.pendingDeleteUrl = ko.observable(null);


    self.init = function () {
        self.activateGoodLinks();
    };

    self.activateGoodLinks = function () {
        self.activateTab('good');

        if (self.goodLinks().length <= 0) {
            self.loading(true);
            dataService.checkedLinks.getAll("good").done(function (data) {

                if (data.result != null && data.result.length > 0) {
                    self.goodLinks(ko.utils.arrayMap(data.result, function (linkData) {
                        return new checkedLink(linkData);
                    }));
                }
                
                self.loading(false);
            });
        }
    }

    self.activateUnmatchedLinks = function () {
        self.activateTab('unmatched');

        if (self.unmatchedLinks().length <= 0) {
            self.loading(true);
            dataService.checkedLinks.getAll('unmatched').done(function (data) {
                if (data.result != null && data.result.length > 0) {
                    self.unmatchedLinks(ko.utils.arrayMap(data.result, function (linkData) {
                        return new checkedLink(linkData);
                    }));
                }

                self.loading(false);
            });
        }
    };

    self.activateBadLinks = function () {
        self.activateTab('bad');

        if (self.badLinks().length <= 0) {
            self.loading(true);
            dataService.checkedLinks.getAll('bad').done(function (data) {
                if (data.result != null && data.result.length > 0) {
                    self.badLinks(ko.utils.arrayMap(data.result, function (linkData) {
                        return new checkedLink(linkData);
                    }));

                }
                self.loading(false);
            });
        }
    };

    self.activateElevatedLinks = function () {
        self.activateTab('elevated');

        if (self.elevatedLinks().length <= 0) {
            self.loading(true);
            dataService.checkedLinks.getAll('elevated').done(function (data) {
                if (data.result != null && data.result.length > 0) {
                    self.elevatedLinks(ko.utils.arrayMap(data.result, function (linkData) {
                        return new checkedLink(linkData);
                    }));

                }
                self.loading(false);
            });
        }
    };

    self.activateTab = function (tabName) {
        self.activeTab(tabName);
        self.activePage(0);
    };

    self.editUrl = function (link) {
        dataService.links.find("", link.url()).done(function (data) {
            self.pendingUrl(link);
            if (data.result.length > 0) {
                self.pendingUrl().fakeTitle(data.result[0].title);
            }
        });
    };

    self.queueCommentUrl = function (link) {
        self.pendingCommentUrl(link);
    }

    self.updateCommentUrl = function () {
        var newComment = self.pendingCommentUrl();
        var updateCommentRequest = ko.toJSON({ urlId: newComment.urlId, url: newComment.url(), comment: newComment.comments() });

        dataService.checkedLinks.comment(updateCommentRequest).done(function () {
            self.pendingCommentUrl(null);
        });
    }

    self.useRedirectedUrl = function (link) {
        self.pendingUrl().url(link.endUrl);
    };

    self.updateUrl = function () {
        var newLink = self.pendingUrl();
        var updateUrlRequest = ko.toJSON({ id: newLink.id, urlId: newLink.urlId, url: newLink.url() });

        dataService.checkedLinks.update(updateUrlRequest).done(function (data, status, xhr) {
            if (xhr.status == 204) {

                var activeTab = self.activeTab();

                if(activeTab == "good"){
                    var goodLink = ko.utils.arrayFirst(self.goodLinks(), function (link) {
                        return link.id == newLink.id;
                    });
                    goodLink.url(newLink.url());
                }
                else if (activeTab == "unmatched"){
                    var unmatchedLink = ko.utils.arrayFirst(self.unmatchedLinks(), function (link) {
                        return link.id == newLink.id;
                    });

                    unmatchedLink.url(newLink.url());
                }
                else if (activeTab == "bad"){
                    var badLink = ko.utils.arrayFirst(self.badLinks(), function (link) {
                        return link.id == newLink.id;
                    });
                    badLink.url(newLink.url());
                }
                else if (activeTab == "elevated") {
                    var badLink = ko.utils.arrayFirst(self.elevatedLinks(), function (link) {
                        return link.id == newLink.id;
                    });
                    elevatedLink.url(newLink.url());
                }

                toastr.success('Url successfully updated!');
                self.pendingUrl(null);

            }
            else {
                toastr.error('Something went wrong on the server!', 'Oops!');
            }
        });
    }



    self.accepted = function (link) {
        //dataService.checkedLinks.remove(link.id).done(function () {
        //    self.removeLink(link);
        //    toastr.success('Item successfully accepted');
        //    self.checkReload(self.activeTab());
        //});
        var delRequest = ko.toJSON({ id: link.id, url: link.url });
        dataService.checkedLinks.remove(delRequest).done(function () {
            self.removeLink(link);
            toastr.success('Item successfully accepted');
            self.checkReload(self.activeTab());
        });
    };

    self.deactivateConfirm = function (link) {
        self.pendingDeleteUrl(link);
    };

    self.removeUrl = function (link) {
        var deactivateLinkRequest = ko.toJSON({ urlId: link.urlId, url: link.url });

        dataService.checkedLinks.deactivateLink(deactivateLinkRequest).done(function () {

            dataService.checkedLinks.remove(link.id).done(function () {

                self.pendingDeleteUrl(null);
                self.removeLink(link);
                toastr.success('Item successfully deactivated');
                self.checkReload(self.activeTab());
            })
        });
    };

    self.whitelist = function (link) {
        var whitelistRequest = ko.toJSON({ urlId: link.urlId });

        dataService.checkedLinks.addToWhitelist(whitelistRequest).done(function () {

            dataService.checkedLinks.remove(link.id).done(function () {
                self.removeLink(link);
                toastr.success('Item successfully whitelisted');
                self.checkReload(self.activeTab());
            });

        });
    };

    self.elevate = function (link) {
        var elevateRequest = ko.toJSON({ linkId: link.id, url: link.url, urlId: link.urlId });

        dataService.checkedLinks.elevate(elevateRequest).done(function () {
            self.removeLink(link);
            toastr.success('Item successfully elevated');
            self.checkReload(self.activeTab());
        });
    };

    self.removeLink = function (link) {
        switch (self.activeTab()) {
            case 'good':
                self.goodLinks.remove(link);
            case 'bad':
                self.badLinks.remove(link);
            case 'unmatched':
                self.unmatchedLinks.remove(link);
            case 'elevated':
                //self.elevatedLinks.remove(link);
        }
    };


    self.seePages = function (link) {
        link.folderHierarchy([]);
        link.hierarchyLoading(true);

        dataService.links.find("", link.url()).done(function (_links) {
            if (_links.result.length > 0) {
                for (var i = 0; i < _links.result.length; i++) {
                    var linkTitle = _links.result[i].title;

                    dataService.pages.findBy("findById", _links.result[i].pageId).done(function (_page) {
                        if (_page.result.length > 0) {
                            dataService.folders.getHierarchy(_page.result[0].folderId).done(function (_folderHierarchy) {
                                var folderHierarchy = "";
                                for (var f = 0; f < _folderHierarchy.result.length; f++) {
                                    folderHierarchy += _folderHierarchy.result[f].id + ' - ' + _folderHierarchy.result[f].name + " > ";
                                }

                                folderHierarchy += _page.result[0].id + ' - ' + _page.result[0].title + " > ";
                                folderHierarchy += '<span class="text-primary">' + linkTitle + '</span>';
                                editLink = '/manage/page/' + _page.result[0].id + '#links';

                                link.folderHierarchy.push({ hierarchy: folderHierarchy, editLink: editLink });
                            });
                        }
                    });
                }
            }

            link.hierarchyLoading(false);
        }); 
    };

    self.checkReload = function(linkType){
        if (linkType == 'good') {
            if (self.goodLinks().length <= 0) {
                self.activateGoodLinks();
            }
        }

        else if (linkType == 'bad') {
            if (self.badLinks().length <= 0) {
                self.activateBadLinks();
            }
        }
        else if (linkType == 'unmatches') {
            if (self.unmatchedLinks().length <= 0) {
                self.activateUnmatchedLinks();
            }
        }
        else if (linkType == 'elevated') {
            if (self.elevatedLinks().length <= 0) {
                self.activateElevatedLinks();
            }
        }
    }

    self.formatDate = function (date) {
        return moment(date).format('MM/DD/YYYY hh:mm a');
    }

    //PAGINATION
    self.activePage = ko.observable(0);
    self.pageSize = 10;

    self.totalPages = ko.computed(function () {
        var itemCount = 0;
        if (self.activeTab() == 'good')
            itemCount = self.goodLinks().length;
        else if (self.activeTab() == 'bad')
            itemCount = self.badLinks().length;
        else if (self.activeTab() == 'unmatched')
            itemCount = self.unmatchedLinks().length;
        else if (self.activeTab() == 'elevated')
            itemCount = self.elevatedLinks().length;

        return Math.ceil(itemCount / self.pageSize);
    });

    self.paginatedResults = ko.computed(function () {
        var first = self.activePage() * self.pageSize;
        if (self.activeTab() == 'good') {
            return self.goodLinks.slice(first, first + self.pageSize);
        }
        else if (self.activeTab() == 'bad') {
            return self.badLinks.slice(first, first + self.pageSize);
        }
        else if (self.activeTab() == 'unmatched') {
            return self.unmatchedLinks.slice(first, first + self.pageSize);
        }
        else if (self.activeTab() == 'elevated') {
            return self.elevatedLinks.slice(first, first + self.pageSize);
        }
    });

    self.hasPrevious = ko.computed(function () {
        return self.activePage() !== 0;
    });

    self.hasNext = ko.computed(function () {
        return self.activePage() + 1 !== self.totalPages();
    });

    self.activatePage = function (pageNumber) {
        if (pageNumber >= 0) {
            self.activePage(pageNumber);
        }
    };

    self.previous = function () {
        if (self.activePage() != 0) {
            self.activePage(self.activePage() - 1);
        }
    };

    self.next = function () {
        if (self.activePage() + 1 < self.totalPages()) {
            self.activePage(self.activePage() + 1);
        }
    };

    // END PAGINATION

    self.init();
}