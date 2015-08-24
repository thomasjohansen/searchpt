/**
 * @file
 * This is the main controller for the application.
 *
 * It controls the search box and filters.
 */

angular.module('searchBoxApp').controller('boxController', ['CONFIG', 'communicatorService', 'searchProxy', '$scope',
  function (CONFIG, communicatorService, searchProxy, $scope) {
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
      $scope.query.pager = angular.copy(CONFIG.provider.pager);
    }

    // Check if filters are defined by the provider.
    searchProxy.getFilters().then(
      function (filters) {
        $scope.filters = filters;
      },
      function (reason) {
        console.error(reason);
      }
    );

    /**
     * @TODO: Missing description.
     */
    communicatorService.$on('pager', function (event, data) {
      $scope.query.pager = {
        'size': data.size,
        'page': data.page
      };
      search();
    });

    /**
     * @TODO: Missing description.
     */
    $scope.searchClicked = function searchClicked() {
      // Reset pager.
      if ($scope.query.hasOwnProperty('pager')) {
        $scope.query.pager = angular.copy(CONFIG.provider.pager);
      }

      search();
    };

    /**
     * Execute the search and emit the results.
     */
    function search() {
      searchProxy.search($scope.query).then(
        function (data) {
          // Updated filters.
          searchProxy.getFilters().then(
            function (filters) {
              $scope.filters = filters;
            },
            function (reason) {
              console.error(reason);
            }
          );

          // Send results.
          communicatorService.$emit('hits', {"hits" : data});
        },
        function (reason) {
          console.error(reason);
        }
      );
    }
  }
]);
