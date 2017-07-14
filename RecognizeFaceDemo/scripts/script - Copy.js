$(function () {

    const faceApiUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0/";

    var createGroup = function (groupId) {
        return new Promise((resolve, reject) => {

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
                // $("#StatusLabel").text(status);
                resolve(status);

            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                // $("#StatusLabel").text(status);
                reject(status);
            });
        })
    };

    var listAllGroups = function () {
        return new Promise((resolve, reject) => {
            var subscriptionKey = getKey() || "Copy your Subscription key here";
            var listGroupApiUrl = faceApiUrl + "persongroups?top=100";
            var output = "";

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
                resolve(status);
                //$("#StatusLabel").text(status);

            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                reject(status);
                // $("#StatusLabel").text(status);
            });
        })
    };

    var deleteAllGroups = function () {
        return new Promise((resolve, reject) => {
            var subscriptionKey = getKey() || "Copy your Subscription key here";
            var getGroupApiUrl = faceApiUrl + "persongroups?top=100";
            // $("#StatusLabel").html("Working...<br>");

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
                                // $("#StatusLabel").html(status);


                            }).fail(function (err) {
                                status += "Failed to delete group " + groupId + "<br>";
                                // $("#StatusLabel").html(status);
                            });

                        }
                    )
                }
                resolve(status);
                // $("#StatusLabel").text(status);

            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                reject(status);
                // $("#StatusLabel").text(status);

            });
        })
    };

    var addPersonToGroup = function (groupId, personName) {
        return new Promise((resolve, reject) => {
            // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons
            if (!groupId || !personName) {
                reject("Missing info");
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
                status = "Created person " + personName + " in Group " + groupId;
                resolve(status);
                // $("#StatusLabel").text("Created person " + personName + " in Group " + groupId);

            }).fail(function (err) {
                status += "Failed to create person " + personName
                    + " in Group " + groupId + "<br>"
                    + err.responseText;
                reject(status);
                // $("#StatusLabel").html(status);
            });
        })
    };

    var getPersonsInGroup = function (groupId) {
        return new Promise((resolve, reject) => {

            if (!groupId) {
                reject("No GroupID specified");
                // $("#StatusLabel").text("No GroupID specified");
            }

            var subscriptionKey = getKey() || "Copy your Subscription key here";

            var getPersonsInGroupApiUrl = faceApiUrl + "persongroups/"
                + groupId
                + "/persons?top=1000"

            var personsList = ""

            var personDropDown = $("#PersonDropDown");
            personDropDown.innerHtml = "";

            $.ajax({
                type: "GET",
                url: getPersonsInGroupApiUrl,
                headers: { "Ocp-Apim-Subscription-Key": subscriptionKey }
            }).done(function (data) {
                if (data.length) {
                    personsList = "<h3>Persons in Group " + groupId + "</h3>"
                    personsList += "<ul>"
                    data.forEach(function (person) {

                        // List
                        personsList += "<li>" + person.name + " (" + person.personId + ")";

                        // DropDown
                        var personOption = document.createElement("option");
                        personOption.value = person.personId;
                        personOption.text = person.name;
                        personDropDown.append(personOption);


                    }, this);
                    personsList += "</ul>"
                    resolve(personsList);
                    // $("#StatusLabel").html(groupList);
                }
                else {
                    reject("No persons in group");
                    // $("#StatusLabel").text("No persons in group " + groupId);

                }

            }).fail(function (err) {
                status += "Failed to get persons in group " + groupId + "<br>";
                $("#StatusLabel").html(status);
                return status;
            });
        })
    };


    var addFaceToPerson = function (personId, groupId, face) {

        return new Promise((resolve, reject) => {
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
                resolve(status);
                // $("#StatusLabel").text(status);

            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                reject(status);
                // $("#StatusLabel").text(status);
            });
        })
    };

    var trainGroup = function (groupId) {
        return new Promise((resolve, reject) => {
            // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/train
            if (!groupId) {
                reject("No Group specified");
                // $("#StatusLabel").text("No GroupID specified");
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
                // $("#StatusLabel").text("Started training group " + groupId);
                resolve(status);
            }).fail(function (err) {
                status += "Failed to train  group " + groupId + "<br>";
                reject(status);
                // $("#StatusLabel").html(status);
                // return status;
            });
        })
    };

    var checkTrainingStatus = function (groupId) {
        return new Promise((resolve, reject) => {
            // https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/training
            if (!groupId) {
                reject("No group specified");
                // $("#StatusLabel").text("No GroupID specified");
                // return "No GroupID specified";
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
                // $("#StatusLabel").text(
                //     "Training status for group " + groupId + ":"
                //     + data.status
                // );
                // return "Training status for group " + groupId + ":" + data.status + "!!!";
                resolve(
                    "Training status for group " + groupId + ":"
                    + data.status
                );
            }).fail(function (err) {
                status += "Error checking Training status for group " + groupId + "<br>"
                    + err.responseText;
                reject(status);
                // $("#StatusLabel").html(status);
                // return status;
            });
        })
    };


    var identifyFaces = function (groupId, faceIds) {

        // return new Promise((resolve, reject) => {
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
                            // Get name of bestMatch

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
                                // $("#MatchFaceOutputDiv").html(output);
                            })
                        }
                    )
                }
                else {
                    //reject("No matching faces found");
                    output += "No matching faces found";
                    // $("#MatchFaceOutputDiv").html(output);
                }

                return output;
                //resolve(output);
            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                return status;
                // reject(status);
                // $("#MatchFaceOutputDiv").text(status);
            });
        // })
    };

    var detectFace = function (groupId, face) {

        return new Promise((resolve, reject) => {
            var subscriptionKey = getKey() || "Copy your Subscription key here";

            // https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false
            var identifyApiUrl = faceApiUrl + "detect?returnFaceId=true";

            var output = "";

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
                    output +=  identifyFaces(groupId, faceIds);
                    
                    resolve(output);
                }

            }).fail(function (err) {
                var status = "ERROR! " + err.responseText;
                reject(status);
                // $("#StatusLabel").text(status);
            });
        })
    };



    // Inspiration:
    // https://face.lifeishao.com/#/
    // https://github.com/howlowck/train-faces/blob/master/src/support/helpers.js
    // https://github.com/howlowck/train-faces/tree/master/src



    // BUTTON CLICKS
    $("#CreateGroupButton").click(async function () {
        var groupId = $("#GroupNameTextBox").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }
        console.log("click");
        var status = await createGroup(groupId);
        await listAllGroups();
        $("#StatusLabel").text(status);
    });

    $("#ListAllGroupsButton").click(async function () {
        var status = await listAllGroups();
        $("#StatusLabel").text(status);
    })

    $("#DeleteAllGroupsButton").click(async function () {
        var status = await deleteAllGroups();
        status = await listAllGroups();
        $("#StatusLabel").text(status);

    })

    //AddPersonToGroupButton
    $("#AddPersonToGroupButton").click(async function () {
        var groupId = $("#GroupList").val();
        var personName = $("#PersonNameTextBox").val();
        if (!groupId) {

            $("#PersonsStatusLabel").text("No Group specified");
            // $("#StatusLabel").text("No Group specified");
            return;
        }
        if (!personName) {
            $("#PersonsStatusLabel").text("No Person Name specified");
            // $("#StatusLabel").text("No Person Name specified");
            return;
        }
        var status = await addPersonToGroup(groupId, personName);
        $("#PersonsStatusLabel").text(status);
        var personsList = await getPersonsInGroup(groupId);
        $("#PersonsList").html(personsList);

    });

    $("#GetPersonsInGroupButton").click(async function () {
        $("#PersonsList").text("Waiting...");
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#PersonsStatusLabel").text(status);
            return;
        }
        var personsList = await getPersonsInGroup(groupId);
        $("#PersonsList").html(personsList);
        $("#PersonsStatusLabel").text("Done");
    })

    $("#AddFacesToPersonButton").click(async function () {
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
            var status = "";
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                status += await addFaceToPerson(personId, groupId, file);
                $("#PersonsStatusLabel").text(status);

            }
        }
    })

    //TrainGroupButton
    $("#TrainGroupButton").click(async function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#PersonsStatusLabel").text(status);
            return;
        }
        var status = await trainGroup(groupId);

        $("#PersonsStatusLabel").text(status);
    })

    // CheckTrainingStatusButton
    $("#CheckTrainingStatusButton").click(async function () {
        var groupId = $("#GroupList").val();
        if (!groupId) {
            var status = "No GroupID specified";
            $("#StatusLabel").text(status);
            return;
        }

        var status = await checkTrainingStatus(groupId);
        $("#PersonsStatusLabel").text(status);
    })

    // IdentifyFacesButton
    $("#IdentifyFacesButton").click(async function () {

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

            var output = await detectFace(groupId, file);
            $("#MatchFaceOutputDiv").html(output);

        }
    })


    listAllGroups();

    console.log("done");

});

