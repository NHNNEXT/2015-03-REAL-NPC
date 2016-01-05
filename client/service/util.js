/**
 * Created by jwlee on 1/5/16.
 */

(function(angular) {
    'use strict';

    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    var app = angular.module('npcApp');
    app.factory('Util', function() {
        return {
            getLocalDateString: function(date, simple) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                var simpleForm = month + ((day < 10) ? '-0' : '-') + day;
                return simple ?
                    simpleForm : year + ((month < 10) ? '-0' : '-') + simpleForm;
            },
            // a and b are javascript Date objects
            dateDiffInDays: function(a, b) {
                // Discard the time and time-zone information.
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / _MS_PER_DAY);
            },
            dateDiffMessage: function(a, b) {
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
                var diff = utc2 - utc1;

                diff /= 1000;   // Now sec
                if (diff < 60) {
                    return '< 1 min';
                }
                diff = Math.floor(diff / 60); // Now mins
                if (diff < 60) {
                    return diff + ' mins ago';
                }
                diff = Math.floor(diff / 60); // Now hours
                if (diff < 24) {
                    return diff + ' hours ago';
                }
                diff = Math.floor(diff / 24); // Now days
                if (diff < 30) {
                    return diff + ' days ago';
                }

                if (diff < 365) {
                    return Math.floor(diff / 30) + ' months ago';
                }

                return Math.floor(diff / 365) + ' years ago';
            },
            simpleName: function(fullName) {
                return (fullName.replace('/', '-'))
                    .split('-').slice(-2).join('-');
            }
        };
    });
})(angular);
