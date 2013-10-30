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