// dynamic latlng
// var myLatlng = new google.maps.LatLng(-34.397, 150.644);

// mapTypeId: google.maps.MapTypeId.SATELLITE

//Set map type dynamically
// map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

//CODE FROM WEB
// function initMap() {
//     var directionsService = new google.maps.DirectionsService;
//     var directionsDisplay = new google.maps.DirectionsRenderer;
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 7,
//         center: {
//             lat: 41.85,
//             lng: -87.65
//         }
//     });
//     directionsDisplay.setMap(map);
//
//     var onChangeHandler = function () {
//         calculateAndDisplayRoute(directionsService, directionsDisplay);
//     };
//     document.getElementById('start').addEventListener('change', onChangeHandler);
//     document.getElementById('end').addEventListener('change', onChangeHandler);
// }
//
// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//     directionsService.route({
//         origin: document.getElementById('start').value,
//         destination: document.getElementById('end').value,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, function (response, status) {
//         if (status === google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(response);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

var directionsDisplay, directionsService, mapDiv, map, geocoder, start, end;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var latlng = new google.maps.LatLng(-34.397, 150.644);

    mapDiv = document.getElementById('map');

    map = new google.maps.Map(mapDiv, {
        mapTypeId: google.maps.MapTypeId.HYBRID,
        center: latlng, // OR center: {lat: , lng: },
        zoom: 8
    });

    directionsDisplay.setMap(map);

    var button = document.getElementById('address');

    button.addEventListener('click', function () {

            var start = new google.maps.LatLng(-33.9068394, 18.4185398);
            var end = new google.maps.LatLng(-34.038141, 18.676916);

            var marker = new google.maps.Marker({
                map: map,
                position: start
            });

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });

    });
map.setTilt(45);
}

// HOW TO GET LATLNG CODES FROM STRING ADDRESS
// var geocoder = new google.maps.Geocoder();
//     var address = "Cape Town";
//     // var address = document.getElementById("address").value;
//     geocoder.geocode({'address': address}, function (results, status) {
//
//         if (status == google.maps.GeocoderStatus.OK) {
//       // map.setCenter(results[0].geometry.location);
            // } else {
            //     alert("Geocode was not successful for the following reason: " + status);
            // }
//     });

// DIRECTIONS CODE FROM WEB
// var directionsDisplay;
// var directionsService = new google.maps.DirectionsService();
// var map;
// var haight = new google.maps.LatLng(37.7699298, -122.4469157);
// var oceanBeach = new google.maps.LatLng(37.7683909618184, -122.51089453697205);
//
// function initialize() {
//   directionsDisplay = new google.maps.DirectionsRenderer();
//   var mapOptions = {
//     zoom: 14,
//     center: haight
//   }
//   map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   directionsDisplay.setMap(map);
// }
//
// // with user inpute to dynamically calculate and display route.
// function calcRoute() {
//     var start = document.getElementById("start").value;
//     var end = document.getElementById("end").value;
//     var request = {
//         origin: start,
//         destination: end,
//         travelMode: google.maps.TravelMode.DRIVING
//     };
//     directionsService.route(request, function (result, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(result);
//         }
//     });
// }

// function to include inline in button field when you have user input.
// function codeAddress() {
//     // var address = 'Cape Town';
//     var address = document.getElementById("address").value;
//     geocoder.geocode({
//         'address': address
//     }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             map.setCenter(results[0].geometry.location);
//             var marker = new google.maps.Marker({
//                 map: map,
//                 position: results[0].geometry.location
//             });
//         } else {
//             alert("Geocode was not successful for the following reason: " + status);
//         }
//     });
// }

// google.maps.event.addDomListener(window, 'load', initMaps);
