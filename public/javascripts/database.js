////////////////// DATABASE //////////////////
// the database receives from the server the following structures
/**
 * class Story {
    constructor(title, message, date, pictures, myEvent, author) {
        this.title = title;
        this.message = message;
        this.date = date;
        this.pictures = pictures;
        this.myEvent = myEvent;
        this.author = author
    }}

 class MyEvent {
    constructor(myEventName, description, location, startDate, endDate, pictures, keywords, author) {
        this.myEventName = myEventName;
        this.description = description;
        this.location = location
        this.startDate = startDate;
        this.endDate = endDate;
        this.pictures = pictures;
        this.keywords = keywords;
        this.author = author;
    }}
 class User {
    constructor(username, password, bio) {
        this.username = username;
        this.password = password;
        this.bio = bio;
    }}
 *
 */

var dbPromise;

const SELFIE_DB_NAME = 'db_selfie_fame_1';
const STORY_STORE_NAME ='stories';
const MYEVENT_STORE_NAME = 'myevents';
const USER_STORE_NAME = 'users';

const STORES = [STORY_STORE_NAME, MYEVENT_STORE_NAME, USER_STORE_NAME];
/**
 * it inits the database
 */
function initDatabase (){
    dbPromise = idb.openDb(SELFIE_DB_NAME, 1, function (upgradeDb) {
        console.log(upgradeDb.objectStoreNames);
        STORES.forEach(function (store) {
            if (!upgradeDb.objectStoreNames.contains(store)) {
                initStores(upgradeDb, store);
            }
        });
    });
    console.log(dbPromise);
    return dbPromise;
}

function initStores(upgradeDb, store) {
    switch (store) {
        case STORY_STORE_NAME:
            initStoryStore(upgradeDb);
            break;
        case MYEVENT_STORE_NAME:
            initMyEventStore(upgradeDb);
            break;
        case USER_STORE_NAME:
            initUserEventStore(upgradeDb);
            break;
    }
}

// title, message, date, pictures, myEvent, author
function initStoryStore(upgradeDb) {
    let storyDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    storyDB.createIndex('myevent', 'myevent', {unique: false});
    storyDB.createIndex('author', 'author', {unique: false});
    storyDB.createIndex('title', 'title', {unique: false});
    storyDB.createIndex('message', 'message', {unique: false});
    storyDB.createIndex('date', 'date', {unique: false});
    storyDB.createIndex('pictures', 'pictures', {unique: false});
}

// myEventName, description, location, startDate, endDate, pictures, keywords, author
function initMyEventStore(upgradeDb) {
    let storyDB = upgradeDb.createObjectStore(MYEVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    storyDB.createIndex('myEventName', 'myEventName', {unique: false});
    storyDB.createIndex('description', 'description', {unique: false});
    storyDB.createIndex('location', 'location', {unique: false});
    storyDB.createIndex('startDate', 'startDate', {unique: false});
    storyDB.createIndex('endDate', 'endDate', {unique: false});
    storyDB.createIndex('pictures', 'pictures', {unique: false});
    storyDB.createIndex('keywords', 'keywords', {unique: false, multiEntry: true});
    storyDB.createIndex('author', 'author', {unique: false});
}



function initUserEventStore(upgradeDb){
    let storyDB = upgradeDb.createObjectStore(USER_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    storyDB.createIndex('username', 'username', {unique: true});
    storyDB.createIndex('password', 'password', {unique: false});
    storyDB.createIndex('bio', 'bio', {unique: false});
}

function storeCachedData(user, resolve) {
    console.log('inserting: '+JSON.stringify(user));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(USER_STORE_NAME, 'readwrite');
            var store = tx.objectStore(USER_STORE_NAME);
            await store.put(user);
            console.log(JSON.stringify(user));
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(USER_STORE_NAME));
            if(resolve) {
                resolve();
            }
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(USER_STORE_NAME) ,JSON.stringify(USER_STORE_NAME));
        });
    }
}

function getLoginData(user) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching user from database');
            var tx = db.transaction(USER_STORE_NAME, 'readonly');
            var store = tx.objectStore(USER_STORE_NAME);
            var index = store.index('username');
            return index.get(IDBKeyRange.only(user.username));
        }).then(function (foundObject) {
            return (foundObject && (foundObject.username==user.username &&
                foundObject.password===user.password));
        });
    }
}


function cacheNewMyEvent(myEvent, resolve, reject) {
    console.log('inserting: ' + JSON.stringify(myEvent));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(MYEVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(MYEVENT_STORE_NAME);
            await store.put(myEvent);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! ' + JSON.stringify(myEvent));
            if (resolve) {
                resolve();
            }
        }).catch(function (error) {
            if (reject) {
                reject(error);
            }
        });
    }
}
