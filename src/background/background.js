
function init() {
    var blockList = JSON.parse(localStorage.getItem("manualBlockList") || '[{"domain":"use.typekit.net","enabled":true},{"domain":"googleapis.com","enabled":true}]')
    localStorage.setItem("manualBlockList", JSON.stringify(blockList));
}


function checkUrl(url) {
    var todoitems = [];
    if (localStorage.getItem("mode")==="true") {
        todoitems = JSON.parse(localStorage.getItem("autoBlockList") || '[]');
    }else{
        todoitems = JSON.parse(localStorage.getItem("manualBlockList") || '[]');
    }
    var i;
    for (i = 0; i < todoitems.length; i++) {
        if (todoitems[i].enabled) {
            if (url.match(new RegExp("http(s)?:\/\/.*" + todoitems[i].domain + ".*")) !== null) {
                return true;
            }
        }
    }
    return false;
}

function stripTrailingSlashAndProtocol(str) {
    var a = document.createElement('a');
    a.href = str;
    return a.hostname;
}

init();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === "changeIcon") {
        chrome.browserAction.setIcon({
            path: message.newIconPath
        });
    }
});

chrome.webRequest.onErrorOccurred.addListener(
    function (details) {
        console.log(details);
        if (details.error === "net::ERR_CONNECTION_TIMED_OUT" || details.error === "net::ERR_TIMED_OUT") {
            var todoitems = JSON.parse(localStorage.getItem("autoBlockList") || '{}');
            todoitems.push({domain: stripTrailingSlashAndProtocol(details.url), domain: true});
            var arr = {};

            for (var i = 0; i < todoitems.length; i++)
                arr[todoitems[i]['domain']] = todoitems[i];

            todoitems = new Array();
            for (var key in arr)
                todoitems.push(arr[key]);
            localStorage.setItem("autoBlockList", JSON.stringify(todoitems));
        }
    }, {
        urls: ["<all_urls>"]
    }
);

chrome.webRequest.onBeforeRequest.addListener(

    function (details) {
        if (localStorage.getItem("status") === "true") {
            return {cancel: checkUrl(details.url) !== false};
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"])


