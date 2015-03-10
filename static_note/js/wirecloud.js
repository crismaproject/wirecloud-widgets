function setText(message) {
    var containerNode = document.getElementById('messageContainer');
    if (containerNode.hasOwnProperty('textContent'))
        containerNode.textContent = message;
}

if (typeof MashupPlatform !== 'undefined') {

    var applyPreferences = function () {
        var message = MashupPlatform.prefs.get('message');
        setText(message);
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();
}