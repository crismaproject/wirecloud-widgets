/*global MashupPlatform*/

if (typeof MashupPlatform !== 'undefined') {
    var a = [ ];
    var b = [ ];

    function push() {
        MashupPlatform.wiring.pushEvent('output', JSON.stringify(a.concat(b)));
    }

    MashupPlatform.wiring.registerCallback('a_in', function (data) {
        try {
            a = JSON.parse(data);
            push();
        } catch(e) {
            console.log(e);
        }
    });

    MashupPlatform.wiring.registerCallback('b_in', function (data) {
        try {
            b = JSON.parse(data);
            push();
        } catch(e) {
            console.log(e);
        }
    });
}