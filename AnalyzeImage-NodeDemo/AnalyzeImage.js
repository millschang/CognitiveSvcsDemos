var http = require('http');
var fs = require('fs');
var gk = require("./getkey");

var imageUrl = 'http://www.nicbblog.org/wp-content/uploads/2015/09/boat.jpg';
var caption;


var data = JSON.stringify({
    'url': imageUrl
});

var wsHost = 'westus.api.cognitive.microsoft.com';

var wsPath = '/vision/v2.0/analyze?visualFeatures=Description';

var key = gk.getKey();
//var key = '61810ac22fa540dfb33465e4c61c0ee6';

var options = {
    host: wsHost,
    port: '80',
    path: wsPath,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Ocp-Apim-Subscription-Key': '61810ac22fa540dfb33465e4c61c0ee6',
        'Content-Length': data.length
    }
};

var req = http.request(options, function (res) {
    var msg = '';

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        msg += chunk;
    });
    res.on('end', function () {
        var msg1 = JSON.parse(msg);
        var captions = msg1.captions;
        caption = msg1.description.captions[0];

        console.log("Caption: %s", caption.text);
        console.log("Confidence: %i%", caption.confidence * 100);

        showResultsInWebPage();

    });
});

req.write(data);
console.log("Analyzing image %s...", imageUrl)
console.log('');
req.end();

var showResultsInWebPage = function(){
    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<html><body>');
        res.write ('<h1>' + caption.text + '</h2>');
        res.write('<h3>Confidence: ');
        var c = parseFloat(Math.round(caption.confidence * 100)).toFixed(0);
        res.write(c + '%');
        res.write ('</h3>');
        res.write('<img src="'+ imageUrl + '" />')
        res.write('</body></html>');
        res.end('');
            }).listen(8124);
    console.log('Server running at http://localhost:8124/');
    
}