# Wirecloud Widgets

This repository contains (more or less) general purpose widgets that can be used with
[FI-WARE](http://www.fi-ware.eu/)'s Mashup platform [Wirecloud](http://conwet.fi.upm.es/wirecloud/).
Ideally, every folder here contains a widget that should work on its own and expose its functionality via a set of
JavaScript functions. Primarily, they are intended to be used in the context of Wirecloud, so their usefulness outside
of the Mashup platform could be limited.

You can find a working and up-to-date Wirecloud testbed here, courtesy of FI-Ware: [mashup.lab.fi-ware.eu](https://mashup.lab.fi-ware.eu).

Also note that these components are currently under **early and active development** — they might or might not work yet.


## Content

* **./chart/** — a simple widget that uses jquery and jqplot to render bar charts.
* **./listener/** — a simple debugging widget that shows incoming events.
* **./ooi_editor/**
* **./ooi_viewer/**
* **./openlayers/** — a map widget using OpenLayers and OpenStreetMap (for now) to display maps with points of interests, polygons, and lines.
* **./tabular/** — a simple table (Bootstrap style).

**Documentation** for endpoints can be found in each of the widgets' respective subdirectory, in a file aptly
named `ENDPOINTS.md`. These files are automatically generated from Wirecloud metadata in each `config.xml`.
To (re-)generate these files on your own, you can use the `rake doc` rake task.

## Building

There are two ways to build these widgets automatically:

* **If you have ruby/rake:** use `rake all`. It will build any widgets in subdirectories containing a `.bundle` file. It requires [rubyzip](https://github.com/rubyzip/rubyzip) to be installed (`gem install rubyzip`).
There are also rake tasks to bundle widgets individually; for instance, to build the *ooi_viewer* widget, use `rake bundle[ooi_viewer]`.
* **Build it manually:** use any compression tool to create ZIP files for each of the widgets you are interested in so that the *config.xml* file is in the root directory of the archive. If you want to, exclude Markdown files.
By convention, you should then change the extension from `.zip` to `.wgt`.

If you want to contribute other ways of building/bundling widgets (or documentation), feel free to do so and send me a push request.

## Branches

* **master** — not exactly stable yet, but not as bleeding edge as *v0.5* :)
* **v0.5** — this is some sort of staging area for the *next* version and most commits are likely to not work completely.

## Contact

Most widgets are currently maintained by Manuel Warum from the Austrian Institute of Technology. If you need assistance,
feel free to drop me a line: manuel *(dot)* warum *(dot)* fl *(at)* ait *(dot)* ac *(dot)* at, or [MrManny](https://github.com/MrManny) on github.
