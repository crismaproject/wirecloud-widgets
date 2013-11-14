var api = null;
/** @const */
var treeStyle = {
    colors: {
        path: '#E6677A',
        leaf: '#E9E9E9',
        nonLeaf: '#F2919D',
        edge: '#aaaaaa'
    },
    sizes: {
        nodeWidth: 108,
        levelDistance: 54
    }
};

function createWorldStateTree(containerName, simulation) {
    if (!api) throw 'RESTful service not configured yet.';

    api.listWorldStates()
        .done(function (worldStates) {
            var jitData = toJit(worldStates, simulation);
            var st = new $jit.ST({
                //id of viz container element
                injectInto: containerName,
                orientation: 'top',
                levelsToShow: 5,
                //set animation transition type
                transition: $jit.Trans.Quart.easeInOut,
                //set distance between node and its children
                levelDistance: treeStyle.sizes.levelDistance,
                //enable panning
                Navigation: {
                    enable:true,
                    panning:true
                },
                //set node and edge styles
                //set overridable=true for styling individual
                //nodes or edges
                Node: {
                    height: 20,
                    width: treeStyle.sizes.nodeWidth,
                    type: 'rectangle',
                    color: treeStyle.colors.leaf,
                    overridable: true
                },

                Edge: {
                    type: 'bezier',
                    color: treeStyle.colors.edge,
                    overridable: true
                },

                //This method is called right before plotting
                //a node. It's useful for changing an individual node
                //style properties before plotting it.
                //The data properties prefixed with a dollar
                //sign will override the global node style properties.
                onBeforePlotNode: function(node){
                    //add some color to the nodes in the path between the
                    //root node and the selected node.
                    if (node.selected) {
                        node.data.$color = treeStyle.colors.path;
                    }
                    else {
                        delete node.data.$color;
                        //if the node belongs to the last plotted level
                        if(!node.anySubnode("exist")) {
                            //count children number
                            var count = 0;
                            node.eachSubnode(function () { count++; });
                            if (count) node.data.$color = treeStyle.colors.nonLeaf;
                        }
                    }
                },

                //This method is called on DOM label creation.
                //Use this method to add event handlers and styles to
                //your node.
                onCreateLabel: function(label, node){
                    label.id = node.id;
                    label.innerHTML = node.name;
                    label.onclick = function(){ st.onClick(node.id); };

                    var style = label.style;
                    style.width = treeStyle.sizes.nodeWidth + 'px';
                    style.height = 17 + 'px';
                    style.color = '#000000';
                    style.textAlign = 'center';
                }
            });
            //load json data
            st.loadJSON(jitData);
            //compute node positions and layout
            st.compute();
            //emulate a click on the root node.
            st.onClick(st.root);
        });
}

function toJit(worldStates, simulation) {
    var simulationId = simulation.simulationId;
    worldStates = worldStates
        .filter(function (x) { return x.simulationId == simulationId; })
        .map(function (x) { return $.extend({children: []}, x); });
    var worldStatesLookup = linkWorldStates(worldStates);

    return {
        id: 's' + simulationId,
        name: 'Simulation ' + simulationId,
        //data: simulation,
        children: worldStates
            .filter(function (x) { return x.worldStateParentId === null; })
            .map(function (x) { return toJitNode(worldStatesLookup, x.worldStateId) })
    };
}

function toJitNode(worldStatesLookup, nodeId) {
    var node = worldStatesLookup[nodeId];
    return {
        id: 'w' + nodeId,
        name: 'WorldState ' + nodeId,
        //data: node,
        children: node.children.map(function (childId) { return toJitNode(worldStatesLookup, childId); })
    };
}

function linkWorldStates(worldStates) {
    var worldStatesDict = worldStates.toDict('worldStateId', function (worldState) {
        return $.extend({children: []}, worldState);
    });
    for (var i = 0; i < worldStates.length; i++) {
        var worldState = worldStates[i];
        if (!worldState.worldStateParentId) continue;
        var parent = worldStatesDict[worldState.worldStateParentId];
        parent.children.push(worldState.worldStateId);
    }
    return worldStatesDict;
}

console.logTree = function (jitTreeNode) {
    function log(node, prefix) {
        var str = prefix + node.id + '\n';
        for (var i = 0; i < node.children.length; i++)
            str += log(node.children[i], prefix + node.id +  '/');
        return str;
    }
    console.log(log(jitTreeNode, ''));
};

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is the first
 * element of the original array sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.toDict = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = obj;
    }

    return groups;
};