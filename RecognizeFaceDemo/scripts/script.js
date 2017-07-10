$(function () {

    const faceApiUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0/";

    var listAllGroups = function () {
        var subscriptionKey = getKey() || "Copy your Subscription key here";
        var listGroupApiUrl = faceApiUrl + "persongroups?top=100";

        $("#GroupsList")
        $("#GroupsList").text("Working...");

        $.ajax({
            type: "GET",
            url: listGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json"
        }).done(function (data) {
            $("#GroupsList").text("");
            if (data.length) {
                data.forEach(
                    function (item, index) {

                        var pgLi = document.createElement("li");
                        var text = item.personGroupId + " (" + item.name + ")";
                        pgLi.appendChild(document.createTextNode(text));
                        $("#GroupsList").append(pgLi);

                        var pgOption = document.createElement("option");
                        pgOption.value = item.personGroupId;
                        pgOption.text = item.personGroupId;
                        $("#GroupList").innerHtml = "";
                        $("#GroupList").append(pgOption);

                        console.log(index);
                        console.log(item.personGroupId);
                        console.log(item.name);
                        console.log(item.userData);
                    }
                )
            }
            else {
                $("#GroupsList").text("No groups to list");
            }
            var status = "got list";
            $("#StatusLabel").text(status);

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#StatusLabel").text(status);

        });
    };

    var deleteAllGroups = function () {
        var subscriptionKey = getKey() || "Copy your Subscription key here";
        var getGroupApiUrl = faceApiUrl + "persongroups?top=100";
        $("#StatusLabel").html("Working...<br>");

        $.ajax({
            type: "GET",
            url: getGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json"
        }).done(function (data) {
            if (data.length) {

                var statusText = "";
                data.forEach(
                    function (item, index) {

                        console.log(index);
                        console.log(item.personGroupId);
                        console.log(item.name);
                        console.log(item.userData);


                        var groupId = item.personGroupId;
                        var deleteGroupUri = faceApiUrl + "persongroups/" + groupId;
                        $.ajax({
                            type: "DELETE",
                            url: deleteGroupUri,
                            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey }
                        }).done(function (data) {
                            status += "successfully deleted group " + groupId + "<br>";
                            $("#StatusLabel").html(status);


                        }).fail(function (err) {
                            status += "Failed to delete group " + groupId + "<br>";
                            $("#StatusLabel").html(status);
                        });

                    }
                )
            }
            $("#StatusLabel").text(status);

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#StatusLabel").text(status);

        });
    };

    var createGroup = function (groupId) {
        var subscriptionKey = getKey() || "Copy your Subscription key here";

        var createGroupApiUrl = faceApiUrl + "persongroups/" + groupId;

        $.ajax({
            type: "PUT",
            url: createGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{"name":"' + groupId + '","userData":"test group"}'
        }).done(function (data) {
            var status = "Group " + groupId + " created";
            $("#StatusLabel").text(status);

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#StatusLabel").text(status);

        });

    };


    var addFaceToPerson = function (personId, groupId, face) {

        var subscriptionKey = getKey() || "Copy your Subscription key here";


        var addFacesToPersonApiUrl = faceApiUrl + "persongroups/"
            + groupId
            + "/persons/"
            + personId
            + "/persistedFaces";

        $.ajax({
            type: "POST",
            url: addFacesToPersonApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/octet-stream",
            data: face,
            processData: false
        }).done(function (data) {
            var status = "Added faces to Group " + groupId + ", PersonId " + personId;
            $("#StatusLabel").text(status);

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#StatusLabel").text(status);
        });
    };

    var getPersonsInGroup = function (groupId) {

        if (!groupId) {
            $("#StatusLabel").text("No GroupID specified");
        }

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        var getPersonsInGroupApiUrl = faceApiUrl + "persongroups/"
            + groupId
            + "/persons?top=1000"

        var groupList = ""

        var personDropDown = $("#PersonDropDown");
        personDropDown.innerHtml = "";

        $.ajax({
            type: "GET",
            url: getPersonsInGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey }
        }).done(function (data) {
            if (data.length) {
                groupList = "<h3>Persons in Group " + groupId + "</h3>"
                groupList += "<ul>"
                data.forEach(function (person) {

                    // List
                    groupList += "<li>" + person.name + " (" + person.personId + ")";

                    // DropDown
                    var personOption = document.createElement("option");
                    personOption.value = person.personId;
                    personOption.text = person.name;
                    personDropDown.append(personOption);


                }, this);
                groupList += "</ul>"
                $("#StatusLabel").html(groupList);
            }
            else {
                $("#StatusLabel").text("No persons in group " + groupId);

            }

        }).fail(function (err) {
            status += "Failed to get persons in group " + groupId + "<br>";
            $("#StatusLabel").html(status);
            return status;
        });

    };

    var trainGroup = function (groupId) {
        // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/train
        if (!groupId) {
            $("#StatusLabel").text("No GroupID specified");
            return;
        }

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        var trainGroupApiUrl = faceApiUrl + "persongroups/"
            + groupId
            + "/train";

        $.ajax({
            type: "POST",
            url: trainGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            body: "{}"
        }).done(function (data) {
            $("#StatusLabel").text("Started training group " + groupId);
        }).fail(function (err) {
            status += "Failed to train  group " + groupId + "<br>";
            $("#StatusLabel").html(status);
            return status;
        });
    };

    var addPersonToGroup = function (groupId, personName) {
        // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons
        if (!groupId || !personName) {
            return;
        }
        var subscriptionKey = getKey() || "Copy your Subscription key here";
        var addPersonToGroupApiUrl = faceApiUrl + "persongroups/"
            + groupId
            + "/persons";

        var json = '{"name":"' + personName + '"}'

        $.ajax({
            type: "POST",
            url: addPersonToGroupApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: json
        }).done(function (data) {
            $("#StatusLabel").text("Created person " + personName + " in Group " + groupId);

        }).fail(function (err) {
            status += "Failed to create person " + personName
                + " in Group " + groupId + "<br>"
                + err.responseText;
            $("#StatusLabel").html(status);
        });
    };

    var checkTrainingStatus = function (groupId) {
        // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/training
        if (!groupId) {
            $("#StatusLabel").text("No GroupID specified");
            return "No GroupID specified";
        }

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        var checkTrainingStatusApiUrl = faceApiUrl + "persongroups/"
            + groupId
            + "/training";

        $.ajax({
            type: "GET",
            url: checkTrainingStatusApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            body: "{}"
        }).done(function (data) {
            $("#StatusLabel").text(
                "Training status for group " + groupId + ":"
                + data.status
            );
            return "Training status for group " + groupId + ":" + data.status + "!!!";
        }).fail(function (err) {
            status += "Error checking Training status for group " + groupId + "<br>"
                + err.responseText;
            $("#StatusLabel").html(status);
            return status;
        });
    };


    var identifyFaces = function (groupId, faceIds) {

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        // https://westus.api.cognitive.microsoft.com/face/v1.0/identify
        var identifyApiUrl = faceApiUrl + "identify";

        var body = '{'
            + '"personGroupId":"' + groupId + '",'
            + '"faceIds":[' + faceIds + '],'
            + '"maxNumOfCandidatesReturned":1,'
            + '"confidenceThreshold": 0.5'
            + '}';

        $.ajax({
            type: "POST",
            url: identifyApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: body,
            processData: false
        }).done(function (data) {
            var output = "<h3>Matching faces</h3>"
            if (data.length) {
                data.forEach(
                    function (foundFace, index) {
                        var bestMatch = foundFace.candidates[0];
                        var personId = bestMatch.personId;
                        var confidence = bestMatch.confidence;
                        // TODO: Get name of bestMatch

                        var getPersonApiUrl = faceApiUrl + "persongroups/"
                            + groupId
                            + "/persons/"
                            + personId;
                        $.ajax({
                            type: "GET",
                            url: getPersonApiUrl,
                            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
                            contentType: "application/json",
                            processData: false
                        }).done(function (data) {
                            var personName = data.name;
                            output += "Name: " + personName;
                            //output += "Id: " + personId;
                            output += " (Confidence: " + (confidence * 100).toFixed(2) + "%)<br>";
                            $("#MatchFaceOutputDiv").html(output);
                        })
                    }
                )
            }
            else {
                output = "No matching faces found";
                $("#MatchFaceOutputDiv").html(output);
            }

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#MatchFaceOutputDiv").text(status);
        });
    };

    var detectFace = function (groupId, face) {

        var subscriptionKey = getKey() || "Copy your Subscription key here";

        // https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false
        var identifyApiUrl = faceApiUrl + "detect?returnFaceId=true";

        $.ajax({
            type: "POST",
            url: identifyApiUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/octet-stream",
            data: face,
            processData: false
        }).done(function (data) {
            if (data.length) {
                var faceIds = "";
                data.forEach(
                    function (face, index) {
                        var faceId = face.faceId;
                        if (index > 1) {
                            faceId += ",";
                        }
                        faceIds += '"' + faceId + '"';
                    }
                )
                identifyFaces(groupId, faceIds);
            }

        }).fail(function (err) {
            var status = "ERROR! " + err.responseText;
            $("#StatusLabel").text(status);
        });
    };




    // https://face.lifeishao.com/#/
    // https://github.com/howlowck/train-faces/blob/master/src/support/helpers.js
    // https://github.com/howlowck/train-faces/tree/master/src



    // BUTTON CLICKS
    $("#ListAllGroupsButton").click(function () {
        listAllGroups();
    })

    $("#DeleteAllGroupsButton").click(function () {
        deleteAllGroups();
    })

    $("#AddFacesToGroupButton").click(function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            status += "No Group selected";
            return;
        }

        var groupId = $("#GroupList").val();
        var personId = $("#PersonDropDown").val(); //"ac9c2896-183f-4780-b193-ed55ae5eeb6e"; // TODO: Select / add person

        var fileSelector = $("#PhotoToUpload");
        var files = fileSelector[0].files;
        if (files) {
            // At least 1 file selected. Add to group.
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                addFaceToPerson(personId, groupId, file);
            }
        }
    })

    $("#CreateGroupButton").click(function () {
        var groupId = $("#GroupNameTextBox").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }
        console.log("click");
        var status = createGroup(groupId);
    });

    //AddPersonToGroupButton
    $("#AddPersonToGroupButton").click(function () {
        var groupId = $("#GroupList").val();
        var personName = $("#PersonNameTextBox").val();
        if (!groupId) {
            $("#StatusLabel").text("No Group specified");
            return;
        }
        if (!personName) {
            $("#StatusLabel").text("No Person Name specified");
            return;
        }
        var status = addPersonToGroup(groupId, personName);
    });


    $("#GetPersonsInGroupButton").click(function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }
        var groupList = getPersonsInGroup(groupId);
    })

    //TrainGroupButton
    $("#TrainGroupButton").click(function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }
        trainGroup(groupId);
    })

    // CheckTrainingStatusButton
    $("#CheckTrainingStatusButton").click(function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }

        checkTrainingStatus(groupId);
    })

    // IdentifyFacesButton
    $("#IdentifyFacesButton").click(function () {

        $("#MatchFaceOutputDiv").html("Working...");

        var groupId = $("#GroupList").val();
        if (!groupId) {
            status += "No Group selected";
            return;
        }

        var groupId = $("#GroupList").val();

        var fileSelector = $("#TestPhoto");
        var files = fileSelector[0].files;
        if (files) {
            // At least 1 file selected. Test it
            var file = files[0];

            detectFace(groupId, file);
        }
    })


    listAllGroups();

    console.log("done");

});

