var http = require('http');
var fs = require('fs');
var gk = require("./getkey");

var originalImageUrl = '';
//originalImageUrl = 'https://giard.smugmug.com/Travel/Sweden-2015/i-ncF6hXw/0/L/IMG_1560-L.jpg';
originalImageUrl = 'http://davidgiard.com/content/Giard/_DGInAppleton.png';
const tnWidth = 200;
const tnHeight = 200;
var thumbnailImageUrl = '';
const outputFolder = '_thumbnails';

var data = JSON.stringify({
    'url': originalImageUrl
});

var wsHost = 'westus.api.cognitive.microsoft.com';
var wsPath = '/vision/v2.0/generateThumbnail?width=' + tnWidth + '&height=' + tnHeight + '&smartCropping=true'

var key = gk.getKey();

var options = {
    host: wsHost,
    port: '80',
    path: wsPath,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Ocp-Apim-Subscription-Key': key,
        'Content-Length': data.length
    }
};

var req = http.request(options, function (res) {
    var msg = '';

    res.setEncoding('binary')
    res.on('data', function (chunk) {
        msg += chunk;
    });
    res.on('end', function () {
        var fileName = "tn_" + Math.floor(Math.random() * 1000) + ".jpg";
        thumbnailImageUrl = outputFolder + fileName;

        fs.writeFile(thumbnailImageUrl, msg, 'binary', function (err) {
            if (err) return console.log(err);
            console.log('File %s written successfully!', thumbnailImageUrl);
        });

        showResultsInWebPage();

    });
});

req.write(data);
console.log("Generating thumbnail for %s...", originalImageUrl)
console.log('');
req.end();


var showResultsInWebPage = function () {
    fs.readFile(thumbnailImageUrl, function (err, data) {
        if (err) throw err; // Fail if the file can't be read.
        http.createServer(function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><body>');
            res.write('<h1>Thumbnail image</h2>');
            res.write('<img src="data:image/jpeg;base64,')
            res.write(Buffer.from(data).toString('base64'));
            res.write('" />');
            res.write('<h1>Original image</h2>');
            res.write('<img src="' + originalImageUrl + '" />')
            res.write('</body></html>');
            res.end('');
        }).listen(8124);
        console.log('Server running at http://localhost:8124/');
    });
}
