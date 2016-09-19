/**
 * Created by Lior on 9/19/2016.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('gravatarService', gravatarService);
    function gravatarService() {
        return function gravatar(email, options) {
           return 'http://www.gravatar.com/avatar/' + md5(email);

        };

    }

})();

