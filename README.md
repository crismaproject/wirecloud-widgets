# Wirecloud Widgets

This repository contains (more or less) general purpose widgets that can be used with
[FI-Ware](http://www.fi-ware.eu/)'s Mashup platform [Wirecloud](http://conwet.fi.upm.es/wirecloud/).
Ideally, every folder here contains a widget that should work on its own and expose its functionality via a set of
JavaScript functions. Primarily, they are intended to be used in the context of Wirecloud, so their usefulness outside
of the Mashup platform could be limited.

You can find a working and up-to-date Wirecloud testbed here, courtesy of [FI-Ware](http://www.fi-ware.org/):
[mashup.lab.fi-ware.org](https://mashup.lab.fi-ware.org).

Also note that these components are currently under **early and active development** — they might or might not work
yet.

## Content

In the following sections, each listed item is either prefixed with `(o)` or `(w)`. This indicates if a gadget is either
an **o**perator or a **w**idget.

### Primary widgets and operators

* (w) **./indicators/** — this widget displays indicators from the OOI-WSR.
* (w) **./ooi_command/** — widget to issue commands to OOIs.
* (w) **./ooi_gis_map/** — a map widget using [OpenLayers](http://www.openlayers.org/) and
      [OpenStreetMap](http://www.openstreetmap.org/) to display geospatial data.
* (w) **./ooi_info/** — OOI properties viewer.
* (w) **./ooi_summary/** — application specific summary of resource states.
* (w) **./ooi_table/** — OOI table (with synchronized OOI selection mechanic).
* (o) **./tabswitch/** — Operator to programmatically switch to a predefined tab.
* (o) **./url_params/** — a component that extracts URL query parameters.
* (w) **./worldstate_info/** — Widget that displays some basic metadata about the current simulation/world state.
* (w) **./worldstate_picker/** — Widget that allows the user to pick a world state from the ICMM/OOI-WSR.
* (w) **./worldstate_saver/** — Widget that saves a world state to an OOI-WSR instance.

### Development-only widgets and operators

The following gadgets are only used for development and debugging purposes and serve no practical use in a
production environment.

* (w) **./debug_hide_ui/** — a simple debugging widget that hides most of the UI elements not belonging to the
      actual mashup application.
* (w) **./debug_listener/** — a simple debugging widget that shows incoming events.
* (w) **./debug_pusher/** — a simple debugging widget that pushes arbitrary data to endpoints.

### Misc.

* (w) **./empty/** — contains an absolutely empty widget that can be used as a starting template.
* (o) **./merger/** — a simple operator that merges two JSON arrays into one (useful for combining data sources);
      no longer used or updated for the time being.
* (o) **./pubsub_receiver/** — a operator connecting to pubsub endpoints using NGSI. (Still under heavy development
      and very limited in its usefulness right now.)
* (w) **./static_note/** — displays a preconfigured message (useful for upcoming maintenance notifications).

### Documentations

Documentation for endpoints can be found in each of the widgets' respective subdirectory, in a file aptly
named `ENDPOINTS.md`. These files are automatically generated from Wirecloud metadata in each `config.xml`.
To (re-)generate these files on your own, you can use the `rake doc` rake task.

## Building

There are two ways to build these widgets:

* **If you have ruby/rake:** use `rake all`. It will build any widgets in subdirectories containing a `.bundle` file.
    There are also rake tasks to bundle widgets individually; for instance, to build the *ooi_gis_map* directory, use
    `rake bundle[ooi_gis_map]`. For this to work, you need to have the following gems installed (`gem install …`):
    `rubyzip`, `nokogiri`, `mechanize`, `rest_client`, and `json`.

* **Build it manually:** use any compression tool to create ZIP files for each of the widgets you are interested in so
    that the *config.xml* file is in the root directory of the archive. If you want to, exclude Markdown files.
    By convention, it is advisable to change the archive's extension from `.zip` to `.wgt`.

    If you want to contribute other ways of building/bundling widgets (or documentation), feel free to do so and send me
    a push request.

## Branches

* **master** — latest recommended version (currently pointing at more reliable versions of v0.7)
* **v0.5** and **v0.6** — currently somewhat stable versions; receive maintenance updates where applicable.
* **v0.7** — this is some sort of staging area for the *next* version and does not necessarily have production-grade 
              reliability.

## Rake tasks

If you happen to have Ruby/Rake installed, you can automate a lot of actions. Here's a handy list of tasks defined
in the Rakefile, in order of importance/usefulness:

* **bundle[*this*]**: packs subfolder `this` into a ready-to-upload Wirecloud widget file as `this.wgt`
    (basically it ZIPs the entire folder sans Markdown files).
* **all**: Performs the **bundle** task for each subfolder. It also runs **cleanup** before that.
* **cleanup**: Deletes any files that look like they were automatically generated by **bundle** or **doc** (so,
    basically all `.wgt` files in the root folder as well as `documentation.htm` files in subfolders (non-recursive)).
* **deploy[*username*, *password*, *instance*]**: deploys all currently built `.wgt` files to a remote instance.
    Example: `deploy[JohnDoe,MyPassword,wirecloud.ait.ac.at`]
* **doc**: Automagically creates human-readable mini-documentation for each widget and operator using the gadgets'
    `config.xml` file using one of the XSLT stylesheets (widget.xslt, widget-rdf.xslt).
* **update**: Updates all `wsrapi.js` files in subfolders (see section WSR-API).

Note that the Rakefile requires `rubyzip`, `nokogiri` and `mechanize` for some operations. These two gems should be
present, or your Rakefile might not work at all.

## WSR-API

Versions 0.6 and upwards are beginning to incorporate a shared World State Repository API (WSR-API). Its implementation
allows for streamlined handling of RESTful operations with the external World State Repository, including (but not
limited to) CRUD operations of entities, world states, simulation data, etc. To use it, one only needs to load
`wsrapi.js` and create a new instance of the `WorldStateRepository` JavaScript class. Note that this API implementation
relies on jQuery for XHR operations and deferred functionalities; it is necessary to load [jQuery](jquery.com) first.

A full list of operations is provided in `wsrapi-documentation.htm`. This file automatically inspects `wsrapi.js` and
lists all instance methods discovered through reflection of the class.

There are plans to create an [angular](https://angularjs.org/) service for this in the near future; in the meantime it
should suffice to register an instance of the class with angular.

**Important:**
If a widget or operator uses the WSR-API, it should exist as *your_widget_name/js/wsrapi.js*. This has the benefit that
whenever *wsrapi.js* in the root directory changes, a rake task will automatically update all
*your_widget_name/js/wsrapi.js* file instances it can find by replacing it with the one in the root directory. Note that
if you have done *any* changes to your gadget's file, it *will* be overwritten without hestitation by rake.

## Contact

Most widgets are currently maintained by Manuel Warum from the Austrian Institute of Technology (AIT). If you need
assistance, feel free to drop me a line: manuel *(dot)* warum *(dot)* fl *(at)* ait *(dot)* ac *(dot)* at, or
[MrManny](https://github.com/MrManny) on github.
