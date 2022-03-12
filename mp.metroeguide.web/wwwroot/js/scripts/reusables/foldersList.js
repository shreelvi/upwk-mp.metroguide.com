var FolderList = function (data, parent) {
    var self = this;
    self.Parent = ko.observable(parent);

    self.selListFolders = ko.observableArray(data);
    self.selection = ko.observable();
    self.folderName = ko.computed(function () {
        var folderName = "";

        $.each(self.selListFolders(), function (i, folder) {
            if (folder.id == self.selection()) {
                folderName = folder.name;
            }
        });

        return folderName;
    })

    self.selection.subscribe(function (newValue) {
        var index = self.Parent().foldersList().indexOf(self);
        var removeList = [];

        $.each(self.Parent().foldersList(), function (i, folder) {
            if(i > index) 
                removeList.push(folder);
        });

        self.Parent().foldersList.removeAll(removeList);
        self.Parent().changeFolder(newValue);
    });
};
