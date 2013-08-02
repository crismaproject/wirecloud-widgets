# Wirecloud Widgets

This repository contains (more or less) general purpose widgets that can be used with
[F-I-WARE](http://www.fi-ware.eu/)'s Mashup platform [Wirecloud](http://conwet.fi.upm.es/wirecloud/).
Ideally, every folder here contains a widget that should work on its own and expose its functionality via a set of
JavaScript functions. Primarily, they are intended to be used in the context of Wirecloud, so their usefulness outside
of the Mashup platform could be.. limited.

Also note that these components are currently under **early and active development** — they might or might not work yet.


## Content

* **./chart/** — a simple widget that uses jquery and jqplot to render bar charts.
* **./listener/** — a simple debugging widget that shows incoming events.
* **./ooi_editor/**
* **./ooi_viewer/**
* **./openlayers/** — a map widget using OpenLayers and OpenStreetMap (for now) to display maps with points of interests, polygons, and lines.
* **./tabular/** — a simple table (Bootstrap style).

## Building

There are two ways to "build" these widgets automatically:

* Windows: use `bundle.bat` which should build all widgets. However, this method *requires* 7-zip installed under `C:\Program Files\7-Zip\7z.exe`, *or*
* use `rake all` on systems with Rake installed. It will build any widgets in subdirectories containing a `.bundle` file. It requires [rubyzip](https://github.com/rubyzip/rubyzip) to be installed.
  `rake` can also be used to bundle widgets individually; for instance, to build the `ooi_viewer` widget, use `rake bundle[ooi_viewer]`.

You can also build it manually:

1. Use any compression tool to create ZIP files for each of the widgets you are interested in so that the `config.xml` file is in the root directory of the archive. If you want to, exclude `README.md` files.
2. By convention, you should then change the extension from `.zip` to `.wgt`.

## Contact

Most widgets are currently maintained by Manuel Warum from the Austrian Institute of Technology. If you need assistance,
feel free to drop me a line: manuel *(dot)* warum *(dot)* fl *(at)* ait *(dot)* ac *(dot)* at, or [MrManny](https://github.com/MrManny) on github.
