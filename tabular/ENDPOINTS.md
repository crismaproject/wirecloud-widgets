# Notice

This document has been generated automatically on 2013-08-14 14:03:04 +0200. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.

# Overview

**Declared inputs:** 

**Declared outputs:** selected_row

# Input endpoints

(none)

# Output endpoints

## Selected row

**Internal name:** `selected_row`

**Friendcode:** `row`

**Description:** Sends a signal whenever a row is clicked

If a row was selected by the user with a mouse click, this event will transmit the row's data as a JSON object. The property keys of this object denote the column header, and the property value contains the value (exactly as it is displayed).

