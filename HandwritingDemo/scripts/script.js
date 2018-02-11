$(function () {
    $("#ImageUrlDropdown").change(function () {
        var url = this.value;
        showTextImage(url);
    })

    showTextImage = function (url) {
        $("#SourceUrlSpan").text(url);
        $("#TextImageFrame").attr("src", url);
        $("#OutputDiv").text("");
    }


    $("#GetTextFromPictureButton").click(function () {
        var outputDiv = $("#OutputDiv");
        outputDiv.text("Thinking...");
        var url = $("#ImageUrlDropdown").val();
        var computerVisionKey = getKey() || "Copy your Subscription key here";
        var webSvcUrl = "https://westus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true";
        webSvcUrl = webSvcUrl;
        var call = $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": computerVisionKey },
            contentType: "application/json",
            data: '{ "Url": "' + url + '" }'
        }).done(function (data) {
            var headers = call.getAllResponseHeaders();
            var headersArray = headers.split(/\s+/);
            var operationLocationUrl = "";

            var operationLocationUrlIndex = headersArray.indexOf("Operation-Location:");
            if (operationLocationUrlIndex >= 0) {
                operationLocationUrl = headersArray[operationLocationUrlIndex + 1];
            }

            if (operationLocationUrl != "") {
                var getTextInImage = function () {
                    $.ajax({
                        type: "GET",
                        url: operationLocationUrl,
                        headers: { "Ocp-Apim-Subscription-Key": computerVisionKey }
                    }).done(function (data) {
                        console.log(data.status);
                        if (data.status.toUpperCase() == "SUCCEEDED") {
                            var results = data.recognitionResult;
                            var linesOfText = results.lines;
                            outputDiv.text("");
                            for (var l = 0; l < linesOfText.length; l++) {
                                var output = "";

                                var thisLine = linesOfText[l];

                                console.log("LINE BOX:")
                                console.log(thisLine.boundingBox);
                                var words = thisLine.words;
                                for (var w = 0; w < words.length; w++) {
                                    var thisWord = words[w];
                                    var boundingBox = thisWord.boundingBox;
                                    output += thisWord.text;
                                    output += " ";

                                    console.log(thisWord.text);
                                    console.log(boundingBox);

                                }
                                var newDiv = "<div>" + output + "</div>";
                                outputDiv.append(newDiv);

                            }

                        }
                        else {
                            setTimeout(getTextInImage, 100);
                        }

                    }).fail(function (err) {
                        $("#OutputDiv").text("ERROR!" + err.responseText);
                    });
                }

                setTimeout(getTextInImage, 100);

            }

        }).fail(function (err) {
            $("#OutputDiv").text("ERROR!" + err.responseText);
        });



    });

    $('#ImageUrlDropdown option:eq(0)').prop('selected', true);
    showTextImage($('#ImageUrlDropdown option:eq(0)').val());
});

var getKey = function () {
    // TODO: Replace with your Computer Vision API key
    return "31a68661b4dd4365994bb77acffd7076";
    //return "f1e62401f0e140f0a777d7c68275955b";
}
