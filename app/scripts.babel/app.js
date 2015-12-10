var blockAidApp = angular.module('BlockAidApp', []);// jshint ignore:line

blockAidApp.controller('BlockAidController', ['$scope', function ($scope) {

    $scope.setIcon = function () {
        if ($scope.status === 'true') {
            if ($scope.mode === 'false') {
                chrome.runtime.sendMessage({method: 'changeIcon', newIconPath: '../../icons/default.png'}, function () {
                });
            } else {
                chrome.runtime.sendMessage({method: 'changeIcon', newIconPath: '../../icons/auto.png'}, function () {
                });
            }
        } else {
            chrome.runtime.sendMessage({method: 'changeIcon', newIconPath: '../../icons/disabled.png'}, function () {
            });
        }
    };

    $scope.syncAuto = function () {
        $.ajax({// jshint ignore:line
            type: 'GET',
            url: 'http://0.0.0.0:3000/api/domains',
            success: function (data) {
                $scope.$apply(function () {
                    localStorage.setItem('autoBlockList', JSON.stringify(data));
                    $scope.blockList = JSON.parse(localStorage.getItem('autoBlockList'));
                });
            }
        });
    };


    $scope.init = function () {
        $scope.status = localStorage.getItem('status');
        $scope.manifest = chrome.runtime.getManifest();
        $scope.mode = localStorage.getItem('mode');
        if ($scope.mode === 'false') {
            $scope.blockList = JSON.parse(localStorage.getItem('manualBlockList') || '[]');
            $scope.inputFormToggle = {'visibility': 'visible'};
            $scope.checked = false;
        } else {
            $scope.syncAuto();
            console.log('done');
            $scope.blockList = JSON.parse(localStorage.getItem('autoBlockList') || '[]');
            $scope.inputFormToggle = {'visibility': 'hidden'};
            $scope.checked = true;
        }
        $scope.setIcon();
    };

    $scope.init();

    $scope.pushToBlockList = function () {
        if ($scope.blockItem) {
            $scope.blockList.push({domain: $scope.blockItem, enabled: true});
        }
        $scope.blockItem = '';
        localStorage.setItem('manualBlockList', JSON.stringify($scope.blockList));
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.blockList, function (todo) {// jshint ignore:line
            count += todo.enabled ? 0 : 1;
        });
        return count;
    };

    $scope.openSettings = function () {
        chrome.tabs.create({url: $scope.manifest.options_ui.page});// jshint ignore:line
    };

    $scope.openWebSite = function () {
        chrome.tabs.create({url: 'http://www.codeweft.com/blockaid/'});
    };

    $scope.deleteItem = function (index) {
        $scope.blockList.splice(index, 1);
        localStorage.setItem('manualBlockList', JSON.stringify($scope.blockList));
    };

    $scope.saveItem = function ($index) {// jshint ignore:line
        localStorage.setItem('manualBlockList', JSON.stringify($scope.blockList));
    };

    $scope.toggleStatus = function () {
        var status = $scope.status !== 'true';
        localStorage.setItem('status', status);
        $scope.init();
    };


    $scope.toggleMode = function () {
        var mode = $scope.mode !== 'true';
        localStorage.setItem('mode', mode);
        $scope.init();
    };
}]);