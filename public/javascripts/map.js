function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

async function initialize() {
        if (getCookie("session") == undefined)
            document.getElementById("user").innerHTML =
                getCookie("permanentSession");
        else
            document.getElementById("user").innerHTML =
                 getCookie("session");

    geocoder = new google.maps.Geocoder();

    await getLocation()
        .then(function (loc) {
            if (loc) {
                map = displayMap(loc, myEvents);
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
    let search_param = $("#event-search-bar")[0].value;
    if (search_param != "") {
        document.getElementById('search-alert').style.visibility = "visible";
        document.getElementById('search-alert').style.height='70px';
        document.getElementById('search-alert').style.padding='5px';
        document.getElementById('search-term').innerHTML = search_param;
    }
    let filtered_events = [];
    if(myEvents) {
        myEvents[0].forEach(function (myEvent) {
            var year = search_param.split("/")[0];
            var month = search_param.split("/")[1] - 1;
            var day = search_param.split("/")[2];
            var date_search = new Date(year, month, day);
            var searchStart = new Date(myEvent.startDate);
            searchStart.setDate(searchStart.getDate() - 1);
            var searchEnd = new Date(myEvent.endDate);
            searchEnd.setDate(searchEnd.getDate() + 1);
            if (myEvent.myEventName.includes(search_param) || myEvent.description.includes(search_param) || myEvent.location.address.includes(search_param) ||
                myEvent.location.postcode.includes(search_param) ||
                (searchStart < date_search && searchEnd > date_search)) {
                filtered_events.push(myEvent);
            }
        });
    }

    getLocation()
        .then(function (loc) {
            if (loc) {
                markers.forEach(marker => marker.setMap(null));
                markers = [];
                filtered_events.forEach(filtered_event => addMyEventToMap(filtered_event))
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

function eventInformationHtml(myEvent) {
    return "<p>Description: " + myEvent.description + "</p>" +
        "<p>Address: " + myEvent.location.address + "</p>" +
        "<p>Date: " + new Date(myEvent.startDate).toLocaleString('gb') + " - " + new Date(myEvent.endDate).toLocaleString('gb') + "</p>" +
        "<p>Author: " + myEvent.author + "</p>" +
        "<p>Keywords: " + myEvent.keywords + "</p>" +
        "<button onClick=\"window.location='/chatroom'\" + data-myeventid=\"" + myEvent.id + "\" type=\"button\" class=\"btn btn-dark\">Chat</button>";


}

function createPictureHTML(pictureData) {
    return "<li class=\"image-list-item list-group-item\">\n" +
        "<img src=\"" + pictureData + "\" class=\"img-fluid\">\n" +
        "</li>"
}

function createStoryHtml(story) {
    let pictures = "";
    if(story.pictures.length > 0) {
        story.pictures.forEach(picture => {
            pictures += "<img class=\"img-fluid mb-1\" src=\"" + picture + "\" alt=\"story picture\" >";
        })
    }
    console.log(pictures);

    return "<div class=\"card\">\n" +
        "  <div class=\"card-header\">\n" +
            story.title +
        "  </div>\n" +
        "<div>" + pictures + "</div>" +
        "  <div class=\"card-body\">\n" +
        "    <blockquote class=\"blockquote mb-0\">\n" +
        "      <p>" + story.message + "</p>\n" +
        "      <footer class=\"blockquote-footer\">" + story.author + " at " + new Date(story.createdAt).toLocaleString('gb') + "</footer>\n" +
        "    </blockquote>\n" +
        "  </div>\n" +
        "</div>"
}

function updateMyEventModal(myEvent) {
    let myEventModal = $('#myEventModal');
    myEventModal.find('.modal-title').text(myEvent.myEventName);
    myEventModal.find('.modal-body').html(eventInformationHtml(myEvent));
    $('#new-story-form').find('button').val(myEvent._id);
    if (myEvent.pictures && myEvent.pictures.length > 0) {
        $('#myevent-profile-picture').html("<img class=\"img-fluid\" src=" + myEvent.pictures.pop() + " alt=\"event picture\">");
        let picturesAccordion = $('#myEventPicturesAccordion');
        if (myEvent.pictures.length > 0) {
            picturesAccordion.show();
            let picturesDiv = picturesAccordion.find('.list-group');
            picturesDiv.html("");
            myEvent.pictures.forEach(pictureData => {
                picturesDiv.append(createPictureHTML(pictureData));
            });
        } else {
            picturesAccordion.hide();
        }
    }

    $.get('/story/' + myEvent._id, function (stories) {
        if(stories) {
            addStoriesToResults(stories);
        }
    }).fail( function (err) {
        let cacheStories = getCachedMyEventStories(myEvent._id);
        cacheStories.then(function (stories) {
            addStoriesToResults(stories)
        })
    });
}
function addStoriesToResults(stories) {
    let storyDiv = $('#story-div');
    if (stories.length === 0) {
        storyDiv.append("<p>Looks like there are no stories for this event yet</p>");
    } else {
        storyDiv.html("");
        stories.forEach(story => {
            storyDiv.append(createStoryHtml(story));
        })
    }
}

function expandEvent(btn) {
    let myEventId = $(btn).data('myeventid');
    $.ajax({
        type: 'get',
        url: "/myevent/" + myEventId,
        dataType: 'json',
        success: function (data) {
            let myEvent = data;
            console.log(myEvent);
            updateMyEventModal(myEvent);
        },
        error: function (e) {
            console.log("Failed");
            console.log("Getting data from IndexedDB...");
            let myEvent = getCachedMyEvent(myEventId);
            myEvent.then(function (myEvent) {
                updateMyEventModal(myEvent);
            })
        }
    });
}

function myEventCardHtml(myEvent) {
    let banner = "";
    if (myEvent.pictures && myEvent.pictures.length > 0) {
        banner = myEvent.pictures[0];
    }
    return "<div>\n" +
        "  <div class=\"row no-gutters\">\n" +
        "    <div class=\"col-md-4\">\n" +
        "      <img src=\"" + banner + "\" class=\"card-img\" alt=\"...\">\n" +
        "    </div>\n" +
        "    <div class=\"col-md-8\">\n" +
        "      <div class=\"card-body\">\n" +
        "        <h5 class=\"card-title\">" + myEvent.myEventName + "</h5>\n" +
        "        <p class=\"card-text\">" + myEvent.description + "</p>\n" +
        "        <p class=\"card-text\">Date: " + new Date(myEvent.startDate).toLocaleString('gb') + " - " + new Date(myEvent.endDate).toLocaleString('gb') + "</p>\n" +
        "        <button onclick=\"expandEvent(this)\" type=\"button\" class=\"btn btn-dark\" " +
        "                data-myeventid=\"" + myEvent._id + "\" data-toggle=\"modal\" data-target=\"#myEventModal\">Expand</button>" +
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

function displayMap(loc) {
    let myLat = loc.coords.latitude;
    let myLng = loc.coords.longitude;

    let mapOptions = {
        zoom: 15,
        center: {lat: myLat, lng: myLng}
    };
    return new google.maps.Map(document.getElementById("map-canvas"), mapOptions);// To add the marker to the map, use the 'map' property
}


function addMyEventToMap(myEvent) {
    let marker = new google.maps.Marker({
        title: myEvent.myEventName,
        position: {lat: parseFloat(myEvent.location.lat), lng: parseFloat(myEvent.location.lng)},
        map: map
    });
    console.log( {lat: parseFloat(myEvent.location.lat), lng: parseFloat(myEvent.location.lng)});

    let infoWindow = new google.maps.InfoWindow({
        content: myEventCardHtml(myEvent),
        maxWidth: 400
    });

    marker.addListener('click', function () {
        infoWindow.open(marker.get('map'), marker);
    });
    markers.push(marker);
}

function updateCache(myEvents) {

}

var myEvents = [];
var map;
var markers = [];

$(document).ready(async function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    await initialize();
    console.log("map init to " + map);

    $("#event-search-button").click(update_map);

    $.get("/myevent/all", async function (data) {
        if(data) {
            console.log(data);
            myEvents.push(data);
            await clearCache(MYEVENT_STORE_NAME);
            data.forEach(myEvent => {
                cacheNewMyEvent(myEvent);
                addMyEventToMap(myEvent);
            })
        }
    }).fail(function () {
        myEvents = getCachedMyEvents();
    });

    $('#myEventModal').on('hidden.bs.modal', function () {
        $('#story-div').html("");
    })

    $('#addevent').click(function () {
        $(location).attr('href', '/myevent/new');
    });
});

