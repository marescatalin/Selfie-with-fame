function initialize() {

    geocoder = new google.maps.Geocoder();

    getLocation()
        .then(function (loc) {
            if (loc) {
                displayMap(loc,myEvents);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        })
        .catch(function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    break;
            }
        })
}

function update_map() {
    search_param = $("#event-search-bar")[0].value;
    filtered_events = [];

    myEvents.forEach(function (myEvent){
        now = new Date();
        if (myEvent.keyword == search_param || myEvent.postcode.includes(search_param) || myEvent.address.includes(search_param) || (myEvent.start < now && myEvent.end > now)) {
            filtered_events.push(myEvent);
        }
    });

    getLocation()
        .then(function (loc) {
            if (loc) {
                displayMap(loc, filtered_events);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        })
        .catch(function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    break;
            }
        })
}

function getLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

function displayMap(loc,curr_events){
    let myLat = loc.coords.latitude;
    let myLng = loc.coords.longitude;

    let mapOptions = {
        zoom: 15,
        center: {lat: myLat, lng: myLng}
    };
    let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);// To add the marker to the map, use the 'map' property

    curr_events.forEach(function(myEvent){
        if (myEvent.endDate && myEvent.startDate) {
            let marker = new google.maps.Marker({
                title: myEvent.myEventName,
                position: {lat: myEvent.location.lat, lng: myEvent.location.lng},
                map: map
            });

            let infoWindow = new google.maps.InfoWindow({
                content: myEvent.myEventName + " " + myEvent.keywords,
                maxWidth:400
            });

            marker.addListener('click', function() {
                infoWindow.open(marker.get('map'), marker);
            });
        }
    });
}



$(document).ready(function(){

    var user1 = {username: 'user1', password: '123', bio: 'bio1'};
    var user2 = {username: 'user2', password: '123', bio: 'bio2'};
    storeCachedData(user1);
    storeCachedData(user2);

    var event1 = {myEventName: 'event1', description: 'test event 1', location: {lat: 53.372900, lng: -1.506912}, startDate: new Date(2019,2,10), endDate: new Date(2019,4,20), keywords: 'key1', author: 'user1'};
    var event2 = {myEventName: 'event2', description: 'test event 2', location: {lat: 53.372417, lng: -1.504116}, startDate: new Date(2019,2,15), endDate: new Date(2019,5,20), keywords: 'key2', author: 'user1'};
    cacheNewMyEvent(event1);
    cacheNewMyEvent(event2);

    var story1 = {myevent: 'event1', author: 'user1', title: 'story1', message: 'comm1', date: new Date(2019,3,20)};
    var story2 = {myevent: 'event1', author: 'user1', title: 'story2', message: 'comm2', date: new Date(2019,3,21)};
    var story3 = {myevent: 'event2', author: 'user2', title: 'story3', message: 'comm3', date: new Date(2019,3,22)};
    cacheNewStory(story1);
    cacheNewStory(story2);
    cacheNewStory(story3);

    $("#event-search-button").click(update_map);

    myUsers = JSON.parse(document.getElementById("myUsers").innerText);
    myEvents = JSON.parse(document.getElementById("myEvents").innerText);
    myStories = JSON.parse(document.getElementById("myStories").innerText);
});

google.maps.event.addDomListener(window, 'load', initialize);

