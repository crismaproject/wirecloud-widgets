$(function(){
    var reload = function() {
        $('button#refresh').attr('disabled', 'disabled');
        $('#container').empty();

        // Make a request via the Wirecloud proxy to obtain JSON data from a third-party website
        MashupPlatform.http.makeRequest('http://www.reddit.com/r/technology/.json', {
            method: 'GET',
            onSuccess: function(data) {
                // not 100% sure if the response is already a JS object or needs parsing; luckily, we can cover both grounds easily
                var json = data.responseJSON || jQuery.parseJSON(data.responseText);
                json.data.children.forEach(function(item) {
                    if (!item.data.over_18) { // don't display potentially NSFW news items
                        var element = $('<li class="newsitem"></li>')
                                    .text(item.data.title);
                        $(element).click(function () {
                            // fires article_link and rddt_link events
                            // article_link: contains the absolute URL to the article in question
                            // rddt_link: contains the relative URL to the reddit news item (host would be http://www.reddit.com); useful for further API queries
                            MashupPlatform.wiring.pushEvent('article_link', item.data.url);
                            MashupPlatform.wiring.pushEvent('rddt_link', item.data.permalink);
                        });
                        $('#container').append(element);
                    }
                });
                $('button#refresh').removeAttr('disabled');
            },
            onError: function(data) {
                onError();
                $('button#refresh').removeAttr('disabled');
            }
        });
    };

    // When the script first loads, immediately pull data to display.
    reload();

    // In addition, pull data from the remote data provider again when the <button id="refresh"/> element is clicked
    $('button#refresh').click(reload);
});