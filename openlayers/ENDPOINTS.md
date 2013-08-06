# Notice
This document has been generated automatically on 2013-08-06 13:14:41 +0200. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.

# Input endpoints
* **Add line**
    * Internal name `add_line`, with declared friend-code: `geo-points`
    * Adds a line to the map
* **Add point**
    * Internal name `add_point`, with declared friend-code: `geo-ooi`
    * Adds a point to the map
* **Add polygon**
    * Internal name `add_poly`, with declared friend-code: `geo-points`
    * Adds a polygon to the map
* **Clear**
    * Internal name `clear`, with declared friend-code: `signal`
    * Removes all features from the map (points and polygons)
* **Coordinates**
    * Internal name `view_point`, with declared friend-code: `geo-lon-lat`
    * Focuses the map on specified coordinates

# Output endpoints
* **Coordinates**
    * Internal name `center_point`, with declared friend-code: `geo-lon-lat`
    * Sends a signal whenever the shown center changes
* **Clicked object**
    * Internal name `ooi_click`, with declared friend-code: `ooi-identifier`
    * Sends a signal whenever an object is clicked
* **Clicked spot**
    * Internal name `pos_click`, with declared friend-code: `geo-lon-lat`
    * Sends a signal whenever an empty area of the map is clicked
