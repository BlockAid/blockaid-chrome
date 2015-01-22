angular.module('BlockAidApp', [])
    .controller('BlockAidController', ['$scope', function ($scope) {
        $scope.todos = [];

        $scope.addTodo = function () {
            if($scope.todoText) $scope.todos.push({text: $scope.todoText, done: true});
            $scope.todoText = '';
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.todos});
        };

        $scope.remaining = function () {
            var count = 0;
            angular.forEach($scope.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        $scope.deleteItem = function (index) {
            $scope.todos.splice(index, 1);
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.todos});
        }

        $scope.saveItem = function ($index) {
            chrome.runtime.sendMessage({method: "setStorage", newData: $scope.todos});
        }

        $scope.isDisabled = false;
        $scope.disableText = true;
        $scope.upload_url = "click button to upload";
        $scope.upload = function () {
            $scope.isDisabled = true;
            chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
                $scope.todos = resp.extdata;
                var data = JSON.stringify($scope.todos)
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
            $scope.todos = resp.extdata;
            $scope.$apply();
        });
    }]);

