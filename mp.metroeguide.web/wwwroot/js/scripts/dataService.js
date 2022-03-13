//var baseUrl = 'http://localhost:64441'; //40893
var baseUrl = 'http://api.metroeguide.com';
var legacyBaseUrl = 'http://legacyapi.metroeguide.com';

var dataService = {

    //FOLDERS
    folders: {
        findBy: function(type, value) {
            var folderUrl = baseUrl + '/folders/find?format=json&' + type + '=' + encodeURIComponent(value);
            return $.ajax({ type: 'GET', url: folderUrl });
        },
        getAll: function (id) {
            var folderUrl = baseUrl + '/folders?format=json&parentFolderId=' + id;
            return $.ajax({ type: 'GET', url: folderUrl });
        },
        get: function (id) {
            var folderUrl = baseUrl + '/folders?format=json&id=' + id;
            return $.ajax({ type: 'GET', url: folderUrl });
        },
        getHierarchy: function(id) {
            var folderStructureUrl = baseUrl + '/folderHierarchy?format=json&id=' + id + "&getHierarchy=true";
            return $.ajax({ type:'GET', url:folderStructureUrl });
        },
        create: function (folder) {
            var folderUrl = baseUrl + '/folders';
            return $.ajax({ type: 'POST', url: folderUrl, data: folder, contentType: 'application/json' });
        },
        remove: function (id) {
            var removeFolderUrl = baseUrl + '/folders?id=' + id;
            return $.ajax({ type: 'DELETE', url: removeFolderUrl });
        }
    },

    //PAGES
    pages: {
        findBy: function(type, value) {
            var findPageUrl = baseUrl + "/pages/find?format=json&" + type + '=' + encodeURIComponent(value);
            return $.ajax({ type: 'GET', url: findPageUrl });
        },
        getAll: function (folderId) {
            var pagesUrl = baseUrl + '/pages?format=json&folderId=' + folderId;
            return $.ajax({ type: 'GET', url: pagesUrl });
        },
        get: function (id) {
            var getPageUrl = baseUrl + '/pages?format=json&id=' + id;
            return $.ajax({ type: 'GET', url: getPageUrl });
        },
        create: function (page) {
            var createPageUrl = baseUrl + "/pages";
            return $.ajax({ type: 'POST', url: createPageUrl, data: page, contentType: "application/json" });
        },
        update: function (page) {
            var updatePageUrl = baseUrl + '/pages';
            return $.ajax({ type: "PUT", url: updatePageUrl, data: page, contentType: "application/json" });
        },
        remove: function (id) {
            var removePageUrl = baseUrl + '/page?id=' + id;
            return $.ajax({ type: 'DELETE', url: removePageUrl });
        }
    },

    //LINKS
    links: {
        find: function(title, url) {
            var findLinksUrl = baseUrl + '/links/find?format=json&title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
            return $.ajax({ type: 'GET', url: findLinksUrl });
        },
        get: function(pageId){
            var getLinkUrl = baseUrl + '/links?format=json&pageId=' + pageId;
            return $.ajax({ type: 'GET', url: getLinkUrl });
        },
        getSimilar: function(title, url) {
            var getLinksByTitleUrl = baseUrl + '/links?format=json&title=' + encodeURIComponent(title) + "&url=" + encodeURIComponent(url);
            return $.ajax({ type: 'GET', url: getLinksByTitleUrl });
        },
        create: function (link) {
            var createLinkUrl = baseUrl + '/links';
            return $.ajax({ type: "POST", url: createLinkUrl, data: link, contentType: "application/json" });
        },
        bulkCreate: function (links) {
            var createLinkBulkUrl = baseUrl + '/links/bulk';
            return $.ajax({ type: 'POST', url: createLinkBulkUrl, data: links, contentType: 'application/json' });
        },
        update: function (link) {
            var updateLinkUrl = baseUrl + '/links';
            return $.ajax({ type: "PUT", url: updateLinkUrl, data: link, contentType: "application/json" });
        },
        bulkUpdate: function(links) {
            var updateLinkPositionsUrl = baseUrl + '/links/bulk';
            return $.ajax({ type: 'PUT', url: updateLinkPositionsUrl, data: links, contentType: 'application/json' });
        },
        remove: function (id) {
            var deleteLinkUrl = baseUrl + '/link?id=' + id;
            return $.ajax({ type: 'DELETE', url: deleteLinkUrl });
        },
        bulkRemove: function (links) {
            var removeLinksUrl = baseUrl + '/links/bulk';
            return $.ajax({ type: 'DELETE', url: removeLinksUrl, data: links, contentType: 'application/json' });
        },
        bulkRemoveByPageId: function (pageId) {
            var removeLinksUrl = baseUrl + '/links/bulkByPage?pageId=' + pageId;
            return $.ajax({ type: 'DELETE', url: removeLinksUrl });
        }
    },

    //LEGACY
    legacy: {
        getPage: function (id) {
            var legacyPageUrl = legacyBaseUrl + '/api/pages/' + id;
            return $.ajax({ type: 'GET', url: legacyPageUrl });
        },
        getFolderStructure: function (id) {
            var legacyFolderUrl = legacyBaseUrl + '/api/folders/' + id;
            return $.ajax({ type: 'GET', url: legacyFolderUrl });
        }
    },

    //SHEETS
    sheets: {
        getAll: function() {
            var getSheetsUrl = baseUrl + '/sheets?format=json';
            return $.ajax({ type: 'GET', url: getSheetsUrl });
        },
        getLinks: function(id) {
            var getSheetLinksUrl = baseUrl + '/sheets/links?sheetId=' + sheetId + '&format=json';
            return $.ajax({ type: 'GET', url: getSheetLinksUrl });
        },
        create: function (sheet) {
            var sheetUrl = baseUrl + '/sheets';
            return $.ajax({ type: 'POST', data: sheet, url: sheetUrl, contentType: 'application/json' });
        },
        createLinks: function (links) {
            var sheetLinkUrl = baseUrl + '/sheets/links';
            return $.ajax({ type: 'POST', data: links, url: sheetLinkUrl, contentType: 'application/json' });
        },
        publish: function (id) {
            var publishSheetUrl = baseUrl + '/sheets/publish?id=' + id;
            return $.ajax({ type: 'PUT', url: publishSheetUrl });
        },
        remove: function (id) {
            var deleteSheetLinksUrl = baseUrl + '/sheets/links?sheetId=' + id;
            return $.ajax({ type: 'DELETE', url: deleteSheetLinksUrl });
        }
    },

    //CLIENTS
    clients: {
        getAll: function () {
            var getClientsLinkUrl = baseUrl + '/clients?format=json';
            return $.ajax({ type: 'GET', url: getClientsLinkUrl });
        },
        get: function(id) {
            var getClientUrl = baseUrl + '/clients?id=' + id + "&format=json";
            return $.ajax({ type: 'GET', url: getClientUrl });
        },
        getCondensed: function() {
            var getFilteredClientsUrl = baseUrl + '/clients?condensed=true&format=json';
            return $.ajax({ type: 'GET', url: getFilteredClientsUrl });
        },
        create: function(client) {
            var createClientUrl = baseUrl + "/clients";
            return $.ajax({ type: 'POST', url: createClientUrl, data: client, contentType: "application/json" });
        },
        update: function(client) {
            var updateClientUrl = baseUrl + '/clients'; 
            return $.ajax({ method: "PUT", url: updateClientUrl, data: client, contentType: "application/json" });
        },
        remove: function(id) {
            var deleteClientLinksUrl = baseUrl + '/clients?id=' + id;
            return $.ajax({ type: 'DELETE', url: deleteClientLinksUrl });
        }

    },

    //CUSTOMERS
    customers: {
        getAll: function () {
            var getCustomersLinkUrl = baseUrl + '/customers?format=json';
            return $.ajax({ type: 'GET', url: getCustomersLinkUrl });
        },
        get: function (id) {
            var getCustomerUrl = baseUrl + '/customers?id=' + id + "&format=json";
            return $.ajax({ type: 'GET', url: getCustomerUrl });
        },
        getCondensed: function () {
            var getFilteredCustomersUrl = baseUrl + '/customers?condensed=true&format=json';
            return $.ajax({ type: 'GET', url: getFilteredCustomersUrl });
        },
        create: function (customer) {
            var createCustomerUrl = baseUrl + "/customers";
            return $.ajax({ type: 'POST', url: createCustomerUrl, data: customer, contentType: "application/json" });
        },
        update: function (customer) {
            var updateCustomerUrl = baseUrl + '/customers';
            return $.ajax({ method: "PUT", url: updateCustomerUrl, data: customer, contentType: "application/json" });
        },
        remove: function (id) {
            var deleteCustomerLinksUrl = baseUrl + '/customers?id=' + id;
            return $.ajax({ type: 'DELETE', url: deleteCustomerLinksUrl });
        }

    },


    //ILINKS
    iLinks: {
        getAll: function (clientId) {
            var getILinkUrl = baseUrl + '/ilinks?clientid=' + clientId + "&format=json";
            return $.ajax({ type: 'GET', url: getILinkUrl });
        },
        create: function (iLink) {
            var createILinkUrl = baseUrl + '/ilinks'; 
            return $.ajax({ method: "POST", url: createILinkUrl, data: iLink, contentType: "application/json" });
        },
        update: function (iLink) {
            var updateILinkUrl = baseUrl + '/ilinks';
            return $.ajax({ method: "PUT", url: updateILinkUrl, data: iLink, contentType: "application/json" });
        },
        remove: function (id) {
            var deleteILinkUrl = baseUrl + '/ilinks?id=' + id;
            return $.ajax({ method: "DELETE", url: deleteILinkUrl });
        }
    },

    //COMMUNITY PROFILES
    communityProfiles: {
        getAll: function (clientId) {
            var getCommunityProfilesUrl = baseUrl + '/ilinks/' + clientId + "/communityProfiles?format=json";
            return $.ajax({ type: 'GET', url: getCommunityProfilesUrl });
        },
        create: function (communityProfile) {
            var createCommunityProfileUrl = baseUrl + '/communityProfiles';
            return $.ajax({ method: "POST", url: createCommunityProfileUrl, data: communityProfile, contentType: "application/json" });
        },
        remove: function (clientId, pageId) {
            var deleteCommunityProfileUrl = baseUrl + '/communityProfiles?clientId=' + clientId + '&pageId=' + pageId;
            return $.ajax({ method: 'DELETE', url: deleteCommunityProfileUrl });
        }
    },

    customerCommunityProfiles: {
        getAll: function (clientId) {
            var getCommunityProfilesUrl = baseUrl + '/customers/' + clientId + "/communityProfiles?format=json";
            return $.ajax({ type: 'GET', url: getCommunityProfilesUrl });
        },
        create: function (communityProfile) {
            var createCommunityProfileUrl = baseUrl + '/communityProfiles';
            return $.ajax({ method: "POST", url: createCommunityProfileUrl, data: communityProfile, contentType: "application/json" });
        },
        remove: function (clientId, pageId) {
            var deleteCommunityProfileUrl = baseUrl + '/communityProfiles?clientId=' + clientId + '&pageId=' + pageId;
            return $.ajax({ method: 'DELETE', url: deleteCommunityProfileUrl });
        }
    },

    //CHECKED LINKS
    checkedLinks: {
        getAll: function (type) {
            var getCheckedLinksUrl = baseUrl + '/linkChecker?format=json';

            if (type != null)
                getCheckedLinksUrl = getCheckedLinksUrl + "&type=" + type;

            return $.ajax({ type: 'GET', url: getCheckedLinksUrl });
        },
        addToWhitelist: function(whitelistRequest) {
            var addToWhitelistUrl = baseUrl + '/linkChecker/whitelist';
            return $.ajax({ method: 'POST', url: addToWhitelistUrl, data: whitelistRequest, contentType: 'application/json' });
        },
        update: function (checkedLinkUpdate) {
            var updateCheckedLinkUrl = baseUrl + '/linkChecker';
            return $.ajax({ method: 'PUT', url: updateCheckedLinkUrl, data: checkedLinkUpdate, contentType: 'application/json' });
        },
        //remove: function (id) {
        //    var deleteCheckedLinkLogUrl = baseUrl + '/linkChecker?id=' + id;
        //    return $.ajax({ method: 'DELETE', url: deleteCheckedLinkLogUrl });
        //},
        remove: function (deleteRequest) {
            var deleteCheckedLinkLogUrl = baseUrl + '/linkChecker';
            return $.ajax({ method: 'DELETE', url: deleteCheckedLinkLogUrl, data: deleteRequest, contentType: 'application/json' });
        },
        elevate: function (elevateRequest) {
            var elevateUrl = baseUrl + '/linkChecker/elevate';
            return $.ajax({ method: 'PUT', url: elevateUrl, data: elevateRequest, contentType: 'application/json' });
        },
        deactivateLink: function (deactivateRequest) {
            var deactivateUrl = baseUrl + '/linkChecker/deactivate';
            return $.ajax({ method: 'DELETE', url: deactivateUrl, data: deactivateRequest, contentType: 'application/json' });
        },
        comment: function (commentRequest) {
            var commentUrl = baseUrl + '/linkChecker/comment';
            return $.ajax({ method: 'PUT', url: commentUrl, data: commentRequest, contentType: 'application/json' });
        }
    }

};