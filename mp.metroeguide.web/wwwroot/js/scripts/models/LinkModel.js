var LinkModel = function (data) {
    this._pageId = null;

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
