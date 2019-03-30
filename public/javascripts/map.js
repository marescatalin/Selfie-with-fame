function initialize() {

    let getLocation = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    };

    function displayMap(loc){
        let myLat = loc.coords.latitude;
        let myLng = loc.coords.longitude;

        let mapOptions = {
            zoom: 15,
            center: {lat: myLat, lng: myLng}
        };
        let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);// To add the marker to the map, use the 'map' property

        // myEvents.forEach(function(myEvent){
        //     if (myEvent.end && myEvent.start) {
        //         let marker = new google.maps.Marker({
        //             title: myEvent.name,
        //             position: {lat: myEvent.location.lat, lng: myEvent.location.lng},
        //             map: map
        //         });
        //
        //         let infoWindow = new google.maps.InfoWindow({
        //             content: myEvent.name + " " + myEvent.start + " - " + myEvent.end,
        //             maxWidth:400
        //         });
        //
        //         marker.addListener('click', function() {
        //             infoWindow.open(marker.get('map'), marker);
        //         });
        //     }
        // });
    }
    let loadMap = function () {
        getLocation()
            .then(function (loc) {
                if (loc) {
                    displayMap(loc);
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
    };

    loadMap();
}

function update_map() {
    search_param = $("#event-search-bar")[0].value;
    filtered_events = [];

    myEvents.forEach(function (myEvent){
        if (myEvent.keyword == search_param || myEvent.location == search_param) {
            filtered_events.push(myEvent);
        }
    });

    let getLocation = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    };

    let loadMap = function () {
        getLocation()
            .then(function (loc) {
                if (loc) {
                    displayMap(loc);
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
    };


    loadMap();
    let myLat = loc.coords.latitude;
    let myLng = loc.coords.longitude;
    let mapOptions = {
        zoom: 15,
        center: {lat: myLat, lng: myLng}
    };

    let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);// To add the marker to the map, use the 'map' property

    filtered_events.forEach(function(myEvent){

        if (myEvent.end && myEvent.start) {
            let marker = new google.maps.Marker({
                title: myEvent.name,
                position: {lat: myEvent.location.lat, lng: myEvent.location.lng},
                map: map
            });

            let infoWindow = new google.maps.InfoWindow({
                content: myEvent.name + " " + myEvent.start + " - " + myEvent.end,
                maxWidth:400
            });

            marker.addListener('click', function() {
                infoWindow.open(marker.get('map'), marker);
            });
        }
    });
}

var myUsers = [];
var myEvents = [];
var myStories = [];

$(document).ready(function(){

    $("#event-search-button").click(update_map);

    myUsers = JSON.parse(document.getElementById("myUsers").innerText);
    myEvents = JSON.parse(document.getElementById("myEvents").innerText);
    myStories = JSON.parse(document.getElementById("myStories").innerText);
});

google.maps.event.addDomListener(window, 'load', initialize);

