angular.module('eu.crismaproject.pilotE.linechart.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/pilotELinechart.html',
    "<div>\n" +
    "<!--    <nvd3-line-chart data=\"data\"\n" +
    "                     id=\"pilot-e-linechart\"\n" +
    "                     height=\"{{height}}\"\n" +
    "                     width=\"{{width}}\"\n" +
    "                     showXAxis=\"true\"\n" +
    "                     showYAxis=\"true\"\n" +
    "                     showLegend=\"true\"\n" +
    "                     xAxisTickFormat=\"xAxisTickFormatFunction()\"\n" +
    "                     yAxisTickFormat=\"yAxisTickFormatFunction()\"\n" +
    "                     x=\"xFunction()\"\n" +
    "                     y=\"yFunction()\"\n" +
    "                     forcey=\"[0, 100]\"\n" +
    "                     interactive=\"true\"\n" +
    "                     useInteractiveGuideLine=\"true\"\n" +
    "                     tooltips=\"true\">\n" +
    "        <svg></svg>\n" +
    "    </nvd3-line-chart>-->\n" +
    "    \n" +
    "    <nvd3-line-with-focus-chart data=\"data\"\n" +
    "                     id=\"pilot-e-linechart\"\n" +
    "                     height=\"{{height}}\"\n" +
    "                     height2=\"{{height / 5}}\"\n" +
    "                     width=\"{{width}}\"\n" +
    "                     showXAxis=\"true\"\n" +
    "                     showYAxis=\"true\"\n" +
    "                     showLegend=\"true\"\n" +
    "                     xAxisTickFormat=\"xAxisTickFormatFunction()\"\n" +
    "                     yAxisTickFormat=\"yAxisTickFormatFunction()\"\n" +
    "                     x=\"xFunction()\"\n" +
    "                     y=\"yFunction()\"\n" +
    "                     interactive=\"true\"\n" +
    "                     useInteractiveGuideLine=\"true\"\n" +
    "                     tooltips=\"true\"\n" +
    "                     objectEquality=\"true\">\n" +
    "        <svg></svg>\n" +
    "    </nvd3-line-with-focus-chart>\n" +
    "</div>"
  );

}]);
