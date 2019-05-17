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

// inits the stores
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
    let storyStore = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    storyStore.createIndex('myevent', 'myevent', {unique: false});
    storyStore.createIndex('author', 'author', {unique: false});
    storyStore.createIndex('title', 'title', {unique: false});
    storyStore.createIndex('message', 'message', {unique: false});
    storyStore.createIndex('date', 'date', {unique: false});
    storyStore.createIndex('pictures', 'pictures', {unique: false});
}

// myEventName, description, location, startDate, endDate, pictures, keywords, author
function initMyEventStore(upgradeDb) {
    let myEventStore = upgradeDb.createObjectStore(MYEVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    myEventStore.createIndex('name', 'name', {unique: false});
    myEventStore.createIndex('description', 'description', {unique: false});
    myEventStore.createIndex('location', 'location', {unique: false})
    myEventStore.createIndex('address', 'address', {unique: false});
    myEventStore.createIndex('postcode', 'postcode', {unique: false});
    myEventStore.createIndex('startDate', 'startDate', {unique: false});
    myEventStore.createIndex('endDate', 'endDate', {unique: false});
    myEventStore.createIndex('pictures', 'pictures', {unique: false});
    myEventStore.createIndex('keywords', 'keywords', {unique: false, multiEntry: true});
    myEventStore.createIndex('author', 'author', {unique: false});
}


// inits user events store
function initUserEventStore(upgradeDb){
    let userStore = upgradeDb.createObjectStore(USER_STORE_NAME, {keyPath: 'id', autoIncrement: true});
    userStore.createIndex('username', 'username', {unique: true});
    userStore.createIndex('password', 'password', {unique: false});
    userStore.createIndex('bio', 'bio', {unique: false});
}

// caches user data
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

// clears cache
function clearCache(store_name, resolve, reject) {
    console.log("Clearning " + store_name + " cache");
    if(dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(store_name, 'readwrite');
            var store = tx.objectStore(store_name);
            await store.clear();
            return tx.complete;
        }).then(function () {
            console.log('cleared ' + store_name + ' cache');
            if (resolve) {
                resolve();
            }
        }).catch(function (error) {
            localStorage.setItem("Error", error);
            if (reject) {
                reject(error);
            }
        });
    }
}

// gets login data
async function getLoginData(user) {
    if (dbPromise) {
        return dbPromise.then(function (db) {
            console.log('fetching user from database');
            var tx = db.transaction(USER_STORE_NAME, 'readonly');
            var store = tx.objectStore(USER_STORE_NAME);
            var index = store.index('username');
            return index.get(IDBKeyRange.only(user.username));
        }).then(function (foundObject) {
            return (foundObject && (foundObject.username == user.username &&
                foundObject.password == user.password));
        });
    }
    else{
        return false;
    }

}

// caches story
function cacheNewStory(story, resolve, reject) {
    console.log('inserting: ' + JSON.stringify(story));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(STORY_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORY_STORE_NAME);
            await store.put(story);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! ' + JSON.stringify(story));
            if (resolve) {
                resolve();
            }
        }).catch(function (error) {
            localStorage.setItem("Error", error);
            if (reject) {
                reject(error);
            }
        });
    }
}

// caches event
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
            localStorage.setItem("Error", error)
            if (reject) {
                reject(error);
            }
        });
    }
}

// retrieves cached events
async function getCachedMyEvents() {
    if (dbPromise) {
        return dbPromise.then(function (db) {
            console.log('fetching myEvents');
            var tx = db.transaction(MYEVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(MYEVENT_STORE_NAME);
            var index = store.index('name');
            return index.getAll();
        }).then(function (myEvents) {
            if (myEvents){
                console.log("Successfuly fetched", myEvents);
                return myEvents;
            }
        });
    }
}

// retrieves stories for event
async function getCachedMyEventStories(myEventId) {
    if (dbPromise) {
        return dbPromise.then(function (db) {
            console.log('fetching Stories for event ' + myEventId);
            var tx = db.transaction(STORY_STORE_NAME, 'readonly');
            var store = tx.objectStore(STORY_STORE_NAME);
            var index = store.index('myevent');
            return index.getAll(IDBKeyRange.only(myEventId.toString()));
        }).then(function (stories) {
            console.log("Successfuly fetched ", stories);
            if (stories) {
                return stories;
            }
        }).catch(function (error) {
            localStorage.setItem("error", error);
        })
    }
}

// retrieves events
async function getCachedMyEvent(id) {
    if (dbPromise) {
        return dbPromise.then(function (db) {
            console.log('fetching myEvent with id ' + id);
            var tx = db.transaction(MYEVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(MYEVENT_STORE_NAME);
            return store.get(id);
        }).then(function (myEvent) {
            if (myEvent){
                console.log("Successfuly fetched", myEvent);
                return myEvent;
            } else {
                console.log(myEvent);
            }
        }).catch(function (error) {
            localStorage.setItem("Database error", error);
        });
    }
}
