var todos = [
    {text: 'use.typekit.net', done: true},
    {text: 'googleapis.com', done: true}
];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === "getStorage") {
        if (message.extensionSettings === "storage") {
            sendResponse({extdata: JSON.parse(localStorage.getItem("extdata") || '{}')});
        }
    }
    else if (message.method === "setStorage") {
        localStorage.setItem("extdata", JSON.stringify(message.newData));
    }
});

localStorage.setItem("extdata", JSON.stringify(todos));

function checkUrl(url) {
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
