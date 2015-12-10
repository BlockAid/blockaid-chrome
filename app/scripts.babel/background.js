'use strict';

function init() {
    var blockList;
    blockList = JSON.parse(localStorage.getItem('manualBlockList') || '[{"domain":"use.typekit.net","enabled":true},{"domain":"googleapis.com","enabled":true}]'); // jshint ignore:line
    localStorage.setItem('manualBlockList', JSON.stringify(blockList));
}

function checkUrl(url) {
    var i, todoitems;
    todoitems = [];
    if (localStorage.getItem('mode') === 'true') {
        todoitems = JSON.parse(localStorage.getItem('autoBlockList') || '[]');
    } else {
        todoitems = JSON.parse(localStorage.getItem('manualBlockList') || '[]');
    }
    i = void 0;
    i = 0;
    while (i < todoitems.length) {
        if (todoitems[i].enabled) {
            if (url.match(new RegExp('http(s)?://.*' + todoitems[i].domain + '.*')) !== null) {
                return true;
            }
        }
        i++;
    }
    return false;
}

function stripTrailingSlashAndProtocol(str) {
    var a;
    a = document.createElement('a');
    a.href = str;
    return a.hostname;
}


function onInstalled(details) {
    console.log('previousVersion', details.previousVersion);
}

function onMessage(message, sender, sendResponse) {// jshint ignore:line
    if (message.method === 'changeIcon') {
        chrome.browserAction.setIcon({
            path: message.newIconPath
        });
    }
}

function onErrorOccurred(details) {
    var arr, i, key, todoitems;
    if (details) {
        console.log(details);
        if (details.error === 'net::ERR_CONNECTION_TIMED_OUT' || details.error === 'net::ERR_TIMED_OUT' || details.error === 'net::ERR_NAME_NOT_RESOLVED') {
            todoitems = JSON.parse(localStorage.getItem('autoBlockList') || '{}');
            todoitems.push({
                domain: stripTrailingSlashAndProtocol(details.url),// jshint ignore:line
                enabled: true// jshint ignore:line
            });
            arr = {};
            i = 0;
            while (i < todoitems.length) {
                arr[todoitems[i].domain] = todoitems[i];
                i++;
            }
            todoitems = [];
            for (key in arr) {
                todoitems.push(arr[key]);
            }
            localStorage.setItem('autoBlockList', JSON.stringify(todoitems));
        }
    }
}

function onBeforeRequest(details) {
    if (localStorage.getItem('status') === 'true') {
        return {
            cancel: checkUrl(details.url) !== false
        };
    }
}

init();


chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(onInstalled);

chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, {urls: ['<all_urls>']});
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {urls: ['<all_urls>']}, ['blocking']);

chrome.browserAction.setBadgeText({text: 'Dev'});

console.log('\'Allo \'Allo! Event Page for Browser Action');