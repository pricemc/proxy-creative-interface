(function () {
    'use strict';

    angular
        .module('app')
        .factory('DomainService', DomainService);

        DomainService.$inject = ['$http'];
    function DomainService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.Create = Create;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/domains').then(handleSuccess, handleError('Error getting all domains'));
        }

        function Create(subdomain, port) {
            return $http.post('/register?subdomain=' + subdomain + '&port=' + port).then(handleSuccess, handleError('Error creating subdomain'));
        }

        function Delete(id) {
            return $http.post('/unregister?_id=' + id).then(handleSuccess, handleError('Error deleting subdomain'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
