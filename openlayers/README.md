# Technical documentation

This section contains implementation details.

## JavaScript API

The following listings detail properties and functions available through instances of `OpenLayersFacade` objects.

### Constructor

`OpenLayersFacade(container, initLat, initLong, initZ)`

* _container_ denotes the ID of the HTML DOM element that will be initialized as a map view through OpenLayers. This is
  **not** a CSS selector; provide the DOM element's ID here.
* _initLat_ denotes the initial latitude to display as the map view's center. (optional)
* _initLong_ denotes the initial longitude to display as the map view's center. (optional)
* _initZ_ denotes the initial zoom level to display. (optional)

### Properties

* .elements : Object[]
* .map      : OpenLayers.Map

### Methods

* .add( )
* .addLine( )
* .addPoly( )
* .move( )
* .remove( )
* .view( )
* .viewAll( )

## Wirecloud Endpoints

API doc

## Examples

The example below creates a map view, adds a few points of interests and re-focuses the map so that all POIs are
visible:

```
<div id="map"></div>
<script type="text/javascript">
    var facade = new OpenLayersFacade('map');
    facade.add('fire1', 31.790287, 34.641389, 'img/fire.png');
    facade.add('fire2', 31.7917278, 34.6442866, 'img/fire.png');
    facade.add('amb1', 31.8033814, 34.643149, 'img/ambulance.png');
    facade.add('p1', 31.790289, 34.642379, 'img/person.png');

    facade.viewAll();
</script>
```