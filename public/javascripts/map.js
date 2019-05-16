function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function initialize() {
        document.getElementById("user").innerHTML =
             getCookie("session");

    geocoder = new google.maps.Geocoder();

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
    if (search_param != "") {
        document.getElementById('search-alert').style.visibility = "visible";
        document.getElementById('search-alert').style.height='70px';
        document.getElementById('search-alert').style.padding='5px';
        document.getElementById('search-term').innerText = search_param;
        setTimeout(function() {
            document.getElementById('search-alert').style.height='0px';
            document.getElementById('search-alert').style.padding='0px';
            document.getElementById('search-alert').innerText = "";
        },5000);
    }
    filtered_events = [];

    myEvents.forEach(function (myEvent) {
        var year = search_param.split("/")[0];
        var month = search_param.split("/")[1]-1;
        var day = search_param.split("/")[2];
        var date_search = new Date(year,month,day);
        var searchStart = myEvent.startDate;
        searchStart.setDate(searchStart.getDate()-1);
        var searchEnd = myEvent.endDate;
        searchEnd.setDate(searchEnd.getDate()+1);
        if (myEvent.name == search_param || myEvent.description.includes(search_param) || myEvent.address.includes(search_param) ||
            myEvent.postcode.includes(search_param) ||
            (searchStart < date_search && searchEnd > date_search)) {
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

function eventInformationHtml(myEvent) {
    return "<p>Description: " + myEvent.description + "</p>" +
        "<p>Address: " + myEvent.address + "</p>" +
        "<p>Date: " + myEvent.startDate.toLocaleDateString("gb-GB") + " - " + myEvent.endDate.toLocaleDateString("gb-GB") + "</p>" +
        "<p>Author: " + myEvent.author + "</p>" +
        "<p>Keywords: " + myEvent.keywords + "</p>";

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
        "      <footer class=\"blockquote-footer\">" + story.author + "</footer>\n" +
        "    </blockquote>\n" +
        "  </div>\n" +
        "</div>"
}

function updateMyEventModal(myEvent) {
    let myEventModal = $('#myEventModal');
    myEventModal.find('.modal-title').text(myEvent.name);
    myEventModal.find('.modal-body').html(eventInformationHtml(myEvent));
    $('#new-story-form').find('button').val(myEvent.id);
    if (myEvent.pictures && myEvent.pictures.length > 0) {
        $('#myevent-profile-picture').html("<img class=\"img-fluid\" src=" + myEvent.pictures.pop() + " alt=\"event picture\">");
        let picturesAccordion = $('#myEventPicturesAccordion');
        if (myEvent.pictures.length > 0) {
            picturesAccordion.show();
            let picturesDiv = picturesAccordion.find('.list-group');
            myEvent.pictures.forEach(pictureData => {
                picturesDiv.append(createPictureHTML(pictureData));
            });
        } else {
            picturesAccordion.hide();
        }
    }
    let stories = getCachedMyEventStories(myEvent.id);
    stories.then(function (stories) {
        let storyDiv = $('#story-div');
        if (stories.length === 0) {
            storyDiv.append("<p>Looks like there are no stories for this event yet</p>");
        } else {
            stories.forEach(story => {
                storyDiv.append(createStoryHtml(story));
            })
        }
    })
}

function expandEvent(btn) {
    let myEventId = $(btn).data('myeventid');
    $.ajax({
        type: 'get',
        url: "/myevent/" + myEventId,
        dataType: 'json',
        success: function (data) {
            console.log("Success!");
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
        "        <h5 class=\"card-title\">" + myEvent.name + "</h5>\n" +
        "        <p class=\"card-text\">" + myEvent.description + "</p>\n" +
        "        <p class=\"card-text\">Date: " + myEvent.startDate.toLocaleDateString("gb-GB") + " - " + myEvent.endDate.toLocaleDateString("gb-GB") + "</p>\n" +
        "        <button onclick=\"expandEvent(this)\" type=\"button\" class=\"btn btn-dark\" " +
        "                data-myeventid=\"" + myEvent.id + "\" data-toggle=\"modal\" data-target=\"#myEventModal\">Expand</button>" +
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
    });
}


$(document).ready(function () {
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

    $("#event-search-button").click(update_map);

    myEvents = [];

    let myCachedEvents = getCachedMyEvents();
    myCachedEvents.then(function (myEventList) {
        myEvents = myEvents.concat(myEventList);
        console.log("Retrieved events", myEvents);
        initialize();
    })

    $('#myEventModal').on('hidden.bs.modal', function () {
        $('#story-div').html("");
    })

    $('#addevent').click(function () {
        $(location).attr('href', '/myevent/new');
    });
});

google.maps.event.addDomListener(window, 'load', initialize);

