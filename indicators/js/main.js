window.wps = null;
window.ooiwsr = null;

var n = 0;

Array.prototype.firstWhere = function (predicate) {
    var selection = this.filter(predicate);
    return selection.length ? selection[0] : null;
};

/**
 * Returns the viewport's current dimensions.
 * @param {jQuery?} selector the container to measure, defaults to the document's body
 * @return {{w: number, h: number, l: number, t: number}} an object describing the height and width of the specified selector.
 */
function getViewportDim(selector) {
    selector = selector || 'body';
    var offset = $(selector).position();
    return {
        l: offset.left,
        t: offset.top,
        w: $(selector).innerWidth(),
        h: $(selector).innerHeight()
    };
}

/**
 * Creates a new chart from the specified data.
 * @param {number} containerWidth the total width of the diagram (in pixels)
 * @param {number} containerHeight the total height of the diagram (in pixels)
 * @param {*} data
 * @param {string[]?} colors colors to use
 * @param {string?} label
 */
function createChart(containerWidth, containerHeight, data, colors, label) {
    if (containerWidth <= 60) throw 'Container for the chart is too small (width must be greater than 60px)';
    else if (containerHeight <= 50) throw 'Container for the chart is too small (height must be greater than 50px)';

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
    $('#chart').append(container);

    var svg = d3.select("." + svgClassId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var $containerBelowChart = $('<aside></aside>');

    var closeBtn = $('<button></button>')
        .attr('type', 'button')
        .attr('class', 'hidden-print btn btn-danger btn-xs')
        .append($('<span class="glyphicon glyphicon-remove"></span>'));
    closeBtn.click(function() {
        $self = $('.' + svgClassId);
        $self.slideUp({complete: function() {
            $self.remove();
            if (!$('.graph').length) $('#overlay').modal('show');
        }});
    });

    $containerBelowChart.append(closeBtn);
    if (label)
        $containerBelowChart.append($('<span class="graphLabel"></span>').text(label));

    $(container).append($containerBelowChart);

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

/**
 * Wraps a scalar indicator object.
 * @param {*} data
 * @return {*[]}
 */
function dataFromScalar(data) {
    return [{key: data.name, value: data.data}];
}

/**
 * Wraps a histogram indicator object.
 * @param {*} data
 * @return {*[]}
 */
function dataFromHistogram(data) {
    var container = { key: data.name };
    for (var i = 0; i < data.data.length; i++)
        container[data.data[i].key] = data.data[i].value;
    return [container];
}

/**
 * Returns an array of colors to use for the given indicator object.
 * @param {*} data
 * @return {string[]}
 */
function colorsFromHistogram(data) {
    return data.data.map(function(x){return x.color});
}

/**
 * @private
 * @return {{w: number, h: number, l: number, t: number}}
 */
function getInitialChartSize() {
    var viewport = getViewportDim('#chart');
    viewport.w = viewport.w * 0.95 - viewport.l;
    viewport.h = Math.min(viewport.h * 0.95 - viewport.t, 500);
    if (viewport.h / 16 * 9 > viewport.w)
        viewport.h = viewport.w / 4 * 3;
    return viewport;
}

function getIndicatorFromWPS(indicator, worldStateId) {
    if (!window.wps) throw 'WPS not configured!';
    return window.wps.executeProcess(indicator, { WorldStateId: worldStateId })
        .done(function(x) {
            var indicatorDataUrl = x.indicator;
            $.getJSON(indicatorDataUrl)
                .done(function(indicatorData) {
                    indicatorData = JSON.parse(indicatorData.entityPropertyValue);
                    var colors = colorsFromHistogram(indicatorData);
                    var data = dataFromHistogram(indicatorData);
                    var label = 'World state ' + worldStateId + ': ' + x.description;
                    createChart(viewport.w, viewport.h, data, colors, label);
                });
        });
}

function getIndicatorFromWSR(indicator, worldStateId) {
    if (!window.ooiwsr) throw 'OOI-WSR not configured!';
    return window.ooiwsr.fetch('Entity?wsid=' + worldStateId)
        .done(function(x) {
            x = x.firstWhere(function(x) { return x.entityTypeId == 12 });
            if (x) {
                var indicatorData = x.entityInstancesProperties
                    .map(function(x) { return JSON.parse(x.entityPropertyValue); })
                    .firstWhere(function(x) { return x.id == indicator; });
                if (indicatorData) {
                    var colors = colorsFromHistogram(indicatorData);
                    var data = dataFromHistogram(indicatorData);
                    var label = 'World state ' + worldStateId + ': ' + indicatorData.description;
                    createChart(viewport.w, viewport.h, data, colors, label);
                }
            }
        });
}

$(function() {
    // the following lines let the "settings" button float around in the top right corner of the widget,
    // even if the viewport changes due to scrolling
    var $floatingActions = $('#controls');
    var offsetTop = parseFloat($floatingActions.css('top').replace(/[^-\d\.]/g, ''));
    $(window).scroll(function () {
        $floatingActions
            .stop()
            .animate({'marginTop': ($(window).scrollTop() + offsetTop) + 'px'});
    });

    $('select[data-help-text-in]').change(function() {
        var $this = $(this);
        var helpText = $('option:selected', $this).attr('data-help-text');
        $($this.attr('data-help-text-in')).text(helpText || '');
    });

    $('a[data-check-all]').click(function(){
        $('input[type="checkbox"]', $(this).attr('data-check-all')).attr('checked', true);
    });

    $('a[data-check-none]').click(function(){
        $('input[type="checkbox"]', $(this).attr('data-check-all')).attr('checked', false);
    });

    if (!window.wps)
        throw 'WPS not properly set!';
    else if(!window.ooiwsr)
        throw 'OOI-WSR not properly set!';
    else {
        $('#loadingIndicator').modal('show');
        var $scenarios = $('#inputScenario');
        var $indicators = $('#inputIndicator');
        var $worldStates = $('#worldStateList');

        var loadSimulationPromise = window.ooiwsr.listSimulations()
            .done(function (simulations) {
                $scenarios
                    .empty()
                    .append(simulations.map(function(simulation) {
                        return $('<option></option>')
                            .text('Simulation ' + simulation.simulationId + ': ' + simulation.description)
                            .attr('data-help-text', simulation.description + ', starts on ' + simulation.startDateTime)
                            .val(simulation.simulationId);
                    }))
                    .change();
            });

        var loadIndicatorsPromise = window.wps.getProcesses()
            .done(function (processes) {
                $indicators
                    .empty()
                    .append(processes.map(function(process) {
                        return $('<option></option>')
                            .text(process.title)
                            .attr('data-help-text', process.description)
                            .val(process.id);
                    }))
                    .change();
            });

        $scenarios.change(function() {
            var $scenario = $('option:selected', this);
            var simulationId = $scenario.val();
            window.ooiwsr.listWorldStates()
                .done(function(worldStates) {
                    $worldStates
                        .empty()
                        .append(worldStates
                            .filter(function(x) {return x.simulationId == simulationId;})
                            .map(function(x) {
                                return $('<div class="checkbox"></div>')
                                    .append($('<label></label>')
                                        .text('#' + x.worldStateId + ': ' + x.description + ' (' + x.dateTime + ')')
                                        .prepend(
                                            $('<input type="checkbox">').val(x.worldStateId)
                                        )
                                    )
                            })
                        );
                });
        });

        $.when(loadSimulationPromise, loadIndicatorsPromise)
            .done(function(){
                $('#loadingIndicator').modal('hide');
                $('#overlay').modal('show');
            });

        $('#loadCharts').click(function() {
            $('#overlay').modal('hide');
            if (!$('#chkKeepOld').is(':checked'))
                $('#chart').empty();

            window.viewport = getInitialChartSize();
            var indicator = $('option:checked', $indicators).val();

            $('#loadingIndicator').modal('show');

            var promises = $('input[type="checkbox"]:checked', $worldStates)
                .map(function (i, x) {
                    var wsid = parseInt($(x).val());
                    return getIndicatorFromWSR(indicator, wsid);
                });

            $.when(promises.get()).done(function() { $('#loadingIndicator').modal('hide'); });
        });
    }
});