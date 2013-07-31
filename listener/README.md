# Technical documentation

This is a small widget for development purposes *only*.

It consists of only one input endpoint that can be connected to any other widget's output endpoint. Any signal passing over this connection will then be prepended to this widget's view (ie. the newest signals will always be prepended to the top of the list).
If the preference `to_console` is `true`, this data will *additionally* be sent to the browser's JavaScript console (view it with the keyboard shortcut `Ctrl+Shift+J` in Chrome).