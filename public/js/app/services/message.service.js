(function() {
    'use strict';

    angular
        .module('app')
        .factory('messageService', messageService);

    //messageService.$inject = ['$http', '$location', '$q', 'exception', 'logger'];
    messageService.$inject = ['$resource'];


    function messageService($resource) {

        var service = {
            getMessages:getMessages,
            saveMessage:saveMessage
        };
        var msgResource = $resource("/messages/:id");

        function getMessages() {
            return msgResource.query(
                function (data) {
                    return data;
                }).$promise;
        }

        function saveMessage(data){
            msgResource.save(data);
        }

        function deleteMessage(id){
            msgResource.delete({ _id: id });
        }

        return service;
    }
})();
