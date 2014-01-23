window.indicator_uri = 'http://localhost/api';

/**
 * Creates a new series object using the specified container.
 *
 * @param {string} title the diagram's title.
 * @param {string} container the id of the DOM element that will contain the chart in question.
 * @constructor
 */
function Series(title, container) {
    /**
     * id of the DOM element that will contain the chart. Note that all subordinate nodes will be overwritten when
     * the redraw method is invoked. This value is normally set by the constructor.
     * @private
     * @type {string}
     */
    this.container = container;

    /**
     * An array of chart labels, one for every data point. This value is normally set by setLabels(..)
     * @private
     * @type {Array}
     */
    this.labels = [ ];

    /**
     * An array of hex-encoded RGB values that denote the color of each chart bar. Colors should be in the same
     * color as the labels. This value is normally set by setLabels(..)
     * @private
     * @type {Array}
     */
    this.colors = [ ];

    /**
     * @private
     * @type {Array}
     */
    this.data = [ ];

    /**
     * Sets the title of the chart displayed on top of it. This is normally set by setLabel(..)
     * @private
     * @type {string}
     */
    this.title = title;

    /**
     * Sets whether the chart uses stacked bars or not.
     * @default true
     * @type {boolean}
     */
    this.isStacked = true;

    /**
     * Sets whether a legend is displayed next to the chart.
     * @default true
     * @type {boolean}
     */
    this.showLegend = true;

    var resizeBeingHandled = false;
    $(window).resize(this, function (event) {
        if (resizeBeingHandled) return;
        resizeBeingHandled = true;
        window.setTimeout(function () {
            resizeBeingHandled = false;
            event.data.redraw();
        }, 500);
    });
}

/**
 * Redraws the diagram.
 */
Series.prototype.redraw = function () {
    $('#' + this.container).empty();
    if (!this.data || this.data.length == 0)
        return;

    var seriesLabels = [ ];
    for (var i = 0; i < this.labels.length; i++)
        seriesLabels[i] = { label: this.labels[i] };

    document.plot = $.jqplot(this.container, this.data, {
        title: this.title,
        stackSeries: this.isStacked,
        seriesDefaults: {
            markerOptions: { style: 'circle' },
            renderer: $.jqplot.BarRenderer,
            rendererOptions: { barMargin: 24 },
            pointLabels: { show: this.labels.length != 0, hideZeros: true }
        },
        series: seriesLabels,
        seriesColors: this.colors,
        axesDefaults: { tickOptions: { mark: 'cross' } },
        axes: {
            xaxis: {
                tickOptions: {
                    showLabel: false
                },
                min: 0
            },
            yaxis: { autoscale: true, min: 0 }
        },
        legend: { show: this.showLegend, location: 'e' }
    });
};

/**
 * Labels each series using the specified labels and colors.
 * Changing this value will require to redraw the table.
 *
 * @param {Array} labels an array of strings containing labels.
 * @param {Array?} colors an array of colors in RGB hex format (including the initial #) for each of the labels.
 * Iff this is null, a default set of six colors will be assumed.
 */
Series.prototype.setLabels = function (labels, colors) {
    colors = colors || [ '#aa3333', '#33aa33', '#3333aa', '#33aaaa', '#aa33aa', '#aaaa33' ];
    if (this.labels.length > this.colors.length)
        console.warn('Please provide at least as many colors as there are labels.');
    this.labels = labels;
    this.colors = colors;
};

/**
 * A two-dimensional array where each element in the outer array depicts a series on the X axis,
 * and each element in inner arrays corresponds to one bar in the series. Note that the length of inner
 * arrays must always be the same.
 *
 * When bars are stacked, each of the inner elements will be stacked on top of each other; otherwise
 * they will be shown side by side, in the order they occur in the array.
 * Changing this value will require to redraw the table.
 *
 * @param {Array} data a two-dimensional array containing series data.
 * @example
 * series.setData( [ [1, 2], [3, 4], [5, 6] ] )
 */
Series.prototype.setData = function (data) {
    this.data = data;
};

/**
 * Sets the title that's displayed on top of the diagram.
 * Changing this value will require to redraw the table.
 *
 * @param {string} title the title of the diagram (that will be displayed on top of the chart area).
 * @see redraw
 */
Series.prototype.setTitle = function (title) {
    this.title = title;
};

/**
 * Loads the specified world state from the WPS that manages chart series data. This data will then be rendered in the
 * specified UI container.
 * @param {Series} series
 * @param {int} worldStateId
 */
function loadWorldState(series, worldStateId) {
    // First, we ask the WPS for the URL to the indicator data:
    $.get(window.indicator_uri + '/pywps.cgi?service=WPS&request=Execute&version=1.0.0&identifier=lifeIndicator&datainputs=WorldStateId=' + worldStateId, function (response) {
        var uriForWorldstate = $('Output', response).find('LiteralData').text(); // should contain an URL
        if (!uriForWorldstate)
            console.log('Did not receive a proper URL pointing at the indicator data!');
        else
            $.get(uriForWorldstate, function (response) {
                // Secondly, we load the indicator data and prepare the chart series for rendering
                var indicatorData = $.extend({ green: 0, yellow: 0, red: 0, dead: 0 }, JSON.parse(response.entityPropertyValue));

                series.setData([[indicatorData.green], [indicatorData.yellow], [indicatorData.red], [indicatorData.dead]]);
                series.isStacked = false;
                series.setLabels(['Healthy', 'Injured', 'Critical', 'Dead'], [ '#90EE90', '#F0C07D', '#DC143C', '#696969' ]);
                series.redraw();
            });
    });
}