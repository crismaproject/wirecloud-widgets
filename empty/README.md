**This is an empty project by design!**

You can use it as a baseline for your own development efforts. To do so, here are a few
helpful pointers to guide you during this process:

### Documentation:

* Official Wirecloud Developer's Guide: http://conwet.fi.upm.es/wirecloud/developer
* Wirecloud Widget API: http://conwet.fi.upm.es/wirecloud/widgetapi

### Examples:

This repository should be full of them.

### How to get going:

* Develop your widget as you would develop any other single page web application.
* Once your web application mostly works, create a `config.xml` file: use the one in this folder and change values
  as needed. (By the way, operators use a completely different config.xml schema than widgets for some reason.)
* Add any input and output endpoints in the `config.xml` file that you want. Then open your JavaScript files where
  you use `MashupPlatform.wiring.push('endpoint_name', 'data I want to push')` to send data through OutputEndpoints, or
  `MashupPlatform.wiring.registerCallback('endpoint_name', function (received) { .. })` to listen for incoming events
  through InputEndpoints.
  
Two things to keep in mind:
  
1. if you want to use/test your web application *outside* of Wirecloud, you should probably include a check if the
   global `MashupPlatform` object is actually available before making any calls, e.g. by using something like:
   `if (typeof MashupPlatform !== 'undefined') { .. }`

2. if you are using any external services (REST, SOAP, etc.), be sure to use
   `MashupPlatform.http.makeRequest` or `MashupPlatform.http.buildProxyURL` to avoid issues with browsers and their same
   origin policies. You'll find more details about how to use those in the Wirecloud Widget API.