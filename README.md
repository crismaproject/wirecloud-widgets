# Wirecloud Widgets

This repository contains (more or less) general purpose widgets that can be used with
[FI-Ware](http://www.fi-ware.eu/)'s Mashup platform [Wirecloud](http://conwet.fi.upm.es/wirecloud/).
Ideally, every folder here contains a widget that should work on its own and expose its functionality via a set of
JavaScript functions. Primarily, they are intended to be used in the context of Wirecloud, so their usefulness outside
of the Mashup platform could be limited.

You can find a working and up-to-date Wirecloud testbed here, courtesy of FI-Ware: [mashup.lab.fi-ware.eu](https://mashup.lab.fi-ware.eu).

Also note that these components are currently under **early and active development** — they might or might not work yet.


## Content

In the following sections, each listed item is either prefixed with `(o)` or `(w)`. This indicates if a gadget is either
an **o**perator or a **w**idget.

### Primary widgets and operators

* (w) **./chart/** — a simple widget that uses jquery and jqplot to render bar charts.
* (w) **./merger/** — a simple operator that merges two JSON arrays into one.
* (w) **./ooi_command/** — widget to issue commands to OOIs.
* (w) **./ooi_gis_map/** — a map widget using OpenLayers and OpenStreetMap to display a map with WFS data
* (w) **./ooi_table/** — OOI table (with synchronized OOI selection mechanic).
* (w) **./simulation_picker/** — displays and picks available simulations from the OOI-WSR.
* (o) **./worldstate_loader/** — Operator that loads a worldstate from an OOI-WSR instance.
* (w) **./worldstate_saver/** — Widget that saves a worldstate to an OOI-WSR instance.

### Development-only widgets and operators

The following gadgets are only used for development and debugging purposes and serve no practical use in a
production environment.

* (w) **./debug_listener/** — a simple debugging widget that shows incoming events.
* (w) **./debug_pusher/** — a simple debugging widget that pushes arbitrary data to endpoints.

### Documentations

**Documentation** for endpoints can be found in each of the widgets' respective subdirectory, in a file aptly
named `ENDPOINTS.md`. These files are automatically generated from Wirecloud metadata in each `config.xml`.
To (re-)generate these files on your own, you can use the `rake doc` rake task.

## Building

There are two ways to build these widgets:

* **If you have ruby/rake:** use `rake all`. It will build any widgets in subdirectories containing a `.bundle` file. It requires [rubyzip](https://github.com/rubyzip/rubyzip) to be installed (`gem install rubyzip`).
There are also rake tasks to bundle widgets individually; for instance, to build the *openlayers* directory, use `rake bundle[openlayers]`.
* **Build it manually:** use any compression tool to create ZIP files for each of the widgets you are interested in so that the *config.xml* file is in the root directory of the archive. If you want to, exclude Markdown files.
By convention, you should then change the extension from `.zip` to `.wgt`.

If you want to contribute other ways of building/bundling widgets (or documentation), feel free to do so and send me a push request.

## Branches

* **master** — not exactly stable yet, but not as bleeding edge as *v0.5* :)
* **v0.5** — this is some sort of staging area for the *next* version and most commits are likely to not work completely.

## Contact

Most widgets are currently maintained by Manuel Warum from the Austrian Institute of Technology (AIT). If you need assistance,
feel free to drop me a line: manuel *(dot)* warum *(dot)* fl *(at)* ait *(dot)* ac *(dot)* at, or [MrManny](https://github.com/MrManny) on github.
