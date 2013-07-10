function showSeries(data) {
    document.plot = $.jqplot('chart_container', plotData, {
        title: 'Performance chart',
        stackSeries: true,
        seriesDefaults: {
            markerOptions: { style: 'circle' },
            renderer:$.jqplot.BarRenderer,
            rendererOptions: { barMargin: 24 },
            pointLabels: { show:true, hideZeros: true }
        },
        series:
            [ { label: 'Healthy' } ,
                { label: 'Critical' } ,
                { label: 'Deceased' } ],
        seriesColors: [ '#90EE90', '#DC143C', '#696969' ],
        axesDefaults: { tickOptions: { mark: 'cross' } },
        axes: {
            xaxis: {
                tickOptions: {
                    showLabel: false,
                    formatString: 'Decision %.0f'
                },
                min: 0
            },
            yaxis: { autoscale: true, min: 0 }
        },
        legend: { show: true, location: 'e' }
    });
}