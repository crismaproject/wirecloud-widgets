/*global MashupPlatform*/
var entities = [ ];
var selected = [ ];

function propagateSelection() {
    MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
}

function propagateEntities() {
    MashupPlatform.wiring.pushEvent('oois_out', JSON.stringify(entities));
}

MashupPlatform.wiring.registerCallback('oois_in', function (data) {
    var newSelected = [ ];
    entities = JSON.parse(data);
    propagateEntities();

    // go through all entities and double-check if they exist in the array of current selection
    for (var i = 0; i < entities.length; i++)
        if (selected.indexOf(entities[i]) >= 0)
            newSelected.push(entities[i]);

    // iff the selection has been updated (because entities no longer exist that were formerly present and selected),
    // propagate the new selection; otherwise we can safely skip this part since nothing changed.
    if (newSelected.length != selected.length) {
        selected = newSelected;
        propagateSelection();
    }
});

MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
    selected = JSON.parse(data);
    propagateSelection();
});