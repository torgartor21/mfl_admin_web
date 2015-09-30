(function(_){
    "use strict";

    describe("Test facility type controllers", function(){
        var createController, $scope, $stateParams, $httpBackend, $state, adminApi;
        var formService, SERVER_URL;

        beforeEach(function(){
            module("mflAdminApp");
            inject(["$rootScope", "$controller", "$stateParams", "$httpBackend",
                   "$state", "adminApi","mfl.common.forms.changes","SERVER_URL",
                   function($rootScope, $controller,_$stateParams,
                    _$httpBackend, _$state, _adminApi, frm, _SERVER_URL){
                $scope = $rootScope.$new();
                SERVER_URL = _SERVER_URL;
                $httpBackend = _$httpBackend;
                $stateParams = _$stateParams;
                $state = _$state;
                adminApi = _adminApi;
                formService = frm;
                createController = function(name, params) {
                    return $controller(
                        "mfl.setup.controller.facility_types." + name,
                        _.extend({"$scope": $scope}, params)
                    );

                };
            }]);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("should have list controller defined", function() {
            var ctrl = createController("list", {});
            expect(ctrl).toBeDefined();
        });

        it("should create a type", function() {
            var frm = {
                name: "lab"
            };
            $httpBackend
                .expectPOST(SERVER_URL+"api/facilities/facility_types/")
                .respond(201);
            createController("view");
            $scope.saveFrm(frm);
            $httpBackend.flush();
        });

        it("should handle failure to create a type", function() {
            var frm = {
                name: "lab"
            };
            $httpBackend
                .expectPOST(SERVER_URL+"api/facilities/facility_types/")
                .respond(500);
            createController("view");
            $scope.saveFrm(frm);
            $httpBackend.flush();
        });

        it("should handle failure to retrieve type", function () {
            $httpBackend
                .expectGET(SERVER_URL+"api/facilities/facility_types/1/")
                .respond(500);
            createController("view", {"$stateParams": {type_id: 1}});
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should update a type",
            inject(["mfl.common.forms.changes",function(formChanges){
                var frm = {
                    description: "lab description"
                };
                $httpBackend
                    .expectGET(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(200);
                createController("view", {
                    "mfl.common.forms.changes": formChanges,
                    "$stateParams": {type_id: 1}
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.resetExpectations();
                spyOn(formChanges, "whatChanged").andReturn(frm);
                $httpBackend
                    .expectPATCH(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(200, {"id": 1});
                $scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should handle fail to update a type",
            inject(["mfl.common.forms.changes",function(formChanges){
                var frm = {
                    description:"lab description"
                };
                $httpBackend.expectGET(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(200);
                createController("view", {
                    "mfl.common.forms.changes": formChanges,
                    "$stateParams": {type_id: 1}
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.resetExpectations();
                spyOn(formChanges, "whatChanged").andReturn({name:"jina"});
                $httpBackend
                    .expectPATCH(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(500);
                $scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should not update without form changes", function() {
            var data = {"$stateParams": {type_id: 1}};
            $httpBackend
                .expectGET(SERVER_URL+"api/facilities/facility_types/1/")
                .respond(200);
            createController("view",data);
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.resetExpectations();
            $scope.saveFrm({});
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should delete a type",function(){
                var res = {msg: "ok"};
                var dt = {
                    $stateParams: {type_id: 1}
                };
                spyOn($state, "go");
                $httpBackend
                    .expectDELETE(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(200, res);
                createController("view", dt);
                $scope.remove();
                $scope.cancel();
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.facility_types");
            });
        it("should handle fail to delete a type",function(){
                var res = {"detail":"Authentication credentials were not provided."};
                var dt = {$stateParams: {type_id: 1}};
                spyOn($state, "go");
                $httpBackend
                    .expectDELETE(SERVER_URL+"api/facilities/facility_types/1/")
                    .respond(403, res);
                createController("view", dt);
                $scope.remove();
                $scope.cancel();
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.facility_types");
            });
    });

})(window._);
