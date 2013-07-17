# Wirecloud Widgets

This repository contains (more or less) general purpose widgets that can be used with
[F-I-WARE](http://www.fi-ware.eu/)'s Mashup platform [Wirecloud](http://conwet.fi.upm.es/wirecloud/).
Ideally, every folder here contains a widget that should work on its own and expose its functionality via a set of
JavaScript functions. Primarily, they are intended to be used in the context of Wirecloud, so their usefulness outside
of the Mashup platform could be.. limited.

Also note that these components are currently under **early and active development** - they might or might not work yet.


## Content

* **./chart/** - a simple widget that uses jquery and jqplot to render bar charts.
* **./openlayers/** - a map widget using OpenLayers and OpenStreetMap (for now) to display maps with points of
    interests, polygons, and lines.
* **./tabular/** - a simple table (Bootstrap style).


## Contact

Most widgets are currently maintained by Manuel Warum from the Austrian Institute of Technology. If you need assistance,
feel free to drop me a line: manuel *(dot)* warum *(dot)* fl *(at)* ait *(dot)* ac *(dot)* at, or [MrManny](https://github.com/MrManny) on github.
