var blockAidApp = angular.module('BlockAidApp', []);

blockAidApp.controller('BlockAidController', ['$scope', function ($scope) {

    $scope.setIcon = function () {
        if ($scope.status == 'true') {
            if ($scope.mode === 'false') {
                chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/default.png"}, function () {
                });
            } else {
                chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/auto.png"}, function () {
                });
            }
        } else {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/disabled.png"}, function () {
            });
        }

    }

    $scope.init = function () {
        $scope.status = localStorage.getItem("status");
        $scope.manifest = chrome.runtime.getManifest();
        $scope.mode = localStorage.getItem("mode");
        if ($scope.mode === 'false') {
            $scope.blockList = JSON.parse(localStorage.getItem("manualBlockList") || '[]')
            $scope.inputFormToggle = {'visibility': 'visible'};
            $scope.checked = false
        } else {
            $scope.blockList = JSON.parse(localStorage.getItem("autoBlockList") || '[]')
            $scope.inputFormToggle = {'visibility': 'hidden'};
            $scope.checked = true
        }
        $scope.setIcon()
    };
    $scope.init();

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
        localStorage.setItem("status", status);
        $scope.init();
    };


    $scope.toggleMode = function () {
        var mode = $scope.mode === "true" ? false : true;
        localStorage.setItem("mode", mode);
        $scope.init();
    };
}])
;