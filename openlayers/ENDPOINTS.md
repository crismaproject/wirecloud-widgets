# Notice

This document has been generated automatically on 2013-08-13 09:51:13 +0200. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.

# Overview

**Declared inputs:** add_line, add_point, add_poly, clear, view_point

**Declared outputs:** added_point, added_line, added_poly, center_point, ooi_click, pos_click

# Input endpoints

## Add line

**Internal name:** `add_line`

**Friendcode:** `geo-points`

**Description:** Adds a line to the map

## Add point

**Internal name:** `add_point`

**Friendcode:** `geo-ooi`

**Description:** Adds a point to the map

This is an endpoint that accepts a JSON-encoded object with latitude and longitude coordinate data and a uniqueidentifier. The object will be added to the map view. If the recenter preference is set to true, the map willthen pan to the newly added object.

## Add polygon

**Internal name:** `add_poly`

**Friendcode:** `geo-points`

**Description:** Adds a polygon to the map

## Clear

**Internal name:** `clear`

**Friendcode:** `signal`

**Description:** Removes all features from the map (points and polygons)

## Coordinates

**Internal name:** `view_point`

**Friendcode:** `geo-lon-lat`

**Description:** Focuses the map on specified coordinates

This is an endpoint that accepts a JSON-encoded object with latitude and longitude coordinate data. Whencoordinates are received (WGS 1984 projection), the map will pan to the location represented by it.

# Output endpoints

## Added point

**Internal name:** `added_point`

**Friendcode:** `geo-lon-lat`

**Description:** Whenever a point is added via the map viewer, this event dispatches the coordinates

## Added line

**Internal name:** `added_line`

**Friendcode:** `geo-points`

**Description:** Whenever a (poly-)line is added via the map viewer, this event dispatches the geometry

## Added polygon

**Internal name:** `added_poly`

**Friendcode:** `geo-points`

**Description:** Whenever a polygon is added via the map viewer, this event dispatches the geometry

## Coordinates

**Internal name:** `center_point`

**Friendcode:** `geo-lon-lat`

**Description:** Sends a signal whenever the shown center changes

## Clicked object

**Internal name:** `ooi_click`

**Friendcode:** `ooi-identifier`

**Description:** Sends a signal whenever an object is clicked

## Clicked spot

**Internal name:** `pos_click`

**Friendcode:** `geo-lon-lat`

**Description:** Sends a signal whenever an empty area of the map is clicked

