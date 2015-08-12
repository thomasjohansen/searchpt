/**
 * @file
 * This is the main controller for the application.
 *
 * It controls the search box and filters.
 */

angular.module('searchBoxApp').controller('boxController', ['CONFIG', 'communicatorService', 'searchProxy', '$scope', '$timeout',
  function (CONFIG, communicatorService, searchProxy, $scope, $timeout) {
    'use strict';

    // Set template to use.
    $scope.template = CONFIG.templates.box;

    // Init the query object.
    $scope.query = {
      'text': '',
      'filters': {}
    };

    // Check if the provider supports an pager.
    if (CONFIG.provider.hasOwnProperty('pager')) {
      // Add pager information to the search query.
      $scope.query['pager'] = CONFIG.provider.pager;

      // Inform the result application about the pager.
      communicatorService.$emit('pager', CONFIG.provider.pager);
    }

    // Check if filters are defined by the provider.
    $scope.filters = searchProxy.getFilters();

    /**
     * Execute the search and emit the results.
     */
    $scope.search = function search() {
      searchProxy.search($scope.query).then(function (data) {
        // Updated filters.
        $scope.filters = searchProxy.getFilters();

        // Send results.
        communicatorService.$emit('hits', {"hits" : data});
      });
    }
  }
]);
