/*
 Peter.Kutschera@ait.ac.at, 2014-02-11
 Time-stamp: "2014-04-15 14:44:30 peter"

    Copyright (C) 2014  AIT / Austrian Institute of Technology
    http://www.ait.ac.at
 
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as
    published by the Free Software Foundation, either version 2 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/gpl-2.0.html
*/

/*
 <indicator-time-intervals
         indicator-data="listOfIndicatorObjects" // required
	 indicator-filter="listOfIndicatorIds"   // optional, untested
	 ws-filter="listOfWsIds"                 // optional, untested
	 groupIndicatorsBy="worldstate"          // optional, "worldstate" or "indicator"
	 min-time="minTime"                      // optional, used to sync time range from <tree-graph>
	 max-time="maxTime"                      // optional, used to sync time range from <tree-graph>
	 width="960"                             // width in pixel
 >
 </indicator-time-intervals>
*/

WstApp.directive ('indicatorTimeIntervals', function ($parse) {
    var directiveDefinitionObject = {
        restrict: 'E',
        replace: false,
        scope: {
			allIndicators: "=indicatorData",
			wsFiler: '=?wsFilter',
			indicatorFilter: "=?indicatorFilter",
			groupBy: "=?groupIndicatorsBy",
			minTime: '=?minTime',
			maxTime: '=?maxTime',
			onSelection: "&onSelection"
		},
		link: function (scope, element, attrs) {
			var graph = d3.select(element[0]);

			// build the options object
			// indicatorHeight > fontSize + 4
			var options = $.extend ({fontSize : 12, indicatorHeight: 20, lineWidth: 16, width : 960}, attrs);
			
			// create tool-tip container
			var div =  d3.select(element[0])
			.append("div")   
			.attr("class", "indicator-interval-tooltip")               
			.style("opacity", 0);

			var timeMarkers = [];
			
			var data = [];
			var calculatedMinTime = null;
			var calculatedMaxTime = null;

			scope.$watch ('allIndicators', function (newVal, oldVal) {
				console.log ('intervals: change allIndicators ' + JSON.stringify (oldVal) + ' --> ' + JSON.stringify (newVal));
				if (newVal === oldVal) { 
					return; 
				}
				buildDataset();
				redraw();
			});

			scope.$watch ('minTime', function (newVal, oldVal) {
				// console.log ('change minTime ' + JSON.stringify (oldVal) + ' --> ' + JSON.stringify (newVal));
				if (newVal === oldVal) { 
					return; 
				}
				redraw();
			});
			scope.$watch ('maxTime', function (newVal, oldVal) {
				// console.log ('change maxTime ' + JSON.stringify (oldVal) + ' --> ' + JSON.stringify (newVal));
				if (newVal === oldVal) { 
					return; 
				}
				redraw();
			});
			scope.$watch ('groupBy', function (newVal, oldVal) {
				// console.log ('change groupBy ' + JSON.stringify (oldVal) + ' --> ' + JSON.stringify (newVal));
				if (newVal === oldVal) { 
					return; 
				}
				rearrange();
			});


			var indicator;

			function redraw () {
				graph.select('svg').remove();

				var svg, x, y;
				// size of the diagram
				var size = { width:+options.width, height: data.length * options.indicatorHeight + 15}; 
				var margin = {top: 20, right: 20, bottom: 60, left: 50};

				var minTime = scope.minTime != null ? d3.time.format.iso.parse(scope.minTime) : calculatedMinTime;
				var maxTime = scope.maxTime != null ? d3.time.format.iso.parse(scope.maxTime) : calculatedMaxTime;

				x = d3.time.scale()
					.range([150, size.width]);

				y = d3.scale.linear()
					.range([options.indicatorHeight, data.length * options.indicatorHeight]);

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(d3.time.format("%H:%M"));

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				svg = graph.append("svg")
					.attr("width", size.width + margin.left + margin.right)
					.attr("height", size.height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				x.domain ([minTime, maxTime]).nice(); //.nice();
				y.domain ([0, data.length - 1]);

		// data = [{"id":"timeIntervalsTest","name":"Just some test data","description":"List of time intervals","worldstates":[59,81],"type":"timeintervals","data":{"intervals":[{"startTime":"2012-01-01T12:19:00.000","endTime":"2012-01-01T12:24:00.000","startt":"2012-01-01T11:19:00.000Z","endt":"2012-01-01T11:24:00.000Z"},{"startTime":"2012-01-01T12:41:00.000","endTime":"2012-01-01T12:45:00.000","startt":"2012-01-01T11:41:00.000Z","endt":"2012-01-01T11:45:00.000Z"}],"cssClass":"indicators-timeIntervallsTest","linewidth":2,"yws":0,"yind":0},"worldstate":"82"}]"

				indicator = svg.selectAll(".indicator-intervals")
					.data(data)
					.enter()
					.append ("g")
					.attr("class", "indicator-intervals")
					.attr("transform", function (d) {return "translate(0, " + y(scope.groupBy === "worldstate" ? d.data.yws : d.data.yind) +")"});

				var defaultColor = "#b2b2b2";
				var txt = indicator
					.append ("text")
					.attr("class", "indicator-text")
					.attr("fill", function(d){
						if (d.data.color != undefined) {
							return d.data.color;
						} else {
							return defaultColor;						
						}
					})
					.attr("dy", options.fontSize)
					.attr("x", 0)
					.attr("id", function(d) {
						return d.id;
					})
					.text (function (d) { 
						if (d.displayText != undefined) {
							return d.displayText + ":"; 
						} else {
							return d.name + ":"; 
						}
					})
					.on("click", function(d) { 
						if (d.data.enabled == undefined || d.data.enabled == true) {
							selectIndicator (d.id, d3.event.shiftKey, d3.event.ctrlKey);
						}
					});
				var intervals = indicator.selectAll(".line")
					.data (function (d) { 
						return d.data.intervals;
					})
					.enter()
					.append("line")
					.attr("class", "indicator-interval")
					.attr("stroke", function(d){
						if (d.color != undefined) {
							return d.color;
						} else {
							return defaultColor;						
						}
					})
					.attr("fill", function(d){
						if (d.color != undefined) {
							return d.color;
						} else {
							return defaultColor;
						}
					})
					.attr("x1", function(d) { 
						return x(d.startt); 
					})
					.attr("x2", function(d) { 
						return x(d.endt); 
					})
					.attr("y1", (options.lineWidth) / 2)
					.attr("y2", (options.lineWidth) / 2)
					.attr("stroke-width", options.lineWidth) 
					.style("opacity", .7)
					.on("mouseover", function(d) {      
						div.transition()        
							.duration(200)      
							.style("opacity", .9); 
						var format = d3.time.format("%H:%M");
						div.html(d.name + ": " + format(d.startt) + " - " + format(d.endt))  
							.style("left", (d3.event.pageX) + "px")     
							.style("top", (d3.event.pageY - 28) + "px");    
					})                  
					.on("mouseout", function(d) {       
						div.transition()        
							.duration(500)      
							.style("opacity", 0);   
					})
					.on("click", function(d) {
						if (d.enabled == undefined || d.enabled == true) {
							selectIndicator (d.id, d3.event.shiftKey, d3.event.ctrlKey);
						}
					});
				
				var durations = indicator.selectAll(".text")
					.data (function (d) { 
						return d.data.intervals;
					})
					.enter()
					.append("text")
					.attr("class", "duration-text")
					.attr("x", function(d) {
						var retVal = x(d.startt) + (x(d.endt) - x(d.startt)) / 2;
						return retVal;
					})
					.attr("dy", options.fontSize)
					.attr("text-anchor", "middle")
					.text(function(d) {
						var diff = ((d.endt.getTime() - d.startt.getTime()) / 1000) / 60;						
						return ((Math.round(diff)) + " min");
					})
					.on("click", function(d) { 
						if (d.enabled == undefined || d.enabled == true) {
							selectIndicator (d.id, d3.event.shiftKey, d3.event.ctrlKey);
						}
					});

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + size.height + ")")
						.call(xAxis);
						

				// append lines for reference and incident time:
				var parseDate = d3.time.format.iso.parse;
				var format = d3.time.format("%H:%M");
				for (var i = 0; i < timeMarkers.length; i++) {
					var indTime = parseDate(timeMarkers[i].time);
					var linePosition = (i % 2) + 1;
					svg.append("line")
						.attr("x1", x(indTime))
						.attr("x2", x(indTime))
						.attr("y1", y.range()[0] - 10)
						.attr("y2", y.range()[1] + (25 * linePosition))
						.attr("class", "indicator-timestamp");
					svg.append("text")
						.attr("x", x(indTime) - 50)
						.attr("y", size.height + margin.top + (15 * linePosition))
						.attr("fill", "#CC0000")
						.text(timeMarkers[i].name + ' ' + format(indTime));
				}
				svg.select("x axis").transition().call(xAxis);
				
			}

			function rearrange () {
				if (!scope.showTimeline) return;
				indicator
					.transition()        
					.duration(500)
					.attr("transform", function (d) {return "translate(0, " + y(scope.groupBy === "worldstate" ? d.data.yws : d.data.yind) +")"});

			}

			function buildDataset () {
			
				calculatedMinTime = null;
				calculatedMaxTime = null;

				data = [];
				timeMarkers = [];
				if (scope.allIndicators == null) {
					return;
				}
				var indicators = [];
				// list of worldstates
				var wss = d3.keys (scope.allIndicators);
				// filter by WorldState
				if (scope.wsFilter != null) {
					var tmp = wss;
					wss = [];
					for (var w = 0; w < tmp.length; w++) {
						if (scope.wsFilter.indexOf (tmp[w]) != -1) {
							wss.push (tmp[w]);
						}
					}
				}
				// console.log ('buildDataset: wss =  ' + JSON.stringify (wss));
				if (wss.length == 0) {
					return;
				}
				// list of indicators
				var inds = {};
				for (var w = 0; w < wss.length; w++) {
					for (var i = 0; i < scope.allIndicators[wss[w]].length; i++) {
						// filter by indicator id
						if ((scope.indicatorFilter == null) || (scope.indicatorFilter.indexOf (scope.allIndicators[wss[w]][i].id) != -1)) {
							// filter by indicator type - keep only what I know how to visualize
							if ((["timeintervals"].indexOf (scope.allIndicators[wss[w]][i].type) != -1) || (["timestamp"].indexOf (scope.allIndicators[wss[w]][i].type) != -1)) {
								inds[scope.allIndicators[wss[w]][i].id] = 1;
							} 
						}
					}
				}
				inds = d3.keys (inds);
				// console.log ('buildDataset: inds = ' + JSON.stringify (inds));
				if (inds.length == 0) {
					return;
				}
				var yws = 0;  // y if sorted by WorldState
				var yind = 0; // y if sorted by Indicator
				for (var w = 0; w < wss.length; w++) {
					yind = w;
					for (var i = 0; i < scope.allIndicators[wss[w]].length; i++) {
						// filter by indicators found above
						if (inds.indexOf (scope.allIndicators[wss[w]][i].id) != -1) {
							// filter by indicator type - keep only what I know to visualize
							if (["timeintervals"].indexOf (scope.allIndicators[wss[w]][i].type) != -1) {
								scope.allIndicators[wss[w]][i].worldstate = wss[w];
								scope.allIndicators[wss[w]][i].data.yws = yws;
								yws++;
								scope.allIndicators[wss[w]][i].data.yind = yind;
								yind += wss.length; // this assumes that all worldstates have all indicators!
								indicators.push (scope.allIndicators[wss[w]][i]);
							} else if (["timestamp"].indexOf (scope.allIndicators[wss[w]][i].type) != -1) {
								timeMarkers.push (scope.allIndicators[wss[w]][i]);
							}
						}
					}
				}
				var parseDate = d3.time.format.iso.parse;
				for (var i = 0; i < indicators.length; i++) {
					for (var j = 0; j < indicators[i].data.intervals.length; j++) {
						var n = indicators[i].data.intervals[j];
						n.startt = parseDate (n.startTime);
						n.endt   = parseDate (n.endTime);
						if (!calculatedMinTime || calculatedMinTime > n.startt) {
							calculatedMinTime = n.startt;
						}
						if (!calculatedMaxTime || calculatedMaxTime < n.endt) {
							calculatedMaxTime = n.endt;
						}
						n.color = indicators[i].data.color;
						n.cssClass = indicators[i].data.cssClass ? indicators[i].data.cssClass : "indicator-" + indicators[i].id;
						n.id = indicators[i].id;
						n.name = indicators[i].name;
						n.enabled = indicators[i].data.enabled;
					}
				}
				data = indicators;
				// change min and max time according to timestamp indicators:
				for (var i = 0; i < timeMarkers.length; i++) {
					var t = parseDate(timeMarkers[i].time);
					if (!calculatedMinTime || calculatedMinTime > t) {
						calculatedMinTime = t;
					}
					if (!calculatedMaxTime || calculatedMaxTime < t) {
						calculatedMaxTime = t;
					}
				}
				console.log ('buildDataset: data = ' + JSON.stringify (data));
			}

			function selectIndicator (ind_id, shiftKey, ctrlKey) {
				if (!(shiftKey || ctrlKey)) {
					// take this one
					selection = [ind_id];
				} else if (ctrlKey && !shiftKey) {
					// add or remove
					var i = selection.indexOf (ind_id);
					if (i == -1) {
						selection.push (ind_id);
					} else {
						selection.splice (i, 1);
					}
				} else if (shiftKey && !ctrlKey) {
					// Add all between this and what?
				}
				
				d3.selectAll(".indicator-interval, .indicator-interval-selected").attr("class", function (d) {
					if (selection.indexOf (d.id) == -1) {
						return "indicator-interval";
					} else {
						return "indicator-interval-selected";
					}
				});
				
				d3.selectAll(".indicator-text, .indicator-text-selected").attr("class", function (d) {
					if (selection.indexOf (d.id) == -1) {
						return "indicator-text";
					} else {
						return "indicator-text-selected";
					}
				});
				
				if (scope.onSelection != null) {
					scope.onSelection ({selection:selection});
				}
			}	
		}
	};
    return directiveDefinitionObject;
});
