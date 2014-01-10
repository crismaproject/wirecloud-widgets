/*global MashupPlatform*/

if (typeof MashupPlatform !== 'undefined') {
    // these are more or less buffers; whenever anything is received over either input A or B, data will be
    // stored in one of these arrays accordingly.
    // whenever anything is received over any input endpoint, the entire buffer will be concatenated and sent off
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