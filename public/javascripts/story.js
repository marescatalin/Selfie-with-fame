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
    if(!!('ontouchstart' in window)) {
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
                "<img src=\""+ pictureData + "\" class=\"img-fluid\">\n" +
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
    var data={};
    for (var index in serializedArray){
        data[serializedArray[index].name]= serializedArray[index].value;
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
    var story = $("#post-form").serializeArray();
        var pictures = [];
        $(".image-list-item").children("img").each(function () {
            pictures.push(this.src);
        });
        story.push({name:'pictures', value:pictures});
    sendAjaxRequest("/story/new", story);
}

$(document).ready(function () {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    video = document.querySelector('video');
    canvas = window.canvas = document.querySelector('canvas');

    $("#camera").click(setupPictureCamera);

    $("#story-submit").click(submitPost);

    setupPictureRemoval();
});
