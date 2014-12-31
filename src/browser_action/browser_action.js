angular.module('todoApp', [])
    .controller('TodoController', ['$scope', function ($scope) {
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

        $scope.archive = function () {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) $scope.todos.push(todo);
            });
        };

        chrome.runtime.sendMessage({method: "getStorage", extensionSettings: "storage"}, function (resp) {
            $scope.todos = resp.extdata;
            $scope.$apply();
        });
    }]);

