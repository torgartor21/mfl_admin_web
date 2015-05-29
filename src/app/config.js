(function (angular) {
    "use strict";

    angular.module("mflAdminAppConfig", [
        "sil.common.logging",
        "sil.api.wrapper",
        "sil.grid"
    ])

    .constant("SERVER_URL", window.MFL_SETTINGS.SERVER_URL)

    .constant("CREDZ", window.MFL_SETTINGS.CREDZ)

    .config(["loggingConfigProvider", function(loggingConfig){
        loggingConfig.LOG_TO_SERVER = false;
        loggingConfig.LOG_SERVER_URL = undefined;
        loggingConfig.LOG_TO_CONSOLE = true;
    }])
    .config(["silGridConfigProvider", function(silGridConfig){
        silGridConfig.apiMaps = {
            users : ["mfl.users.wrapper", "usersApi"]
        };
        silGridConfig.appConfig = "mflAdminAppConfig";
    }]);

})(angular);
