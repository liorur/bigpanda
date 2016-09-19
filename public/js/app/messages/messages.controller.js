/**
 * Created by Lior on 9/19/2016.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('messages', Messages);

    Messages.$inject = ['messageService','gravatarService'];

    function Messages(messageService,gravatarService) {
        var vm = this;
        vm.messages = [];
        vm.text="";
        vm.email="";
        vm.fltr="";
        vm.add= function(){
            var data ={
                email:vm.email,
                text:vm.text
            }
            messageService.saveMessage(data);
            vm.messages.push(data)
            vm.text="";
            vm.email="";
        };
        vm.getGravatar= function(email){
           return gravatarService(email);
        };
        vm.nameTextFilter = function(msg) {
            if(vm.fltr==""){
                return true;
            }
            return (msg.email.indexOf(vm.fltr) >= 0  || msg.text.indexOf(vm.fltr) >= 0  );
        };

        function getMessages() {
             messageService.getMessages().then(function(data) {
                console.log(data);
                vm.messages = data;
                return vm.messages;
            });
        }

        getMessages();
    }
})();
