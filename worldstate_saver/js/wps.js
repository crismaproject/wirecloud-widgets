/**
 * @param {string} baseUri the WPS's base URI (including the full path, but without any query fragments)
 * @param {boolean?} loadEagerly if true, the WPS's capabilities and process detail will be loaded immediately (but due
 * to their asynchronous nature, this may not be immediately apparent)
 * @author Manuel Warum (AIT)
 * @version 0.6.0
 * @constructor
 */
function WPS(baseUri, loadEagerly) {
    /** @private */
    this.baseUri = baseUri;

    /** @private */
    this.processes = null;
    /** @private */
    this.processDetails = { };

    if (loadEagerly) {
        var $this = this;
        this.getProcesses()
            .done(function (processes) {
                console.log('Capabilities discovered.');
                var processDiscovery = processes.map(function(x) { console.log('Process discovered: ' + x.id); $this.getProcessDetails(x.id); });
                $.when(processDiscovery).done(function (x) { console.log('Eager process discovery complete.'); });
            });
    }
}

/**
 * Returns a jQuery promise that contains all processes known to the WPS server.
 * The response of this inquiry is cached, meaning that any call to this method after the first
 * will result in no actual HTTP request; instead, the locally cached results of the first request are returned.
 * @return {jQuery.Deferred}
 */
WPS.prototype.getProcesses = function() {
    var $this = this;
    var deferred = $.Deferred();
    if (this.processes)
        deferred.resolveWith($this, [this.processes]);
    else
        $.get(this.baseUri + '?service=WPS&request=GetCapabilities')
            .done(function (data) {
                var processes = $('Process', data).map(function(i, process) {
                    var $process = $(process);
                    var identifier = $('Identifier', $process).text();
                    var title = $('Title', $process).text();
                    var abstract = $('Abstract', $process).text();
                    return { id: identifier, title: title, description: abstract };
                }).get();

                $this.processes = processes;
                deferred.resolveWith($this, [processes]);
            });

    return deferred.promise();
};

/**
 * Returns a jQuery promise that contains all processes known to the WPS server.
 * The response of this inquiry is cached, meaning that any call to this method (with the same processId) after the first
 * will result in no actual HTTP request; instead, the locally cached results of the first request are returned.
 * @param {string} processId the identifier of the process that you want more information about.
 * @return {jQuery.Deferred}
 */
WPS.prototype.getProcessDetails = function(processId) {
    var $this = this;
    var deferred = $.Deferred();

    if (this.processDetails.hasOwnProperty(processId))
        deferred.resolveWith($this, [this.processDetails[processId]]);
    else
        $.get(this.baseUri + '?service=WPS&request=DescribeProcess&version=1.0.0&identifier=' + processId)
            .done(function (data) {
                var inputs = $('Input', data).map(function(i, input) {
                    var $input = $(input);
                    var min = $input.attr('minOccurs') || 1;
                    var max = $input.attr('maxOccurs') || 1;
                    var id = $('Identifier', $input).text();
                    var title = $('Title', $input).text();

                    return { id: id, title: title, min: min, max: max };
                }).get();

                var outputs = $('Output', data).map(function(i, output) {
                    var $output = $(output);
                    var id = $('Identifier', $output).text();
                    var title = $('Title', $output).text();

                    return { id: id, title: title };
                }).get();

                var value = { in: inputs, out: outputs };
                $this.processDetails[processId] = value;
                deferred.resolveWith($this, [value]);
            });

    return deferred.promise();
};

/**
 * Executes a process via WPS.
 * @param {string} processId the process identifier as returned by the WPS capabilities request.
 * @param {*} args all arguments required to execute this request as an object where property names are treated as
 * argument names, and property values as argument values.
 * @return {jQuery.Deferred} a deferred promise; if the request succeeds, the callback function's first argument is
 * compromised of an object that maps output identifiers to values.
 */
WPS.prototype.executeProcess = function (processId, args) {
    var $this = this;
    var deferred = $.Deferred();

    var argStr = '';
    for (var key in args) {
        if (argStr.length > 0) argStr += ';';
        argStr += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
    }
    argStr = encodeURIComponent(argStr);
    $.get(this.baseUri + '?service=WPS&request=Execute&version=1.0.0&identifier=' + processId + '&datainputs=' + argStr).done(function (response) {
        if ($('ProcessFailed', response).length)
            deferred.rejectWith($this, [response]);
        else {
            var returnValue = { };
            $('Output', response).each(function (index, output) {
                var $output = $(output);
                returnValue[$('Identifier', $output).text()] = $('LiteralData', $output).text();
            });
            deferred.resolveWith($this, [returnValue]);
        }
    });

    return deferred.promise();
};