$(function () {
    $("#ChangeStatus_Disable").click(function () {
        Status_Set('Disabled');
        return false;
    });
    $("#ChangeStatus_Enable").click(function () {
        Status_Set('Enabled');
        return false;
    });
    $("#Block_Page").click(function () {
        chrome.tabs.query({ 'active': true }, function (Tabs) {
            if (Tabs.length == 0) {
                alert('Tab not found');
                return;
            }
            var URL = Tabs[0].url;
            chrome.storage.sync.get("BlockedURLs", function (Values) {
                var Index = Values.BlockedURLs.indexOf(URL);
                if (Index == -1) {
                    Values.BlockedURLs.push(URL);
                    LogEvent("BlockURL", URL);
                }
                chrome.storage.sync.set({ "BlockedURLs": Values.BlockedURLs });
                Status_Refresh();
                $("#RefreshNotification").show();
            });
        });
        return false;
    });
    $("#Unblock_Page").click(function () {
        chrome.tabs.query({ 'active': true }, function (Tabs) {
            if (Tabs.length == 0) {
                alert('Tab not found');
                return;
            }
            var URL = Tabs[0].url;
            chrome.storage.sync.get("BlockedURLs", function (Values) {
                var Index = Values.BlockedURLs.indexOf(URL);
                if (Index != -1) {
                    Values.BlockedURLs.splice(Index, 1);
                    LogEvent("UnblockURL", URL);
                }
                chrome.storage.sync.set({ "BlockedURLs": Values.BlockedURLs });
                Status_Refresh();
                $("#RefreshNotification").show();
            });
        });
        return false;
    });
    $("#Block_Domain").click(function () {
        chrome.tabs.query({ 'active': true }, function (Tabs) {
            if (Tabs.length == 0) {
                alert('Tab not found');
                return;
            }
            var Domain = ExtractDomainFromURL(Tabs[0].url);
            chrome.storage.sync.get("BlockedDomains", function (Values) {
                var Index = Values.BlockedDomains.indexOf(Domain);
                if (Index == -1) {
                    Values.BlockedDomains.push(Domain);
                    LogEvent("BlockDomain", Domain);
                }
                chrome.storage.sync.set({ "BlockedDomains": Values.BlockedDomains });
                Status_Refresh();
                $("#RefreshNotification").show();
            });
        });
        return false;
    });
    $("#Unblock_Domain").click(function () {
        chrome.tabs.query({ 'active': true }, function (Tabs) {
            if (Tabs.length == 0) {
                alert('Tab not found');
                return;
            }
            var Domain = ExtractDomainFromURL(Tabs[0].url);
            chrome.storage.sync.get("BlockedDomains", function (Values) {
                var Index = Values.BlockedDomains.indexOf(Domain);
                if (Index != -1) {
                    LogEvent("UnblockDomain", Domain);
                    Values.BlockedDomains.splice(Index, 1);
                }
                chrome.storage.sync.set({ "BlockedDomains": Values.BlockedDomains });
                Status_Refresh();
                $("#RefreshNotification").show();
            });
        });
        return false;
    });
    Status_Refresh();
});

function ExtractDomainFromURL(URL) {
    return URL.substring(0, URL.indexOf('/', URL.indexOf('.')));
}

function Status_Refresh() {
    chrome.tabs.query({ 'active': true }, function (Tabs) {
        var URL = Tabs.length == 0 ? null : Tabs[0].url;
        var Domain = URL == null ? null : ExtractDomainFromURL(URL);

        chrome.storage.sync.get(["Status", "BlockedURLs", "BlockedDomains"], function (Values) {
            if (Values.BlockedURLs === undefined) {
                Values.BlockedURLs = [];
                chrome.storage.sync.set({ "BlockedURLs": Values.BlockedURLs });
            }
            if (Values.BlockedDomains === undefined) {
                Values.BlockedDomains = [];
                chrome.storage.sync.set({ "BlockedDomains": Values.BlockedDomains });
            }
            $("#ChangeStatus_Disable, #Status_Enabled, #Block_Page, #Block_Domain").toggle(Values.Status != "Disabled");
            $("#ChangeStatus_Enable, #Status_Disabled").toggle(Values.Status == "Disabled");
            $("#Block_Page").toggle(!(Domain != null && Values.BlockedDomains.indexOf(Domain) != -1) && URL != null && Values.BlockedURLs.indexOf(URL) == -1);
            $("#Unblock_Page").toggle(!(Domain != null && Values.BlockedDomains.indexOf(Domain) != -1) && URL != null && Values.BlockedURLs.indexOf(URL) != -1);
            $("#Block_Domain").toggle(Domain != null && Values.BlockedDomains.indexOf(Domain) == -1);
            $("#Unblock_Domain").toggle(Domain != null && Values.BlockedDomains.indexOf(Domain) != -1);
        });
    });
}

function Status_Set(Status) {
    chrome.storage.sync.set({ "Status": Status }, function () {
        Status_Refresh();
        $("#RefreshNotification").show();
    });
    return false;
}

//var RootURL = "http://dev.wikitheweb.com:1836";
var RootURL = "https://www.wikitheweb.com";
function LogEvent(Action, Details) {
    var Data = $.post(RootURL + "/api/log/", {
        Action: Action,
        Details: Details,
    });
}