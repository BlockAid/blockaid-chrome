angular.module('BlockAidApp', [])
    .controller('BlockAidController', ['$scope', function ($scope) {
        $scope.blockList = [];

        $scope.manifest = chrome.runtime.getManifest();

        $scope.pushToBlockList = function () {
            if ($scope.blockItem) $scope.blockList.push({text: $scope.blockItem, done: true});
            $scope.blockItem = '';
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.blockList});
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
            //chrome.tabs.create({ url: "chrome://extensions/?options=" + chrome.runtime.id });
        };

        $scope.deleteItem = function (index) {
            $scope.blockList.splice(index, 1);
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.blockList});
        }

        $scope.saveItem = function ($index) {
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.blockList});
        }

////Upload @wip
//        $scope.upload_url = "click button to upload";
//        $scope.isDisabled = false;
//        $scope.disableText = true;
//        $scope.upload = function () {
//            $scope.isDisabled = true;
//            chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
//                $scope.blockList = resp.extdata;
//                var data = JSON.stringify($scope.blockList)
//                $.ajax({
//                    url: "https://api.myjson.com/bins/4sbff",
//                    type: "PUT",
//                    data: data,
//                    contentType: "application/json; charset=utf-8",
//                    dataType: "json",
//                    success: function (data, textStatus, jqXHR) {
//                    }
//                });
//            });
//            $scope.upload_url = 'https://api.myjson.com/bins/4sbff';
//            $scope.isDisabled = false;
//        };

        $scope.isChecked = localStorage.getItem("toggle");

        $scope.toggleStatus = function (isChecked) {
            console.log($scope.isChecked )
            localStorage.setItem("toggle", $scope.isChecked);
        };
        //if ($scope.toggle === "true") {
        //    chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/disabled.png"}, function () {
        //    });
        //}
        //else {
        //    chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/default.png"}, function () {
        //    });
        //}

        chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
            $scope.blockList = resp.extdata;
            $scope.$apply();
        });
    }]);
