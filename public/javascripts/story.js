'use strict';

var video, canvas;

var constraints = {
    audio: false,
    video: {facingMode: 'user'}
};

function hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
}

function handleSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function setupPictureRemoval() {
    if (!!('ontouchstart' in window)) {
        $('.image-list-item').click(function (e) {
            e.stopImmediatePropagation();

            $(this).children('.picture-remove').click(function () {
                this.parentNode.remove();
            })
        }).hover(function () {
            /* This is empty because click function already handles it */
        }, function () {
            $(this).children('.picture-remove').off('click');
        })
    } else {
        $('.picture-remove').click(function () {
            this.parentNode.remove();
        })
    }
}

function createPictureHTML(pictureData) {
    return "<li class=\"image-list-item list-group-item\">\n" +
        "<img src=\"" + pictureData + "\" class=\"img-fluid\">\n" +
        "<span class=\"picture-remove far fa-times-circle\"></span>\n" +
        "</li>"
}

function addPictureToPost() {
    console.log("Clicked");
    var picture = canvas.toDataURL('image/png');
    var picturesDiv = $('#collapsePictures');
    picturesDiv.children('.list-group').append(createPictureHTML(picture));
    setupPictureRemoval();
}

function setupPictureCamera() {
    if (!hasGetUserMedia()) {
        alert("Device is missing camera!");
    } else {
        var snapshotButton = $("#picture-snapshot-button");
        var retryButton = $("#picture-retry-button");
        var savePictureButton = $("#picture-save-button");
        var retryButtons = $(".btn-retry");

        retryButtons.hide();
        canvas.style.display = "none";
        snapshotButton.show();
        video.style.display = "inline";

        snapshotButton.click(function () {
            snapshotButton.hide();
            video.style.display = "none";

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.style.display = "inline";
            retryButtons.show();
        });
        retryButton.click(function () {
            canvas.style.display = "none";
            retryButtons.hide();

            snapshotButton.show();
            video.style.display = "inline";
        });
        savePictureButton.off('click').click(addPictureToPost);

        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    }
}

function toJSON(serializedArray) {
    var data = {};
    for (var index in serializedArray) {
        data[serializedArray[index].name] = serializedArray[index].value;
    }
    return data;
}

function sendAjaxRequest(url, data) {
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        data: data,
        success: function (data) {
            console.log("Success!");
        },
        fail: function (e) {
            console.log("Failed");
            console.log("Storing data in IndexedDB...");
        }
    });
}

function submitPost() {
    let postForm = $('#post-form');
    let story = postForm.serializeArray();
    let pictures = [];
    $(".image-list-item").children("img").each(function () {
        pictures.push(this.src);
    });
    story.push({name: 'pictures', value: pictures});
    story.push({name: 'myevent', value: $('#story-submit').val()});
    story.push({name: 'author', value: localStorage.getItem("currentUser")});
    sendAjaxRequest("/story/new", story);
    let storyJSON = toJSON(story);
    console.log(story);
    console.log(storyJSON);
    cacheNewStory(storyJSON, function () {
        postForm.submit();
    });
}

$(document).ready(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('event-id')) {
        let eventId = urlParams.get('event-id');
        // let myEvent = getCachedMyEvent(eventId);
        // myEvent.then(function (myEvent) {
        //     $('#new-post-title').text("New Post on \"" + myEvent.name + "\"");
        //     $('#story-submit').val(myEvent.id);
        // });
        $('#story-submit').val(eventId);
    }

    video = document.querySelector('video');
    canvas = window.canvas = document.querySelector('canvas');

    $("#camera").click(setupPictureCamera);

    $("#story-submit").click(submitPost);

    setupPictureRemoval();
});
