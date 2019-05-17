'use strict';
let fs = require('fs');

exports.savePictures = function (pictures, userId) {
    let targetDirectory = './private/images/' + userId + '/';
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory,  {recursive: true}, err => {});
    }
    let currentTime = new Date().getTime();
    console.log('saving pictures to ' + targetDirectory + currentTime);

    let picturePaths = [];
    if(!Array.isArray(pictures)) {
        pictures = [pictures]
    }
    pictures.forEach(function (picture, index) {
        // strip off the data: url prefix to get just the base64-encoded bytes
        let imageBlob = picture.replace(/^data:image\/\w+;base64,/, "");
        let buf = new Buffer(imageBlob, 'base64');
        let filePath = targetDirectory + currentTime + index + '.png';
        fs.writeFile(filePath, buf, (err) => {console.log(err)});
        picturePaths.push(filePath);
        console.log('file saved!');
    });
    return picturePaths
};