function initialize() {

    getLocation()
        .then(function (loc) {
            if (loc) {
                displayMap(loc, myEvents);
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

    myEvents.forEach(function (myEvent) {
        if (myEvent.keyword == search_param || myEvent.location == search_param) {
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

function myEventCardHtml(myEvent) {
    let banner = ""
    if  (myEvent.pictures.length > 0) {
        banner = myEvent.pictures[0];
    }
    return  "<div class=\"card mb-3\" style=\"max-width: 540px;\">\n" +
            "  <div class=\"row no-gutters\">\n" +
            "    <div class=\"col-md-4\">\n" +
            "      <img src=\"" + banner + "\" class=\"card-img\" alt=\"...\">\n" +
            "    </div>\n" +
            "    <div class=\"col-md-8\">\n" +
            "      <div class=\"card-body\">\n" +
            "        <h5 class=\"card-title\">" + myEvent.title + "</h5>\n" +
            "        <p class=\"card-text\">" + myEvent.description + "</p>\n" +
            "        <p class=\"card-text\"><small class=\"text-muted\">Last updated 3 mins ago</small></p>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>"
}

function getLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

function displayMap(loc, curr_events) {
    let myLat = loc.coords.latitude;
    let myLng = loc.coords.longitude;

    let mapOptions = {
        zoom: 15,
        center: {lat: myLat, lng: myLng}
    };
    let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);// To add the marker to the map, use the 'map' property

    curr_events.forEach(function (myEvent) {
        if (myEvent.end && myEvent.start) {
            let marker = new google.maps.Marker({
                title: myEvent.name,
                position: {lat: myEvent.location.lat, lng: myEvent.location.lng},
                map: map
            });

            let infoWindow = new google.maps.InfoWindow({
                content: myEventCardHtml(myEvent),
                maxWidth: 400
            });

            marker.addListener('click', function () {
                infoWindow.open(marker.get('map'), marker);
            });
        }
    });
}

var myUsers = [];
var myEvents = [];
var myStories = [];

$(document).ready(function () {

    $("#event-search-button").click(update_map);

    myUsers = JSON.parse(document.getElementById("myUsers").innerText);
    myEvents = JSON.parse(document.getElementById("myEvents").innerText);
    console.log(myEvents);
    myStories = JSON.parse(document.getElementById("myStories").innerText);
});

google.maps.event.addDomListener(window, 'load', initialize);

