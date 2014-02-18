/**
 * @constructor
 */
function WPS(baseUri) {
    this.baseUri = baseUri;

    this.processes = null;
    this.processDetails = { };
}

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

WPS.prototype.getProcessDetails = function(offeringId) {
    var $this = this;
    var deferred = $.Deferred();

    if (this.processDetails.hasOwnProperty(offeringId))
        deferred.resolveWith($this, [this.processDetails[offeringId]]);
    else
        $.get(this.baseUri + '?service=WPS&request=DescribeProcess&version=1.0.0&identifier=' + offeringId)
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

                    return { id: id, title: title, min: min, max: max };
                }).get();

                var value = { in: inputs, out: outputs };
                $this.processDetails[offeringId] = value;
                deferred.resolveWith($this, [value]);
            });

    return deferred.promise();
};