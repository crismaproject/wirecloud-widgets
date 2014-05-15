/*global MashupPlatform,Wirecloud*/
if (typeof MashupPlatform !== 'undefined') {
    MashupPlatform.wiring.registerCallback('signal', function () {
        var wirecloud = top.Wirecloud;
        var id = MashupPlatform.prefs.get('tab_id');
        var tab = null;

        if (/[0-9]+/.test(id)) {
            id = parseInt(id);
            tab = wirecloud.activeWorkspace.tabInstances[id];
        } else if(id.length > 0) {
            var availableTabs = wirecloud.activeWorkspace.tabInstances;
            for (var key in availableTabs) {
                var thisTab = availableTabs[key];
                if (thisTab.hasOwnProperty('nameText') && thisTab.nameText == id) {
                    tab = thisTab;
                    break;
                }
            }
        }

        if (tab)
            wirecloud.activeWorkspace.notebook.goToTab(tab);
        else
            throw new NoSuchTabError('No tab by the name or identifier "' + id + '" could be found.');
    });
}

function NoSuchTabError(message) {
    this.name = 'NoSuchTabError';
    this.message = message || 'No tab by that name was found';
}

NoSuchTabError.prototype = Object.create(Error.prototype);