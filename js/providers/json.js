/**
 * @file
 * Dummy search provider that reads the search results from a JSON file.
 */

/**
 * Search provider for JSON files.
 */
angular.module('searchBoxApp').service('jsonProvider', ['CONFIG', '$http',
  function (CONFIG, $http) {
    'use strict';

    // Load JSON file based on configuration.
    var data = [];
    $http.get(CONFIG.provider.data)
      .then(function(res){
        data = res.data;
      });

    /**
     * Search function to query the json data.
     *
     * @param $query
     *   The query parameters to search
     *
     * @returns {Array}
     *   The hits found.
     */
    this.search = function query(query) {

      var hits = angular.copy(data);

      // Search title.
      if (query.text !== '') {
        hits = JSON.search(data, '//*[contains(title, "' + query.text + '")]');
      }

      // Search filters.
      angular.forEach(query.filters, function (filter, name) {
        // Get search type 'or' or 'and'.
        var type = CONFIG.provider.filters[name].type;
        var xp = false;

        angular.forEach(filter, function (enabled, value) {
          if (enabled) {
            if (type == 'or') {
              // Or type search needs to build and xpath expression for all items
              // in the filter.
              if (xp === false) {
                xp = '//*[' + name + '="' + value + '"]';
              }
              else {
                xp += '|//*[' + name + '="' + value + '"]';
              }
            }
            else {
              // "And" type search simply limites the results.
              hits = JSON.search(hits, '//*[' + name + '="' + value + '"]');
            }
          }
        });

        // After all other search apply the "or" search expression.
        if (type == 'or' && xp) {
          hits = JSON.search(hits, xp);
        }
      });

      return hits;
    }
  }
]);