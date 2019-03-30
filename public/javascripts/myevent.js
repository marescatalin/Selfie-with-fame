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

$(document).ready(function () {
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
        let jsonData = toJSON(formData);
        cacheNewMyEvent(jsonData, function () {form.submit()});
    });
});
