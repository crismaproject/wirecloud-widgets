var api = null;
var layout = { };
/** @const */
treeCfg = {
    colors: {
        path: '#E6677A',
        leaf: '#E9E9E9',
        nonLeaf: '#F2919D',
        edge: '#aaaaaa'
    },
    orientation: 'top',
    sizes: {
        nodeWidth: 64,
        levelDistance: 52
    },
    data: [ 'simulationId', 'worldStateId', 'dateTime', 'description' ]
};

var setLayout = function ($container, st) {
    layout.w = $container.width();
    layout.h = $container.height();
    layout.tree = st;
    layout.container = $container;
};
/**
 * Creates the visual tree representation of worldstates associated with the specified simulation.
 * @param {string} containerName the DOM identifier of the container that will host the tree.
 * @param {object} simulation the simulation object.
 */
function createWorldStateTree(containerName, simulation) {
    if (!api) throw 'RESTful service not configured yet.';
    var $notification = $('#loadingNotification');
    $notification.modal('show');

    api.listWorldStates()
        .done(function (worldStates) {
            var $container = $('#' + containerName);
            $container.empty();

            var jitData = toJit(worldStates, simulation);
            var st = new $jit.ST({
                //id of viz container element
                injectInto: containerName,
                orientation: treeCfg.orientation,
                levelsToShow: 10,
                //set animation transition type
                transition: $jit.Trans.Quart.easeInOut,
                //set distance between node and its children
                levelDistance: treeCfg.sizes.levelDistance,
                //enable panning
                Navigation: {
                    enable: true,
                    panning: true
                },
                //set node and edge styles
                //set overridable=true for styling individual
                //nodes or edges
                Node: {
                    height: 20,
                    width: treeCfg.sizes.nodeWidth,
                    type: 'rectangle',
                    color: treeCfg.colors.leaf,
                    overridable: true
                },

                Edge: {
                    type: 'bezier',
                    color: treeCfg.colors.edge,
                    overridable: true
                },

                //This method is called right before plotting
                //a node. It's useful for changing an individual node
                //style properties before plotting it.
                //The data properties prefixed with a dollar
                //sign will override the global node style properties.
                onBeforePlotNode: function (node) {
                    //add some color to the nodes in the path between the
                    //root node and the selected node.
                    if (node.selected) {
                        node.data.$color = treeCfg.colors.path;
                    }
                    else {
                        delete node.data.$color;
                        //if the node belongs to the last plotted level
                        if (!node.anySubnode("exist")) {
                            //count children number
                            var count = 0;
                            node.eachSubnode(function () {
                                count++;
                            });
                            if (count) node.data.$color = treeCfg.colors.nonLeaf;
                        }
                    }
                },

                //This method is called on DOM label creation.
                //Use this method to add event handlers and styles to
                //your node.
                onCreateLabel: function (label, node) {
                    label.id = node.id;
                    label.innerHTML = node.name;
                    label.onclick = function(){
                        st.onClick(node.id);

                        var propagateData = { };
                        for (var i = 0; i < treeCfg.data.length; i++) {
                            var key = treeCfg.data[i];
                            if (node.data.hasOwnProperty(key))
                                propagateData[key] = node.data[key];
                        }

                        $container.trigger('nodeSelected', propagateData);
                    };

                    var style = label.style;
                    style.width = treeCfg.sizes.nodeWidth + 'px';
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

            setLayout($container, st);
        })
        .always(function () {
            $notification.modal('hide');
        });
}

/**
 * @param {Array} worldStates an array of (possibly unassociated) WorldStates.
 * @param {Object} simulation the simulation for which to generate the tree.
 * @returns {{id: string, name: string, data: *, children: Array}}
 */
function toJit(worldStates, simulation) {
    var simulationId = simulation.simulationId;
    worldStates = worldStates
        .filter(function (x) { return x.simulationId == simulationId; })
        .map(function (x) { return $.extend({children: []}, x); });
    var worldStatesLookup = linkWorldStates(worldStates);

    return {
        id: 's' + simulationId,
        name: 'Sim. ' + simulationId,
        data: simulation,
        children: worldStates
            .filter(function (x) { return x.worldStateParentId === null; })
            .map(function (x) { return toJitNode(worldStatesLookup, x.worldStateId) })
    };
}
/**
 * Creates a JIT-compatible JSON object for the specified WorldState.
 * Note that this function is recursive. It will also create these objects for any declared children.
 * @param {Object} worldStatesLookup the WorldState dictionary as created by linkWorldStates
 * @param {number} nodeId the unique identifier of the WorldState for which to generate the JSON object
 * @returns {{id: string, name: string, data: *, children: Array}}
 */
function toJitNode(worldStatesLookup, nodeId) {
    var node = worldStatesLookup[nodeId];
    return {
        id: 'w' + nodeId,
        name: 'Ws. ' + nodeId,
        data: node,
        children: node.children.map(function (childId) { return toJitNode(worldStatesLookup, childId); })
    };
}

/**
 * This method creates a dictionary-version of an WorldState array where each key corresponds to the
 * WorldState's own identifier. In addition, it creates and populates a 'children' property for each WorldState
 * that contains identifiers to any other WorldState that declares it as its parent.
 *
 * Note that this method will raise silent warnings in your JavaScript console if any inconsistencies were found
 * while processing the specified array of world states.
 *
 * @param {Array} worldStates
 * @returns {Object}
 */
function linkWorldStates(worldStates) {
    var worldStatesDict = worldStates.toDict('worldStateId', function (worldState) {
        return $.extend({children: []}, worldState);
    });
    for (var i = 0; i < worldStates.length; i++) {
        var worldState = worldStates[i];
        if (!worldState.worldStateParentId) continue;
        var parent = worldStatesDict[worldState.worldStateParentId];
        if (!parent)
            console.warn('World state ' + worldState.worldStateParentId + ' was not found, but it is apparently a parent of world state ' + worldState.worldStateId);
        else
            parent.children.push(worldState.worldStateId);
    }
    return worldStatesDict;
}

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is the first
 * element of the original array sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.toDict = function (keyProperty) {
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

$(function () {
    var $worldstate = $('#worldstate-info');
    $worldstate.hide();

    $('#worldstate-tree').on('nodeSelected', function (event, selection) {
        if (!selection.hasOwnProperty('worldStateId')) return;
        $worldstate.show();
        $worldstate.find('.title').text('World State ' + selection.worldStateId);
        $worldstate.find('.dateTime').text(selection.dateTime);
    });

    $(window).resize(function () {
        if (layout && layout.tree && (layout.container.width() != layout.w || layout.container.height() != layout.h)) {
            var dx = layout.container.width() - layout.w;
            var dy = layout.container.height() - layout.h;
            layout.tree.canvas.translate(dx/2, dy/2);
            setLayout(layout.container, layout.tree);
        }
    });
});