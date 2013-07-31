var MashupPlatform = {
    prefs: {
        get: function (name) {
            return null;
        },
        registerCallback: function (handler) {
        }
    },
    wiring: {
        registerCallback: function (name, handler) {
        },
        pushEvent: function (name, data) {
            console.log({ event: name, data: data });
        }
    }
};