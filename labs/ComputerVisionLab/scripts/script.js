$(function () {

    $("#analyzeImageButton").click(function () {
        getImageInfo();

    });

    var getImageInfo = function () {
        var subscriptionKey = "e4df9eb47d0a40a4b43e627483ed5bb0";
        var imageUrl = $("#imageUrlTextbox").val();
        var webSvcUrl = "https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description,Categories,Tags ";
        var resultsDiv = $("#ResultsDiv");
        var descriptionDiv = $("#DescriptionDiv");
        var categoriesDiv = $("#CategoriesDiv");
        var tagsDiv = $("#TagsDiv");


        if (imageUrl) {

            $.ajax({
                type: "POST",
                url: webSvcUrl,
                headers: {
                    "Ocp-Apim-Subscription-Key": subscriptionKey
                },
                contentType: "application/json",
                data: '{ "Url": "' + imageUrl + '" }'
            }).done(function (data) {
                var descriptionText = "Description: " + data.description.captions[0].text;
                descriptionDiv.text(descriptionText);
                var categories = data.categories;
                var tags = data.tags;
                var categoriesText = "Categories: ";
                for (var i = 0; i < categories.length; i++) {
                    categoriesText = categoriesText + "; " + categories[i].name;
                }
                categoriesDiv.text(categoriesText);
                var tagsText = "Tags: ";
                for (var i = 0; i < tags.length; i++) {
                    tagsText = tagsText + "; " + tags[i].name;
                }
                tagsDiv.text(tagsText);

                $("#ResultsDiv").text("Success!");

            }).fail(function (err) {
                $("#ResultsDiv").text("ERROR!" + err.responseText);
            });
        }
    };




});