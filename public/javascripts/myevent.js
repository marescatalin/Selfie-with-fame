'use strict';

function readUploadedFileAsData(inputFile) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
    });
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
        "<img src=\"" + pictureData + "\" class=\"img-fluid\">\n" +
        "<span class=\"picture-remove far fa-times-circle\"></span>\n" +
        "</li>"
}

function addPictureToEvent(pictureData) {
    var picturesDiv = $('#collapseEventPictures').children('.list-group');
    picturesDiv.append(createPictureHTML(pictureData));
}

function toJSON(serializedArray) {
    var data = {};
    for (var index in serializedArray) {
        data[serializedArray[index].name] = serializedArray[index].value;
    }
    return data;
}

function findLocation(address, callback) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': address}, function(results, status) {
        if (status === 'OK') {
            callback(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
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

    $('#upload').click(async function () {
        let imgFile = $(this).prev('input[name=file]')[0].files[0];
        try {
            let imgData = await readUploadedFileAsData(imgFile);
            addPictureToEvent(imgData);
            setupPictureRemoval();
        } catch (e) {
            console.log(e.message);
        }
    });

    $('#myevent-submit').click(function () {
        let form = $('#post-form');
        let formData = form.serializeArray();
        let pictures = [];
        $(".image-list-item").children("img").each(function () {
            pictures.push(this.src);
        });
        formData.push({name: 'pictures', value: pictures});
        formData.push({name: 'author', value: localStorage.getItem('currentUser')});
        findLocation($('#myevent-postcode').val(), function (loc) {
                let location = {lat: loc.lat(), lng: loc.lng()};
                formData.push({name: 'location', value: location});

                let jsonData = toJSON(formData);
                jsonData.startDate = new Date(jsonData.startDate);
                jsonData.endDate = new Date(jsonData.endDate);
                $.post("/myevent/new", jsonData).success( function (data) {
                    console.log("Success!");
                    cacheNewMyEvent(jsonData);
                    //window.location.replace(window.location.origin + "/map");
                }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to send");
                    jsonData.isPosted = false;
                    cacheNewMyEvent(jsonData);
                });
            });
    });
});
