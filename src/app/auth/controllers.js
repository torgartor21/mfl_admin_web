(function () {
    "use strict";

    angular.module("mfl.auth.controllers", [
        "mfl.auth.services",
        "ui.router"
    ])

    .controller("mfl.auth.controllers.login",
        ["$scope", "$sce", "$state", "mfl.auth.services.login",
        function ($scope, $sce, $state, loginService) {
            $scope.test = "Login";
            $scope.login_err = "";
            $scope.login_err_html = "";

            $scope.submitUser = function(obj) {
                var error_fxn = function (data) {
                    $scope.login_err = data.data.error_description || data.data.detail;
                    $scope.login_err_html =  $sce.trustAsHtml($scope.login_err);
                };
                var success_fxn = function () {
                    $state.go("dashboard");
                };
                loginService.login(obj)
                    .then(
                        function () {
                            loginService.currentUser().then(success_fxn, error_fxn);
                        },
                        error_fxn
                    );
            };
        }
    ])

    .controller("mfl.auth.controllers.logout",
        ["$state", "mfl.auth.services.login", function ($state, loginService) {
            var callback = function () {
                $state.go("login");
            };
            loginService.logout().then(callback, callback);
        }]
    );

})(angular);