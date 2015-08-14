(function(angular, _){
    "use strict";
    angular.module("mfl.setup.contacts.controllers",[
    ])

    /*Contacts*/

    .controller("mfl.setup.controller.contacts.list", ["$scope",
        function ($scope) {
            $scope.title = {
                icon: "fa-phone",
                name: "Manage Contacts"
            };
            $scope.filters = {
                "fields": "id,contact_type_name,contact"
            };
            $scope.action = [
                {
                    func : "ui-sref='setup.contacts.create'",
                    class: "btn btn-primary",
                    icon: "Add Contact"
                }
            ];
        }]
    )
    .controller("mfl.setup.controller.contacts.edit", ["$scope","$state", "$stateParams",
                "adminApi","mfl.common.forms.changes",
        function($scope, $state, $stateParams, adminApi, formChanges){
            $scope.wrapper = adminApi.contacts;
            $scope.contact_id = $stateParams.id;

            adminApi.contact_types.list().success(function(data){
                $scope.contact_types = data.results;
            }).error(function(error){
                $scope.alert = error.error;
            });
            if(!_.isUndefined($stateParams.id)){
                $scope.title = {
                    class: "btn btn-primary",
                    name: "Edit Contact"
                };
                $scope.action = [
                    {
                        func : "ui-sref=setup.contacts.edit.delete",
                        class: "btn btn-danger",
                        name : "Delete Contact"
                    }
                ];
                adminApi.contacts.get($stateParams.id).success(function(data){
                    $scope.contacts = data;
                    $scope.deleteText = $scope.contacts.contact;
                }).error(function(error){
                    $scope.alert = error.error;
                });
                $scope.remove = function () {
                    adminApi.contacts.remove($stateParams.id).success(function(){
                        $state.go("setup.contacts",{},{reload:true});
                    }).error(function(error){
                        $scope.alert = error.error;
                        $state.go("setup.contacts",{},{reload:true});
                        $scope.errors = error;
                    });
                };
                $scope.cancel = function () {
                    $state.go("setup.contacts.edit");
                };
            }
            else {
                $scope.title = {
                    icon : "fa-plus-circle",
                    class: "btn btn-primary",
                    name: "New Contact"
                };
            }
            $scope.createContacts = function(chuApprover){
                adminApi.contacts.create(chuApprover).success(function(){
                    $state.go("setup.contacts",{},{reload:true});
                }).error(function(error){
                    $scope.alert = error.error;
                    $scope.errors = error;
                });
            };
            $scope.updateContact = function(id, frm){
                var changes= formChanges.whatChanged(frm);
                if(!_.isEmpty(changes)){
                    adminApi.contacts.update(id, changes).success(function(){
                        $state.go("setup.contacts",{},{reload:true});
                    }).error(function(error){
                        $scope.alert = error.error;
                        $scope.errors = error;
                    });
                }
            };
            $scope.deleteContacts = function(id){
                adminApi.contacts.remove(id).success(function(){
                    $state.go("setup.contacts",{},{reload:true});
                }).error(function(error){
                    $scope.alert = error.error;
                    $scope.errors = error;
                });
            };
        }]
    )
    /*Contact Types*/

    .controller("mfl.setup.controller.contact_types.list", ["$scope",
        function ($scope) {
            $scope.title = {
                icon: "fa-phone",
                name: "Manage Contact Types"
            };
            $scope.filters = {
                "fields": "id,name"
            };
            $scope.action = [
                {
                    func : "ui-sref='setup.contact_types.create'" +
                           " requires-user-feature='is_staff'" +
                           " requires-permission='common.add_contacttype'",
                    class: "btn btn-primary",
                    tipmsg: "Add Contact Type",
                    wording: "Add Contact Type"
                }
            ];
        }]
    )
    .controller("mfl.setup.controller.contact_types.view", ["$scope","$state", "$stateParams",
                "adminApi","mfl.common.forms.changes",
        function($scope, $state, $stateParams, adminApi, formChanges){
            $scope.contact_type_id = $stateParams.id;
            $scope.wrapper = adminApi.contact_types;

            if(!_.isUndefined($stateParams.id) &&
                $stateParams.id !== "create"){
                $scope.title = {
                    class: "btn btn-primary",
                    name: "Edit Contact Type"
                };
                $scope.action = [
                    {
                        func : "ui-sref='setup.contact_types.view.delete'" +
                               " requires-user-feature='is_staff'" +
                               " requires-permission='common.delete_contacttype'",
                        class: "btn btn-danger",
                        wording:"Delete",
                        tipmsg:"Delete Contact Type"

                    }
                ];
                $scope.del_popover = {
                    content: "Hello, World!",
                    templateUrl:"common/tpls/del_pop.tpl.html"
                };
                adminApi.contact_types.get($stateParams.id).success(function(data){
                    $scope.contact_types = data;
                    $scope.deleteText = $scope.contact_types.name;
                }).error(function(error){
                    $scope.alert = error.error;
                });
                $scope.remove = function () {
                    adminApi.contact_types.remove($stateParams.id).success(function(){
                        $state.go("setup.contact_types",{},{reload:true});
                    }).error(function(error){
                        $scope.alert = error.error;
                        $scope.errors = error;
                        $state.go("setup.contact_types",{},{reload:true});
                    });
                };
                $scope.cancel = function () {
                    $state.go("setup.contact_types.view",{},{reload:true});
                };
            }
            else if(!_.isUndefined($stateParams.id) &&
                $stateParams.id === "create") {
                $scope.title = {
                    icon : "fa-plus-circle",
                    name: "New Contact Type"
                };
            }
            $scope.createContacts = function(chuApprover){
                adminApi.contact_types.create(chuApprover).success(function(){
                    $state.go("setup.contact_types",{},{reload:true});
                }).error(function(error){
                    $scope.alert = error.error;
                    $scope.errors = error;
                });
            };
            $scope.updateContacts = function(id, frm){
                var changes= formChanges.whatChanged(frm);
                if(!_.isEmpty(changes)){
                    adminApi.contact_types.update(id, changes).success(function(){
                        $state.go("setup.contact_types",{},{reload:true});
                    }).error(function(error){
                        $scope.alert = error.error;
                        $scope.errors = error;
                    });
                }
            };
        }]
    );

})(window.angular, window._);
