/*global MashupPlatform*/

var a = [ ];
var b = [ ];

function push() {
    var merged;
    if (!b.length && a.length)
        merged = a;
    else if (b.length && !a.length)
        merged = b;
    else
        merged = a.concat(b);
    MashupPlatform.wiring.pushEvent('output', JSON.stringify(merged));
}

MashupPlatform.wiring.registerCallback('a', function (data) {
    a = JSON.parse(data);
    push();
});

MashupPlatform.wiring.registerCallback('b', function (data) {
    b = JSON.parse(data);
    push();
});