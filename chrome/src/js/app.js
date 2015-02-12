angular.module('BlockAidApp', [])
    .controller('BlockAidController', ['$scope', function ($scope) {
        $scope.blockList = [];

        $scope.pushToBlockList = function () {
            if($scope.blockItem) $scope.blockList.push({text: $scope.blockItem, done: true});
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

        $scope.deleteItem = function (index) {
            $scope.blockList.splice(index, 1);
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.blockList});
        }

        $scope.saveItem = function ($index) {
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.blockList});
        }

        $scope.isDisabled = false;
        $scope.disableText = true;
        $scope.upload_url = "click button to upload";
        $scope.upload = function () {
            $scope.isDisabled = true;
            chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
                $scope.blockList = resp.extdata;
                var data = JSON.stringify($scope.blockList)
                $.ajax({
                    url: "https://api.myjson.com/bins/4sbff",
                    type: "PUT",
                    data: data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                    }
                });
            });
            $scope.upload_url = 'https://api.myjson.com/bins/4sbff';
            $scope.isDisabled = false;
        };

        chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
            $scope.blockList = resp.extdata;
            $scope.$apply();
        });
    }]).controller('ToggleController', ['$scope', function ($scope) {
        
        var toggle = getToggle();
        
        $scope.toggle = function() {
            toggle = !toggle;
            localStorage.setItem("toggle", toggle);
        };

    }]);

function getToggle() {
    return (localStorage.getItem("toggle") === "true") ?  true : false;
}

$( document ).ready(function() {
    $("label.switch-light input").prop('checked', getToggle()); 
});

