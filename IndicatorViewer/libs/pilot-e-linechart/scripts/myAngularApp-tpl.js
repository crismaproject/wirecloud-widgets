angular.module('').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/my-directive.html',
    "<div>\n" +
    "    The 'templates' folder contains template htmls of directives that will automagically be processed during build.<br>\n" +
    "    The 'scripts/directives' folder contains the actual directives that will automagically be processed during build.<br>\n" +
    "    {{description}}<br>\n" +
    "    {{info}}\n" +
    "</div>"
  );

}]);
