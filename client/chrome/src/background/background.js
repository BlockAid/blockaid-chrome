chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === "changeIcon") {
        chrome.browserAction.setIcon({
            path: message.newIconPath
        });
    }
});

function init() {
    var blockList = JSON.parse(localStorage.getItem("extdata") || '[{"text":"use.typekit.net","done":true},{"text":"googleapis.com","done":true}]')
    localStorage.setItem("extdata", JSON.stringify(blockList));
}


function checkUrl(url) {

    enable = (localStorage.getItem("toggle") === "true") ? true : false;
    if (enable !== true) {
        return false
    }

    var todoitems = JSON.parse(localStorage.getItem("extdata")) || {};
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

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {cancel: checkUrl(details.url) !== false};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]);


function stripTrailingSlashAndProtocol(str) {
    //if(str.substr(-1) == '/') {
    //    return str.substr(0, str.length - 1);
    //}
    //var protomatch = /^(https?|ftp):\/\//; // NB: not '.*'
    //str = str.replace(protomatch, '');
    var a = document.createElement('a');
    a.href = str;
    return a.hostname;
}

chrome.webRequest.onErrorOccurred.addListener(
    function (details) {
        console.log(details);
        if (details.error === "net::ERR_CONNECTION_TIMED_OUT" || details.error === "net::ERR_TIMED_OUT") {
            var todoitems = JSON.parse(localStorage.getItem("extdata") || '{}');
            todoitems.push({text: stripTrailingSlashAndProtocol(details.url), done: false});
            var arr = {};

            for (var i = 0; i < todoitems.length; i++)
                arr[todoitems[i]['text']] = todoitems[i];

            todoitems = new Array();
            for (var key in arr)
                todoitems.push(arr[key]);
            localStorage.setItem("extdata", JSON.stringify(todoitems));

            var myData = {
                "domain": "extension.com",
                "status": false,
                "enabled": false
            };


            var data = JSON.stringify(myData);

            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
            xmlhttp.open('POST', 'http://192.168.33.10:3000/api/domains', true);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    // JSON.parse does not evaluate the attacker's scripts.
                    var resp = JSON.parse(xmlhttp.responseText);
                    console.log(resp);
                }
            }
            xmlhttp.send(data);
        }
    }, {
        urls: ["<all_urls>"]
    }
);

init();