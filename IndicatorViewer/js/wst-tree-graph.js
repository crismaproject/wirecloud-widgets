/*
 Peter.Kutschera@ait.ac.at, 2014-02-11
 Time-stamp: "2014-02-27 10:10:11 peter"

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

// see http://docs.angularjs.org/guide/directive
//  <tree-graph base-ws="treeData" on-selection="selectWS(selection)" width="960"></tree-graph>

WstApp.directive ('treeGraph', function ($parse) {
    //explicitly creating a directive definition variable
    //this may look verbose but is good for clarification purposes
    //in real life you'd want to simply return the object {...}
    var directiveDefinitionObject = {
        //We restrict its use to an element
        //as usually  <treeGraph> is semantically
        //more understandable
        restrict: 'E',
        //this is important,
        //we don't want to overwrite our directive declaration
        //in the HTML mark-up
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {
	    data: '=baseWs',
	    onSelection: "&onSelection",
	    minTime: '=?minTime',
	    maxTime: '=?maxTime'
	},
        link: function (scope, element, attrs) {
	    //in D3, any selection[0] contains the group
	    //selection[0][0] is the DOM node
	    //but we won't need that this time
	    var tree = d3.select(element[0]);

	    // build the options object
	    var options = $.extend ({nodeRadius : 5, fontSize : 12, roomAboveNode: 85, width : 960}, attrs);
	    
	    // list of id's of selected nodes
	    var selection = [1, 2, 3];

	    // create tool-tip container
	    var div =  d3.select(element[0])
		.append("div")   
		.attr("class", "tree-tooltip")               
		.style("opacity", 0);


	    scope.$watch ('data', function (newVal, oldVal) {
		//console.log ('change ' + JSON.stringify (oldVal) + ' --> ' + JSON.stringify (newVal));
		tree.select('svg').remove();
		if ((selection.length > 0) && (scope.onSelection != null)) {
		    selection = [];
		    scope.onSelection ({selection: selection});
		}
		if (!newVal) {
		    return;
		}
		var rows = 0;
		var minTime = null;
		var maxTime = null;
		var parseDate = d3.time.format.iso.parse; // d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
		var nodes = [];
		var links = [];
		visit (null, scope.data, 
		       function (p, n) {
			   if (!n.wsid) {
			       return;
			   }
			   nodes.push (n);
			   if (p) {
			       links.push ([p, n]);
			   }
			   if (rows < n.branchNumber) {
			       rows = n.branchNumber;
			   }
			   n.t = parseDate (n.time);
 			   if (!minTime || minTime > n.t) {
			       minTime = n.t;
			   }
 			   if (!maxTime || maxTime < n.t) {
			       maxTime = n.t;
			   }
		       },
		       function (d) {
			   return d.children;
		       });
		scope.minTime = minTime != null ? d3.time.format.iso(minTime) : null;
		scope.maxTime = maxTime != null ? d3.time.format.iso(maxTime) : null;
		console.log ("set scope.minTime = " + scope.minTime + ", scope.maxTime = " + scope.maxTime);
		// size of the diagram
		// height: rows+1 rows, each roomAboveNode high (needed for the text); 15: x-axis
		var size = { width:+options.width, height: (rows + 1) * options.roomAboveNode + 15}; 
		var margin = {top: 20, right: 20, bottom: 30, left: 50};

		var x = d3.time.scale()
		    .range([0, size.width]);

		var y = d3.scale.linear()
		    .range([options.roomAboveNode, size.height - 15]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");


		var svg = tree.append("svg")
		    .attr("width", size.width + margin.left + margin.right)
		    .attr("height", size.height + margin.top + margin.bottom)
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		x.domain ([minTime, maxTime]);
		y.domain ([0, rows]);


		// Edges between nodes as a <path class="link" />
		var link = d3.svg.line()
		    .x (function (d) { return x(d.t) })
		    .y (function(d) { return y(d.branchNumber) })
		    .interpolate ("basis");
		
		svg.selectAll("path.link")
		    .data(links)
		    .enter()
		    .append("svg:path")
		    .attr("class", "link")
		    .attr("d", link);



		var nodeGroup = svg.selectAll ("g.node")
		    .data (nodes)
		    .enter()
		    .append ("svg:g")
		    .attr ("class", "node")
		    .attr ("transform", function(d)
			   {
			       return "translate(" + x(d.t) + "," + y(d.branchNumber) + ")";
			   });


		nodeGroup.append("svg:circle")
		    .attr("class", "node-dot")
		    .attr("r", options.nodeRadius)
		    .on("click", function (d) {selectNode (d.wsid, d3.event.shiftKey, d3.event.ctrlKey)})
		    .on("mouseover", function(d) {      
			div.transition()        
			    .duration(200)      
			    .style("opacity", .9);      
			div.html(JSON.stringify (d.data.description))  
			    .style("left", (d3.event.pageX < size.width / 2 ? d3.event.pageX : d3.event.pageX - 600) + "px")     
			    .style("top", (d3.event.pageY - 28) + "px");    
		    })                  
		    .on("mouseout", function(d) {       
			div.transition()        
			    .duration(500)      
			    .style("opacity", 0);   
		    });
		

		nodeGroup.append("svg:text")
		    .attr("text-anchor", "start")
		    .attr("transform", "rotate(-90)")
		    .attr("dy", options.fontSize / 2)
		    .attr("dx", options.nodeRadius + 7)
		    .text(function(d)
			  {
			      return d.label;
			  });
		

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + size.height + ")")
		    .call(xAxis);
		
	    }, true);   

	    function selectNode (wsid, shiftKey, ctrlKey) {
		if (!(shiftKey || ctrlKey)) {
		    // take this one
		    selection = [wsid];
		} else if (ctrlKey && !shiftKey) {
		    // add or remove
		    var i = selection.indexOf (wsid);
		    if (i == -1) {
			selection.push (wsid);
		    } else {
			selection.splice (i, 1);
		    }
		} else if (shiftKey && !ctrlKey) {
		    // Add all between this and what?
		}
		d3.selectAll(".node-dot, .node-selected").attr("class", function (d) {
		    if (selection.indexOf (d.wsid) == -1) {
			return "node-dot";
		    } else {
			return "node-selected";
		    }
		});
		if (scope.onSelection != null) {
		    scope.onSelection ({selection:selection});
		}
	    }

        }
    };
    return directiveDefinitionObject;
    
    /*
      childrenFn: function fo find children nodes of parent node
      visitFn: function applied to each node
    */
    function visit(parent, node, visitFn, childrenFn) {
	if (!node) return;
	visitFn(parent, node);
	var children = childrenFn(node);
	if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
		visit(node, children[i], visitFn, childrenFn);
            }
	}
    }
    
});
