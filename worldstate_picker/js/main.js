var apiUri = null;

function createWorldStateTree(containerName, wsid, renderOptions) {
    // create tree from WS list
    $.getJSON (apiUri + '/WorldState', function (list) {
        var treeData = getFromList (wsid, list);

        // build the options object
        var options = $.extend({
            nodeRadius: 5, fontSize: 12
        }, renderOptions);

        // Calculate total nodes, max label length
        var totalNodes = 0;
        var maxLabelLength = 0;
        visit(treeData,
            function(d) {
                totalNodes++;
                maxLabelLength = Math.max(d.label.length, maxLabelLength);
            },
            function(d) { return d.children && d.children.length > 0 ? d.children : null; });

        // size of the diagram
        var size = { width:$(containerName).outerWidth(), height: totalNodes * 15};

        var tree = d3.layout.tree()
            .sort(null)
            .size([size.height, size.width - maxLabelLength*options.fontSize])
            .children(function(d) { return (!d.children || d.children.length === 0) ? null : d.children; });

        var nodes = tree.nodes(treeData);
        var links = tree.links(nodes);

        /*
         <svg>
         <g class="container" />
         </svg>
         */
        var layoutRoot = d3.select(containerName)
            .append("svg:svg").attr("width", size.width).attr("height", size.height)
            .append("svg:g")
            .attr("class", "container")
            .attr("transform", "translate(" + maxLabelLength + ",0)");


        // Edges between nodes as a <path class="link" />
        var link = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        layoutRoot.selectAll("path.link")
            .data(links)
            .enter()
            .append("svg:path")
            .attr("class", "link")
            .attr("d", link);


        /*
         Nodes as
         <g class="node">
         <circle class="node-dot" />
         <text />
         </g>
         */
        var nodeGroup = layoutRoot.selectAll("g.node")
            .data(nodes)
            .enter()
            .append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeGroup.append("svg:circle")
            .attr("class", "node-dot")
            .attr("r", options.nodeRadius)
            .on ("click", function (d) {alert (d.wsid)});

        nodeGroup.append("svg:text")
            .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .attr("dx", function(d)
            {
                var gap = 2 * options.nodeRadius;
                return d.children ? -gap : gap;
            })
            .attr("dy", 3)
            .text(function(d) { return d.label; });
    });
}

function getFromList (wsid, list) {
    var tmp = { wsid : wsid, children : [], label: 'X' };
    for (var i = 0; i < list.length; i++)
        if (list[i]['worldStateParentId'] === wsid)
            tmp['children'].push(getFromList(list[i]['worldStateId'], list));
    return tmp;
}

function visit(parent, visitFn, childrenFn) {
    if (!parent) return;
    visitFn(parent);
    var children = childrenFn(parent);
    if (children)
        children.forEach(function(child) { visit(child, visitFn, childrenFn); });
}