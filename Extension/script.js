(function () {
    chrome.storage.sync.get(["Status", "BlockedURLs", "BlockedDomains"], function (Values) {
        //console.log(Values.Status);
        if (Values.Status == "Disabled")
            return;
        var URL = window.location.href;
        if (Values.BlockedURLs !== undefined && Values.BlockedURLs.indexOf(URL) != -1)
            return;

        var Domain = ExtractDomainFromURL(URL);
        if (Values.BlockedDomains !== undefined && Values.BlockedDomains.indexOf(Domain) != -1)
            return;

        Init();
    });
}());

function ExtractDomainFromURL(URL) {
    return URL.substring(0, URL.indexOf('/', URL.indexOf('.')));
}

function Init() {
    var LoadWikiTheWeb = function () {
        var Script = document.createElement("script");
        Script.id = "WikiTheWeb-JS";
        Script.src = "//www.wikitheweb.com/js/library.js";
        //Script.onload = function () {
            //console.log("WikiTheWeb loaded");
            //window.WikiTheWeb.Popover.Init();
            //console.log("WikiTheWeb Init");
        //};
        document.body.appendChild(Script);
    };

    if (window.jQuery === undefined) {
        var Script = document.createElement("script");
        Script.id = "WikiTheWeb-JS-jQuery";
        Script.src = "//code.jquery.com/jquery-1.12.4.min.js";
        Script.onload = function () {
            LoadWikiTheWeb();
        };
        document.body.appendChild(Script);
    }
    else
        LoadWikiTheWeb();
}
