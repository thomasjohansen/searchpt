/**
 * @file
 * Directive to capture key codes.
 *
 * @see http://codepen.io/TheLarkInn/blog/angularjs-directive-labs-ngenterkey.
 */
angular.module('searchBoxApp').directive('keyCode', function keyCode() {
  'use strict';

  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      $element.bind("keypress", function(event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode === Number($attrs.code)) {
          $scope.$apply(function() {
            $scope.$eval($attrs.keyCode, { $event: event });
          });
        }
      });
    }
  };
});
