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
        var language = $("#LanguageDropdown").val();
        var computerVisionKey = getKey() || "Copy your Subscription key here";
        var webSvcUrl = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr";
        //var webSvcUrl = "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr";
        webSvcUrl = webSvcUrl + "?language=" + language;
        $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": computerVisionKey },
            contentType: "application/json",
            data: '{ "Url": "' + url + '" }'
        }).done(function (data) {
            outputDiv.text("");

            var regionsOfText = data.regions;
            for (var r = 0; r < regionsOfText.length; h++) {
                var linesOfText = data.regions[r].lines;
                for (var l = 0; l < linesOfText.length; l++) {
                    var output = "";

                    var thisLine = linesOfText[l];
                    var words = thisLine.words;
                    for (var w = 0; w < words.length; w++) {
                        var thisWord = words[w];
                        output += thisWord.text;
                        output += " ";
                    }
                    var newDiv = "<div>" + output + "</div>";
                    outputDiv.append(newDiv);

                }
                outputDiv.append("<hr>");
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
