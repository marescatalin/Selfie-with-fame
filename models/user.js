"use strict";

class User {
    constructor(username, password, bio) {
        this._username = username;
        this._password = password;
        this._bio = bio;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }

    get bio() {
        return this._bio;
    }

    set username(value) {
        this._username = value;
    }

    set password(value) {
        this._password = value;
    }

    set bio(value) {
        this._bio = value;
    }
}

module.exports = User;