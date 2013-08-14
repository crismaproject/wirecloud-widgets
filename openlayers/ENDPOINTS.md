# Notice

This document has been generated automatically on 2013-08-14 14:05:32 +0200. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.

# Overview

**Declared inputs:** add_line, add_point, add_poly, clear, view_point

**Declared outputs:** added_line, added_point, added_poly, center_point, ooi_click, pos_click

# Input endpoints

## Add line

**Internal name:** `add_line`

**Friendcode:** `geo-points`

**Description:** Adds a line to the map

This endpoint allows the creation of line segments by providing an array of tuples containing latitude-longitude coordinate pairs.

## Add point

**Internal name:** `add_point`

**Friendcode:** `geo-ooi`

**Description:** Adds a point to the map

This is an endpoint that accepts a JSON-encoded object with latitude and longitude coordinate data and a unique identifier. The object will be added to the map view. If the recenter preference is set to true, the map will then pan to the newly added object.

## Add polygon

**Internal name:** `add_poly`

**Friendcode:** `geo-points`

**Description:** Adds a polygon to the map

This endpoint allows the creation of polygons (without holes). It accepts an array of tuples containing latitude-longitude coordinate pairs that will form the outline of the polygon.

## Clear

**Internal name:** `clear`

**Friendcode:** `signal`

**Description:** Removes all features from the map (points and polygons)

This endpoint does not require any data. When any signal is received on this endpoint, all contents will be removed from the map unconditionally.

## Coordinates

**Internal name:** `view_point`

**Friendcode:** `geo-lon-lat`

**Description:** Focuses the map on specified coordinates

This is an endpoint that accepts a JSON-encoded object with latitude and longitude coordinate data. When coordinates are received (WGS 1984 projection), the map will pan to the location represented by it.

# Output endpoints

## Added line

**Internal name:** `added_line`

**Friendcode:** `geo-points`

**Description:** Whenever a (poly-)line is added via the map viewer, this event dispatches its geometry

Whenever a (poly-)line is added via the map viewer, this event dispatches a JSON-encoded object consisting of latitude-longitude coordinates -- ie. latitude-longitude tuples -- this (poly-)line is composed of.

## Added point

**Internal name:** `added_point`

**Friendcode:** `geo-lon-lat`

**Description:** Whenever a point is added via the map viewer, this event dispatches its coordinates

This endpoint dispatches latitude-longitude coordinates whenever a point is added to the map.

## Added polygon

**Internal name:** `added_poly`

**Friendcode:** `geo-points`

**Description:** Whenever a polygon is added via the map viewer, this event dispatches its geometry

Whenever a polygon is added via the map viewer, this event dispatches a JSON-encoded object consisting of latitude-longitude coordinates -- ie. latitude-longitude tuples -- this polygon is composed of.

## Coordinates

**Internal name:** `center_point`

**Friendcode:** `geo-lon-lat`

**Description:** Sends a signal whenever the shown center changes

This endpoint sends a signal everytime the center point of the map or the current zoom factor changes (either through user interaction or programmatically). The JSON-encoded data includes a latitude-longitude pair as well as the current zoom factor (denoted `z`).

## Clicked object

**Internal name:** `ooi_click`

**Friendcode:** `ooi-identifier`

**Description:** Sends a signal whenever an object is clicked

If an object of interest was clicked on the map, this endpoint will transmit the OOI's unique identifier. Note that this signal and `pos_click` are mutually exclusive; if an OOI was clicked, this signal will be used and `pos_click` will NOT trigger.

## Clicked spot

**Internal name:** `pos_click`

**Friendcode:** `geo-lon-lat`

**Description:** Sends a signal whenever an empty area of the map is clicked

