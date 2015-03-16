
function init() {
    var blockList = JSON.parse(localStorage.getItem("manualBlockList") || '[{"text":"use.typekit.net","done":true},{"text":"googleapis.com","done":true}]')
    localStorage.setItem("manualBlockList", JSON.stringify(blockList));
    $(document).ready(function () {
        $.ajax({
            type: 'GET',
            url: 'https://api.myjson.com/bins/4sbff',
            success: function (data) {
                localStorage.setItem("autoBlockList", JSON.stringify(data));
            }
        });
    });
}


function checkUrl(url) {

    enable = (localStorage.getItem("toggle") === "true") ? true : false;
    if (enable !== true) {
        return false
    }

    var todoitems = [];
    if (localStorage.getItem("mode")==="true") {
        todoitems = JSON.parse(localStorage.getItem("autoBlockList") || '[]');
    }else{
        todoitems = JSON.parse(localStorage.getItem("manualBlockList") || '[]');
    }
    var i;
    for (i = 0; i < todoitems.length; i++) {
        if (todoitems[i].done) {
            if (url.match(new RegExp("http(s)?:\/\/.*" + todoitems[i].text + ".*")) !== null) {
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
            todoitems.push({text: stripTrailingSlashAndProtocol(details.url), done: false});
            var arr = {};

            for (var i = 0; i < todoitems.length; i++)
                arr[todoitems[i]['text']] = todoitems[i];

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


