"use strict";

class MyEvent {
    constructor(myEventName, description, location, startDate, endDate, pictures, keywords, author) {
        this.myEventName = myEventName;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pictures = pictures;
        this.keywords = keywords;
        this.author = author;
    }

    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    get name() {
        return this._name;
    }
}

module.exports = MyEvent;