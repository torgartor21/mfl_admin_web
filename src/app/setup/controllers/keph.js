(function(angular,_){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.setup.keph.controllers
     *
     * @description
     * Contains all the controllers used for keph setup
     */
    angular.module("mfl.setup.keph.controllers",[
        "mfl.setup.api"
    ])

    /**
     * @ngdoc controller
     *
     * @name mfl.setup.controller.keph.list
     *
     * @description
     * The controller used to list kephs
     */
    .controller("mfl.setup.controller.keph.list", ["$scope",
        function ($scope) {
            $scope.title = {
                name: "KEPH Levels"
            };
            $scope.filters =  {
                "fields": "id,name,description"
            };
            $scope.action = [
                {
                    func : "ui-sref='setup.facility_kephs.keph_create'" +
                           " requires-user-feature='is_staff'" +
                           " requires-permission='facilities.add_kephlevel'",
                    class: "btn btn-primary",
                    tipmsg: "Add KEPH Level",
                    wording: "Add KEPH Level"
                }
            ];
        }]
    )

    /**
     * @ngdoc controller
     *
     * @name mfl.setup.controller.keph.create
     *
     * @description
     * The controller used to create kephs
     */
    .controller("mfl.setup.controller.keph.create",
        ["$scope", "$state", "$log", "adminApi","toasty",
         function ($scope, $state, $log, adminApi,toasty) {
            $scope.title = {
                icon: "fa-plus-circle",
                name: "Add KEPH Level"
            };
            $scope.keph = {
                name: ""
            };
            $scope.edit = false;
            $scope.save = function () {
                adminApi.kephs.create($scope.keph)
                .success(function () {
                    toasty.success({
                        title: "KEPH Added",
                        msg: "Keph level has been added"
                    });
                    $state.go("setup.facility_kephs",{},{reload:true});
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };
        }]
    )

    /**
     * @ngdoc controller
     *
     * @name mfl.setup.controller.keph.edit
     *
     * @description
     * The controller used to view/edit kephs
     */
    .controller("mfl.setup.controller.keph.edit",
        ["$scope", "$stateParams", "$state", "$log", "adminApi","mfl.common.forms.changes","toasty",
        function ($scope, $stateParams, $state, $log, adminApi, formChanges,toasty) {
            $scope.title = {
                icon: "fa-edit",
                name: "Edit KEPH Level"
            };
            $scope.action = [
                {
                    func : "ui-sref='setup.facility_kephs.keph_edit.delete'" +
                           " requires-user-feature='is_staff,is_national'" +
                           " requires-permission='facilities.delete_kephlevel'",
                    class: "btn btn-danger",
                    tipmsg: "Delete KEPH level",
                    wording: "Delete"
                }
            ];
            $scope.edit = true;
            $scope.keph_id = $stateParams.keph_id;
            $scope.wrapper = adminApi.kephs;

            adminApi.kephs.get($scope.keph_id)
            .success(function (data) {
                $scope.keph = data;
                $scope.deleteText = $scope.keph.name;
            })
            .error(function (data) {
                $log.error(data);
            });
            $scope.remove = function () {
                adminApi.kephs.remove($stateParams.keph_id).success(function(){
                    toasty.success({
                        title: "KEPH Deleted",
                        msg: "Keph level has been deleted"
                    });
                    $state.go("setup.facility_kephs");
                }).error(function(error){
                    $scope.alert = error.error;
                    $state.go("setup.facility_kephs");
                });
            };
            $scope.cancel = function () {
                $state.go("setup.facility_kephs");
            };
            $scope.save = function (id, frm) {
                var changes= formChanges.whatChanged(frm);
                if(!_.isEmpty(changes)){
                    adminApi.kephs.update(id, changes).success(function(){
                        toasty.success({
                            title: "KEPH Updated",
                            msg: "Keph level has been updated"
                        });
                        $state.go("setup.facility_kephs");
                    }).error(function(error){
                        $scope.alert = error.error;
                    });
                }
            };
        }]
    );

})(window.angular,window._);
