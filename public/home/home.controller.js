(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['DomainService', 'UserService', '$rootScope', '$interval'];
    function HomeController(DomainService, UserService, $rootScope, $interval) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.domains = [];
        vm.deleteDomain = deleteDomain;
        vm.createDomain = createDomain;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
            loadAllDomains();
            $interval(loadAllDomains, 5000);
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function createDomain() {
            DomainService.Create(vm.subdomain, vm.port)
                .then(function () {
                    loadAllDomains();
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function () {
                    loadAllUsers();
                });
        }
        function loadAllDomains() {
            DomainService.GetAll()
                .then(function (domains) {
                    console.log(domains);
                    vm.domains = domains.message;
                });
        }

        function deleteDomain(id) {
            DomainService.Delete(id)
                .then(function () {
                    loadAllDomains();
                });
        }
    }

})();