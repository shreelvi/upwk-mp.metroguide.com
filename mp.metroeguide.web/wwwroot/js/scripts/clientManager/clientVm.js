function ClientVm() {
    var self = this;

    self.activeClient = ko.observable(new Client({}));
    self.clients = ko.observableArray([]);
    self.filteredClients = ko.observableArray([]);
    self.activeTab = ko.observable('clientInfo');
    self.filterInput = ko.observable();
    self.throttledFilterInput = ko.observable();

    self.foldersList = ko.observableArray([]);
    self.pages = ko.observableArray([]);

    self.newClient = ko.observable();
    self.pendingDeleteClient = ko.observable();
    self.pendingDeleteCommunityProfile = ko.observable();

    self.throttledValue = ko.computed(self.filterInput).extend({ throttle: 400 });
    self.throttledValue.subscribe(function (val) {
        if (val !== '')
            self.throttledFilterInput(val);
    })

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
        dataService.clients.getCondensed().done(function (data) {
            for (var i = 0; i < data.resultCount; i++) {
                self.clients.push(new Client(data.result[i]));
            }

            self.activateFilter(self.filters[0]);
            self.changeFolder("-1");
        })
    };

    self.filteredClients = ko.computed(function () {
        if (self.throttledFilterInput() != '' && self.throttledFilterInput() != null) {

            self.activeFilter({});
            return ko.utils.arrayFilter(self.clients(), self.throttledFilterInputArrayFilter).sort(self.nameSort);

        } else if (self.activeFilter().value == 'recent') {

            return self.clients.sort(self.recentClientsSort).slice(0, 20);

        } else if (self.activeFilter().hasOwnProperty('value')) {
            return ko.utils.arrayFilter(self.clients(), self.preGenValueFilter).sort(self.nameSort);
        } else {
            //we are doing nothing initialize
        }
    });
    
    self.addNewClient = function () {
        self.newClient(new Client({}));
    };

    self.createClient = function () {

        dataService.clients.create(ko.toJSON(self.newClient())).done(function (data, status, xhr) {

            if (xhr.status == 200) {
                if (data.hasOwnProperty('result') && data.result.length > 0) {
                    var client = data.result[0];
                    dataService.iLinks.create( ko.toJSON(new ILink({ clientId: client.id })) ).done(function (data, status, xhr) {
                        if (xhr.status == 204) {
                            self.activateFilter(self.filters[0]);
                            self.activateClient(new Client(client));

                            self.newClient(null);
                            toastr.success('Client added successfully!');
                        }
                    });
                }
            }
        });
    };

    self.updateClient = function () {
        var client = ko.toJS(self.activeClient());
        var ilink = ko.toJS(client.ILink);
        delete client.ILink;

        dataService.clients.update(ko.toJSON(client)).done(function (data, status, xhr) {
            if (xhr.status == 204) {
                dataService.iLinks.update(ko.toJSON(ilink)).done(function (data, status, xhr) {
                    if (xhr.status == 204) {
                        toastr.success('Clent Updated Successfully', self.activeClient().name());
                    } else {
                        toastr.error('Update failed to process on the server!', 'Uh-oh!');
                    }
                });
            } else {
                toastr.error('Update failed to process on the server!', 'Uh-oh!');
            }
        });
    };

    self.confirmDeleteClient = function () {
        self.pendingDeleteClient(self.activeClient());
    }

    self.deleteClient = function () {
        dataService.iLinks.remove(self.activeClient().ILink.id).done(function (d, s, x) {
            if (x.status == 204) {
                dataService.clients.remove(self.activeClient().id).done(function (data, status, xhr) {
                    if (xhr.status == 204) {
                        self.clients.remove(self.activeClient());
                        self.activeClient(new Client({}));
                        self.pendingDeleteClient(null);
                        toastr.success('Client removed successfully');
                    }
                });
            }
        })
    };

    self.addNewCommunityProfile = function (page) {
        dataService.communityProfiles.create(ko.toJSON({ clientId: self.activeClient().id, pageId: page.id })).done(function (data, status, xhr) {
            if (xhr.status == 201) {
                toastr.success('Page added to community profiles');
                self.activeClient().communityProfiles.push(page);
            }
        });
    };

    self.confirmDeleteCommunityProfile = function (cp) {
        self.pendingDeleteCommunityProfile(cp);
    }

    self.removeCommunityProfile = function (page) {
        dataService.communityProfiles.remove(self.activeClient().id, page.id).done(function (data, status, xhr) {
            if (xhr.status == 204) {
                self.pendingDeleteCommunityProfile(null);
                toastr.success('Page removed from community profiles');
                self.activeClient().communityProfiles.remove(page);
            }
        });
    };

    self.activateFilter = function (filter) {
        self.filterInput(null);
        self.activeFilter(filter);
    };

    self.activateClient = function (client) {
        self.foldersList([]);
        self.changeFolder('-1');
        self.pages([]);

        self.activeClient(client);
        client.loading(true);
        dataService.clients.get(client.id).done(function (res, status, xhr) {
            client.update(res.result[0]);

            dataService.iLinks.getAll(client.id).done(function (res, status, xhr) {
                client.ILink.update(res.result[0]);

                dataService.communityProfiles.getAll(client.id).done(function (res, status, xhr) {
                    client.communityProfiles(res.result);
                    client.loading(false);
                });
            });
        });
    };


    self.setActiveTab = function (id) {

        self.activeTab(id);

        switch (id) {
            case 'clientInfo':
                $('#btn_communityProfiles').removeClass('btn-primary');

                if (!$('#btn_communityProfiles').hasClass('btn-default'))
                    $('#btn_communityProfiles').addClass('btn-default');

                if (!$('#btn_clientInfo').hasClass('btn-primary'))
                    $('#btn_clientInfo').addClass('btn-primary');
                break;
            case 'communityProfiles':
                $('#btn_clientInfo').removeClass('btn-primary')

                if (!$('#btn_clientInfo').hasClass('btn-default'))
                    $('#btn_clientInfo').addClass('btn-default');

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
        })
    };


    self.activate();



    //ARRAY FILTER FUNCTIONS
    self.throttledFilterInputArrayFilter = function (c) {
        var match = false;
        var name = c.name().toLowerCase();
        var tfi = self.throttledFilterInput().toLowerCase();
        var id = c.id.toString();

        return (name.indexOf(tfi) > -1 || id.indexOf(tfi) > -1)
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
    }

    //ARRAY SORT FUNCTIONS
    self.nameSort = function (a, b) {
        a = a.name().toLowerCase();
        b = b.name().toLowerCase();
        return a > b ? 1 : a < b ? -1 : 0;
    };

    self.recentClientsSort = function (a, b) {
        a = a.modified();
        b = b.modified();
        return a > b ? -1 : a < b ? 1 : 0;
    };
};