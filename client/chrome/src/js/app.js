var blockAidApp = angular.module('BlockAidApp', []);

blockAidApp.controller('BlockAidController', ['$scope', function ($scope) {
    $scope.blockList = JSON.parse(localStorage.getItem("extdata") || '[]')

    $scope.manifest = chrome.runtime.getManifest();

    $scope.pushToBlockList = function () {
        if ($scope.blockItem) $scope.blockList.push({text: $scope.blockItem, done: true});
        $scope.blockItem = '';
        localStorage.setItem("extdata", JSON.stringify($scope.blockList));
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

    $scope.openWebSite = function () {
        chrome.tabs.create({url: "http://www.codeweft.com/blockaid/"});
    };

    $scope.deleteItem = function (index) {
        $scope.blockList.splice(index, 1);
        localStorage.setItem("extdata", JSON.stringify($scope.blockList));
    }

    $scope.saveItem = function ($index) {
        localStorage.setItem("extdata", JSON.stringify($scope.blockList));
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

    $scope.status = localStorage.getItem("status");
    $scope.toggleStatus = function () {
        var status = $scope.status === "true" ? false : true;
        if (status) {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/default.png"}, function () {
            });
        }
        else {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/disabled.png"}, function () {
            });
        }
        localStorage.setItem("status", status );
    };

    $scope.mode = localStorage.getItem("mode");
    $scope.toggleMode = function () {
        var mode = $scope.mode === "true" ? false : true;
        if (mode) {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/auto.png"}, function () {
            });
        }
        else {
            chrome.runtime.sendMessage({method: "changeIcon", newIconPath: "../../icons/manual.png"}, function () {
            });
        }
        localStorage.setItem("mode", mode);
    };

    $scope.download = function () {
        var blockList = JSON.stringify($scope.blockList)
        var blob = new Blob([blockList], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "BlockAidList.json");
    };

    $scope.showContent = function($fileContent){
        $scope.content = $fileContent;
    };
}]);



//blockAidApp.directive('onReadFile', function ($parse) {
//    return {
//        restrict: 'A',
//        scope: false,
//        link: function(scope, element, attrs) {
//            var fn = $parse(attrs.onReadFile);
//
//            element.on('change', function(onChangeEvent) {
//                var reader = new FileReader();
//
//                reader.onload = function(onLoadEvent) {
//                    scope.$apply(function() {
//                        fn(scope, {$fileContent:onLoadEvent.target.result});
//                    });
//                };
//
//                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
//            });
//        }
//    };
//});


