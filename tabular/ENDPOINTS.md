# Notice

This document has been generated automatically on 2013-08-16 12:25:24 +0200. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.

# Overview

**Declared inputs:** add_row

**Declared outputs:** selected_row

# Input endpoints

## Add a new row

**Internal name:** `add_row`

**Friendcode:** `row`

**Description:** Adds a new row at the end of the table

This endpoint accepts a JSON-encoded one-dimensional array where each element in the array represents exactly one cell in the table. A new row will be created and appended to the table with these new cells.

# Output endpoints

## Selected row

**Internal name:** `selected_row`

**Friendcode:** `row`

**Description:** Sends a signal whenever a row is clicked

If a row was selected by the user with a mouse click, this event will transmit the row's data as a JSON object. The property keys of this object denote the column header, and the property value contains the value (exactly as it is displayed).

