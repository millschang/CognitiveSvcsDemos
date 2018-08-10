$(function () {
    
    const missingKeyErrorMsg = `
        <div>
            No key found.<br>
            This demo will not work without a key.<br>
            Create a script.js file with the following code:.
        </div>
        <div style="color:red; padding-left: 20px;">
        var getKey = function(){<br>
            &nbsp; &nbsp; return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";<br>
        }
        </div>
        <div>where xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx is your Azure Face API key</div>`
    
    var outputDiv = $("#OutputDiv");
    try {
        var subscriptionKey = getKey();
    }
    catch(err) {
        outputDiv.html(missingKeyErrorMsg);
    }


	$("#AnaylyzeButton").click(function(){

        var subscriptionKey = getKey() || "Copy your Subscription key here";
        var textToAnalyze = $("#TextToAnalyze").val();

        var webSvcUrl = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";
        // var webSvcUrl = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

        outputDiv.text("Thinking...");

        $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{"documents": [ { "language": "en", "id": "text01",  "text": "'+ textToAnalyze + '" }]}'
        }).done(function (data) {
			if (data.errors.length > 0) {
                outputDiv.html("Error: " + data.errors[0]);
			}
            else if (data.documents.length > 0) {
				var score = data.documents[0].score;
				if (score > 0.5){
					outputText = "That is a Positive thing to say! "
						+ "<br>"
						+ "Score=" 
						+ score.toFixed(2);
					$("#PositiveImage").css("display", "inline");
					$("#NegativeImage").css("display", "none");
				}
				else{
					outputText = "That is a Negative thing to say! "
						+ "<br>"
						+ "Score=" 
						+ score.toFixed(2);
					$("#PositiveImage").css("display", "none");
					$("#NegativeImage").css("display", "inline");
				}
                outputDiv.html(outputText);
            }
            else {
                outputDiv.text("No text to analyze.");
				$("#PositiveImage").css("display", "none");
				$("#NegativeImage").css("display", "none");
            }

        }).fail(function (err) {
            $("#OutputDiv").text("ERROR! " + err.responseText);
			$("#PositiveImage").css("display", "none");
			$("#NegativeImage").css("display", "none");
        });
		
   });


});

