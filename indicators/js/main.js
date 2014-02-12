window.indicator_uri = 'http://localhost/api';

var n = 0;

function getViewportDim(selector) {
    return {
        w: $(selector).innerWidth(),
        h: $(selector).innerHeight()
    };
}

/**
 * @param containerWidth the total width of the diagram
 * @param containerHeight the total height of the diagram
 * @param {*} data
 * @param {string[]?} colors colors to use
 */
function createChart(containerWidth, containerHeight, data, colors) {
    var $chart = $('#chart');
    if (!$('#chkKeepOld').is(':checked'))
        $chart.empty();

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        barPad = 3,
        width = containerWidth - margin.left - margin.right,
        height = containerHeight - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width],.125);
    var x1 = d3.scale.ordinal();
    var y = d3.scale.linear()
        .range([height, 0]);
    var color = d3.scale.ordinal()
        .range(colors || ['#999999']);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svgClassId = "graph" + (n++);
    var container = $('<div></div>').attr('class', 'graph ' + svgClassId);
    $chart.append(container);

    var svg = d3.select("." + svgClassId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var closeBtn = $('<button></button>')
        .attr('type', 'button')
        .attr('class', 'hidden-print btn btn-danger btn-sm ' + svgClassId)
        .text('Hide chart');
    closeBtn.click(function() {
        $('.' + svgClassId).remove();
    });
    $(container).append(closeBtn);

    var categoryNames = d3.keys(data[0]).filter(function(key) { return key !== 'key'; });

    data.forEach(function(d) {
        d.indicatorValues = categoryNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.key; }));
    x1.domain(categoryNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.indicatorValues, function(d) { return d.value * 1.025; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var group = svg.selectAll(".group")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; });

    group.selectAll("rect")
        .data(function(d) { return d.indicatorValues; })
        .enter().append("rect")
        .attr("width", x1.rangeBand() - barPad*2)
        .attr("x", function(d) { return x1(d.name) + barPad; })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    group.selectAll("text")
        .data(function(d) { return d.indicatorValues; })
        .enter().append("text")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name) + x1.rangeBand() / 2; })
        .attr("y", function(d) { return y(d.value) - 5; })
        .attr("height", 15)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.value; });

    var legend = svg.selectAll(".legend")
        .data(categoryNames.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    // at this point, the chart has been added to the DOM; if it is outside the viewport, attempt to scroll to its position
    $('body,html').animate({scrollTop: container.offset().top});
}

function dataFromScalar(data) {
    return [{key: data.name, value: data.data}];
}

function dataFromHistogram(data) {
    var container = { key: data.name };
    for (var i = 0; i < data.data.length; i++)
        container[data.data[i].key] = data.data[i].value;
    return [container];
}

function colorsFromHistogram(data) {
    return data.data.map(function(x){return x.color});
}

$(function() {
    var viewport = getViewportDim('#chart');
    viewport.w = viewport.w * 0.90;
    viewport.h = viewport.h * 0.95;
    if (viewport.h/3*4 > viewport.w)
        viewport.h = viewport.w/4*3;
    console.log(viewport);

    // the following lines let the "settings" button float around in the top right corner of the widget,
    // even if the viewport changes due to scrolling
    var $floatingActions = $('#controls');
    var offsetTop = parseFloat($floatingActions.css('top').replace(/[^-\d\.]/g, ''));
    $(window).scroll(function () {
        $floatingActions
            .stop()
            .animate({'marginTop': ($(window).scrollTop() + offsetTop) + 'px'});
    });

    $('#loadCharts').click(function() {
        $('#overlay').modal('hide');
        createChart(viewport.w, viewport.h, [
            { key: 14, g: 44, y: 17, r: 35, d: 12 },
            { key: 44, g: 39, y: 34, r: 37, d: 6 },
            { key: 93, g: 41, y: 15, r: 34, d: 19 }
        ], ["#527c36", "#db9b3b", "#9f3c3c", "#595959"]);
    });

    $('#overlay').modal('show');
});