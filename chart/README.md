# Technical documentation

This section contains implementation details.

## JavaScript API

The following listings detail properties and functions available globally.

### Methods

* showSeries ( data )

## Wirecloud Endpoints

### Input

To do.

### Output

To do.

## Examples

The example below creates a chart container and fills it with sample data. The chart stacks three elements
(g, r, and d in the JSON array named `series` below) on top of each other.

```html
<div id="chart_container"></div>

<script type="text/javascript">
    var series = [
        { g: 7, r: 4, d: 0 },
        { g: 6, r: 5, d: 0 },
        { g: 3, r: 6, d: 2 },
        { g: 2, r: 7, d: 2 },
        { g: 2, r: 6, d: 3 },
        { g: 4, r: 2, d: 5 },
        { g: 5, r: 0, d: 6 }
    ];

    var plotData = [ [], [], [] ];
    for (var i = 0; i < series.length; i++) {
        plotData[0].push([i, series[i].g]);
        plotData[1].push([i, series[i].r]);
        plotData[2].push([i, series[i].d]);
    }

    showSeries(plotData);
</script>
```
