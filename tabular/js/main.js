function setHeaders(elements) {
    $('#table_header').empty();
    if (elements) {
        var headerRow = $('<tr></tr>');
        for(var i = 0; i < elements.length; i++)
            headerRow.append($('<th></th>').text(elements[i]));
        $('#table_header').append(headerRow);
    }
}

function setData(rows) {
    $('#table_data').empty();
    if (rows)
        for(var i = 0; i < rows.length; i++) {
            var dataRow = $('<tr></tr>');
            for(var j = 0; j < rows[i].length; j++)
                dataRow.append($('<td></td>').text(rows[i][j]));
            dataRow.click(function(){console.log('Selected ' + rows[i][0])});
            $('#table_data').append(dataRow);
        }
}

function setCaption(caption) {
    $('#table_container caption').remove();
    if (caption)
        $('#table_container').prepend($('<caption></caption>').text(caption));
}

function setTable(caption, headers, rows) {
    setHeaders(headers);
    setData(rows);
    setCaption(caption);
}