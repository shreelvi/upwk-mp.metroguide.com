var pageOptionModel = function (data) {
    if (data == undefined) {
        data = {
            id: 0,
            title: '',
            metaKeys: '',
            metaDesc: '',
            modified: new Date(),
            autoOrdering: '',
            canonicalUrl: '',
            comments: '',
            folderId: '',
            footerHtml: '',
            headerHtml: '',
            route: '',
            zipCode: ''
        };
    }
    
    this.id = ko.observable(data.id);
    this.title = ko.observable( data.title);
    this.metaKeys = ko.observable( data.metaKeys);
    this.metaDesc = ko.observable( data.metaDesc);
    this.modified = moment(new Date(data.modified)).format('MM/DD/YYYY');
    this.autoOrdering = ko.observable( data.autoOrdering);
    this.canonicalUrl = ko.observable( data.canonicalUrl);
    this.comments = ko.observable( data.comments);
    this.folderId = ko.observable( data.folderId);
    this.footerHtml = ko.observable( data.footerHtml);
    this.headerHtml = ko.observable( data.headerHtml);
    this.route = ko.observable( data.route );
    this.zipcode = ko.observable( data.zipcode );
};

var linkModel = function (data) {
    this._pageId = null;

    //this is done so that we can create a new 
    //blank link for a specific page
    if (typeof data === 'number') {
        this._pageId = data;
        data = {
            id: 0,
            comments: '',
            isElevated: '',
            isLink: '',
            isSuspended: '',
            modified: '',
            pageId: this._pageId,
            position: 0,
            target: '',
            title: '',
            url: '',
            urlId: ''
        };
    }

    this.id = data.id;
    this.comments = ko.observable(data.comments);
    this.isElevated = ko.observable(data.isElevated);
    this.isLink = ko.observable(data.isLink);
    this.isSuspended = ko.observable(data.isSuspended);
    this.modified = ko.observable(data.modified);
    this.pageId = ko.observable(data.pageId);
    this.position = ko.observable(data.position);
    this.target = ko.observable(data.target);
    this.title = ko.observable(data.title);
    this.url = ko.observable(data.url);
    this.urlId = ko.observable(data.urlId);
};