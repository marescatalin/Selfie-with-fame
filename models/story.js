"use strict";

class Story {
    constructor(title, message, date, pictures, myEvent, author) {
        this.title = title;
        this.message = message;
        this.date = date;
        this.pictures = pictures;
        this.myEvent = myEvent;
        this.author = author
    }

    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    get name() {
        return this._name;
    }
}

module.exports = Story;