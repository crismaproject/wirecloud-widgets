var types = { };

function createTableFor(entries) {
    var parent = $('<div></div>').addClass('grp');
    for (var i = 0; i < entries.length; i++)
        parent.append($('<div></div>')
            .addClass('row')
            .append($('<div></div>')
                .addClass('col-md-3')
                .text(entries[i].key))
            .append($('<div></div>')
                .addClass('col-md-9')
                .text(entries[i].value)));
    return parent;
}

function addEntries(entries) {
    $('#container').append(createTableFor(entries));
}