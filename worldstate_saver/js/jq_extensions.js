(function($) {
    $.fn.extend({
        animDisable: function() {
            return $(this)
                .finish()
                .attr('disabled', 'disabled')
                .animate({opacity:.25}, 500);
        },

        animEnable: function() {
            return $(this)
                //.finish()
                .animate({opacity:1}, 250)
                .removeAttr('disabled');
        },

        animFlashRed: function() {
            return $(this)
                .animate({opacity:1, backgroundColor: 'rgb(185, 74, 72)', borderColor: 'rgb(175, 54, 42)'}, { duration: 500 })
                .delay(2500)
                .animate({backgroundColor: 'rgb(66, 139, 202)', borderColor: 'rgb(56, 119, 172)'}, { duration: 500 });
        },

        animText: function(text) {
            return $(this)
                .finish()
                .hide(200)
                .text(text)
                .show({
                    duration: 400,
                    complete: function() {
                        $(this).delay(7500).hide(400);
                    }
                });
        }
    });
})(jQuery);


/**
 * Short-hand method for a JSON POST XHR request. Differs from the regular $.post insofar as that this one
 * is synchronous.
 * @param {string} url
 * @param {*} data
 * @param {{}?} options
 * @returns {*}
 */
jQuery.postJSON = function(url, data, options) {
    return $.ajax($.extend({
        accepts: 'application/json',
        cache: false,
        data: data,
        dataType: 'json',
        url: url,
        type: 'POST'
    }, options || {}));
}