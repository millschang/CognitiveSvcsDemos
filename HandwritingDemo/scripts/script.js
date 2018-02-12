$(function () {
    $("#ImageUrlDropdown").change(function () {
        var url = this.value;
        showTextImage(url);
    })

    showTextImage = function (url) {
        $("#SourceUrlSpan").text(url);
        $("#TextImage").attr("src", url);
        //        $("#TextImageFrame").attr("src", url);
        $("#OutputDiv").text("");
    }

    var drawBox = function (boundingBox) {

        var topLeftX = boundingBox[0];
        var topLeftY = boundingBox[1];
        var topRightX = boundingBox[2];
        var topRightY = boundingBox[3];
        var bottomRightX = boundingBox[4];
        var bottomRightY = boundingBox[5];
        var bottomLeftX = boundingBox[6];
        var bottomLeftY = boundingBox[7];
        var height = bottomRightY - topRightY;
        var width = topRightX - topLeftX;

        var rectangleImage = $("#Rectangle");
        rectangleImage.css("top", topLeftY+"px");
        rectangleImage.css("left", topLeftX+"px");
        rectangleImage.css("height", height+"px");
        rectangleImage.css("width", width+"px");
        rectangleImage.css("display", "block");
        rectangleImage.css("position", "absolute");
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
            headersArray = headersArray.map(h => h.toLowerCase());
            //words =        words       .map(v => v.toLowerCase());
            var operationLocationUrl = "";

            var operationLocationUrlIndex = headersArray.indexOf("operation-location:");
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

                            var wordToFindTextbox = document.getElementById("WordToFind")
                            var wordToFind = wordToFindTextbox.value;
                            wordToFind = wordToFind.toUpperCase().trim();
    
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
                                    if (thisWord.text.toUpperCase().trim() == wordToFind) {
                                        // Matching the search word. Draw a box around it.
                                        var boundingBox = thisWord.boundingBox;
                                        drawBox(boundingBox);
                                    }
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

