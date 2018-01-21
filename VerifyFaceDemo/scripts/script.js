var faceApi = "https://southcentralus.api.cognitive.microsoft.com/face/v1.0/";

$(function () {
    $("#Image1UrlDropdown").change(function () {
        var url = this.value;
        showImage(url);
        getFaceInfo();
    });

    $("#Image2UrlDropdown").change(function () {
        var url = this.value;
        showImage(url);
        getFaceInfo();
    });

    var showImage = function () {
        var image1Url = $("#Image1UrlDropdown").val();
        if (image1Url) {
            $("#Image1").attr("src", image1Url);
        }
        var image2Url = $("#Image2UrlDropdown").val();
        if (image2Url) {
            $("#Image2").attr("src", image2Url);
        }
    };



    var getFaceInfo = function () {

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        var image1Url = $("#Image1UrlDropdown").val();
        var image2Url = $("#Image2UrlDropdown").val();

        var faceDetectApiUrl = faceApi + "detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,smile,facialHair,headPose,glasses";

        var outputDiv = $("#OutputDiv");
        outputDiv.text("Thinking...");

        var outputText = "";
        var face1Id = "";
        var face2Id = "";

        // Get Face 1 GUID
        $.ajax({
            type: "POST",
            url: faceDetectApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{ "Url": "' + image1Url + '" }'
        }).done(function (data) {
            if (data.length > 0) {
                var firstFace = data[0];
                var faceId = firstFace.faceId;
                face1Id = faceId;
                outputText += "Image1 ID: " + faceId + "<br>";

                outputDiv.html(outputText);

                // Get Face 2 GUID
                $.ajax({
                    type: "POST",
                    url: faceDetectApiUrl,
                    headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
                    contentType: "application/json",
                    data: '{ "Url": "' + image2Url + '" }'
                }).done(function (data) {

                    if (data.length > 0) {
                        var firstFace = data[0];
                        var faceId = firstFace.faceId;
                        face2Id = faceId;
                        outputText += "Image2 ID: " + faceId + "<br>";

                        outputDiv.html(outputText);

                    }
                    else {
                        outputDiv.text("No faces detected.");

                    }

                    // Call Face Verify. Are Face1 and Face2 the same?
                    var faceVerifyApiUrl = faceApi + "verify";

                    var faceVerifyJson = "{'faceId1':'" + face1Id + "',"
                        + "'faceId2':'" + face2Id + "'}";

                    $.ajax({
                        type: "POST",
                        url: faceVerifyApiUrl,
                        headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
                        contentType: "application/json",
                        data: faceVerifyJson,
                    }).done(function (data) {
                        var isIdentical = data.isIdentical;
                        var confidence = data.confidence * 100;

                        outputText += "Identical persons?: " + isIdentical + "<br>"
                            + "I am " + confidence.toFixed(1) + "% confident these are photos of the same person<br>";

                        outputDiv.html(outputText);

                    }).fail(function (err) {
                        if (err.status == 429) {
                            $("#OutputDiv").text(
                                "You have exceeded the maximum calls for this service. Please try again shortly."
                            );
                        }
                        else {
                            $("#OutputDiv").text("ERROR!" + err.responseText);
                        }
                    });

                }).fail(function (err) {
                    if (err.status == 429) {
                        $("#OutputDiv").text(
                            "You have exceeded the maximum calls for this service. Please try again shortly."
                        );
                    }
                    else {
                        $("#OutputDiv").text("ERROR!" + err.responseText);
                    }
                });

            }
            else {
                outputDiv.text("No faces detected.");
            }

        }).fail(function (err) {
            if (err.status == 429) {
                $("#OutputDiv").text(
                    "You have exceeded the maximum calls for this service. Please try again shortly."
                );
            }
            else {
                $("#OutputDiv").text("ERROR!" + err.responseText);
            }
        });
    };


    $("#VerifyButton").click(function () {
        //showImage();
        getFaceInfo();
        return false;
    });

    $("#image1UrlTextbox").val("https://pbs.twimg.com/profile_images/718271918864998403/eor0frLq_400x400.jpg");
    $("#image2UrlTextbox").val("http://davidgiard.com/themes/Giard/images/logo.png");
    showImage();
    getFaceInfo();


});

