$(function(){
    MashupPlatform.wiring.registerCallback('rddt_link', function(event_data) {
        var uri = 'http://www.reddit.com' + event_data + ".json";

        MashupPlatform.http.makeRequest(uri, {
            method: 'GET',
            onSuccess: function(data) {
                // not 100% sure if the response is already a JS object or needs parsing; luckily, we can cover both grounds easily
                var json = data.responseJSON || jQuery.parseJSON(data.responseText);
                var comments = json[1].data.children;
                $('ul#comments').empty();
                for(var i = 0; i < 5 && i < comments.length; i++) {
                    var comment = comments[i].data;
                    var comment_html = $(comment.body_html);
                    $('ul#comments').append($('<li></li>').html(comment_html));
                }
            },
            onError: function(data) {
                onError();
            }
        });
    });
});