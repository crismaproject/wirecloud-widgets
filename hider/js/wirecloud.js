if (typeof MashupPlatform === 'undefined') {
    console.warn('The Wirecloud environment was not detected.');
} else if(!parent) {
    console.warn('No parent found.');
} else {
    $(function() {
        $('#hideBtn')
            .removeAttr('disabled')
            .click(function () {
                $(this).attr('disabled', 'disabled');
                $('header, footer, #wirecloud_header', top.document).remove();
                console.log('All removed.');
            });
    });
}