var blockAidApp = angular.module('BlockAidApp', []);

blockAidApp.controller('BlockAidController', ['$scope', function ($scope) {
    $scope.status = localStorage.getItem("status");
    $scope.manifest = chrome.runtime.getManifest();
    $scope.mode = localStorage.getItem("mode");
    $scope.blockList = function () {
        if ($scope.status === 'false') {
            return JSON.parse(localStorage.getItem("manualBlockList") || '[]')
        } else {
            return JSON.parse(localStorage.getItem("autoBlockList") || '[]')
        }
    }

    $scope.pushToBlockList = function () {
        if ($scope.blockItem) $scope.blockList.push({text: $scope.blockItem, done: true});
        $scope.blockItem = '';
        localStorage.setItem("manualBlockList", JSON.stringify($scope.blockList));
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.blockList, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.openSettings = function () {
        chrome.tabs.create({url: $scope.manifest.options_page});
    };

    $scope.openWebSite = function () {
        chrome.tabs.create({url: "http://www.codeweft.com/blockaid/"});
    };

    $scope.deleteItem = function (index) {
        $scope.blockList.splice(index, 1);
        localStorage.setItem("manualBlockList", JSON.stringify($scope.blockList));
    }

    $scope.saveItem = function ($index) {
        localStorage.setItem("manualBlockList", JSON.stringify($scope.blockList));
    }

    $scope.toggleStatus = function () {
        var status = $scope.status === "true" ? false : true;
        if (status) {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/default.png"}, function () {
            });
            $scope.blockList = JSON.parse(localStorage.getItem("autoBlockList"));
        }
        else {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/disabled.png"}, function () {
            });
        }
        localStorage.setItem("status", status);
        $scope.apply;
    };


    $scope.toggleMode = function () {
        var mode = $scope.mode === "true" ? false : true;
        if (mode) {
            $scope.inputFormToggle = {'visibility': 'hidden'};
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/auto.png"}, function () {
            });
            $scope.blockList = JSON.parse(localStorage.getItem("autoBlockList"));
        }
        else {
            $scope.inputFormToggle = {'visibility': 'visible'};
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/manual.png"}, function () {
            });
            $scope.blockList = JSON.parse(localStorage.getItem("manualBlockList"));
        }
        localStorage.setItem("mode", mode);
        $scope.apply;
    };

    $scope.download = function () {
        var blockList = JSON.stringify($scope.blockList)
        var blob = new Blob([blockList], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "BlockAidList.json");
    };


}]);