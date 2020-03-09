'use strict';

const apiKey = 'Bearer 1nRpuvswzXKri1qY5ipjP6RugojOH-PrsVouyJZyGvZ0LxcczVHPiPx51iGwmMYFEvfqg0oh01yEu2cXa4n6mavxPKyqUpIjSpr3P6l-6Bt8Y5c_-R5H6YwmSdldXnYx';

var map;
var searchTerm;

// Generates a map containing markers with restaurants near the user's current location
function initMap() {
  var request = new XMLHttpRequest();

  // URL-encodes a list of parameters
  function formatParams(params){
      return "?" + Object.keys(params).map(key => {
          return key+"="+encodeURIComponent(params[key]);
      }).join("&");
  }
  
  // checks that geolocation is available
  if (navigator.geolocation) {

      // gets the current position of the user
      navigator.geolocation.getCurrentPosition(position => {
        var { latitude, longitude } = position.coords;

        const searchRequest = {
          latitude,
          longitude
        };

        // adds a search term to the Yelp search request if specified by the user
        if (searchTerm) {
          searchRequest.term = searchTerm;
        }

        // open a new connection, using the GET request on the URL endpoint with parameters
        request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search' + formatParams(searchRequest), true);
        request.setRequestHeader('Authorization', apiKey);

        // displays the map when the Yelp search request has loaded
        request.onload = function() {
          // accesses the JSON response data
          var data = JSON.parse(this.response);
          var infoWindow;
          var pos = {
            lat: latitude,
            lng: longitude
          }

          // creates a map centered at the current location using Google Maps API
          map = new google.maps.Map(document.getElementById('map'), {
            center: pos,
            zoom: 15
          });

          // labels the current location of the user
          var currentInfoWindow = new google.maps.InfoWindow;
          currentInfoWindow.setPosition(pos);
          currentInfoWindow.setContent('You are here.');
          currentInfoWindow.open(map);

          var currentMarker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
            label: {
              text: "A",
              color: "white"
            }
          });

          // adds a marker for each restaurant returned by the Yelp search request
          data.businesses.forEach(business => {
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(business["coordinates"]["latitude"], business["coordinates"]["longitude"]),
              map: map
            });

            // opens an info window containing more information about a restaurant when the marker is clicked
            marker.addListener('click', () => {
              // closes any previously opened info window
              if (infoWindow) {
                infoWindow.close();
              }

              // contains information about the restaurant including name, image, rating, price, phone, and distance
              var contentString = `<div id="content">
                <h2><a href=${ business["url"] }>${ business["name"] }</a></h2>
                <img src="${ business["image_url"] }" height="150vh"/>
                <p>
                <b>Category:</b> ${ business["categories"][0]["title"] } <br/>
                <b>Rating:</b> ${ business["rating"] }/5.0 <br/>
                <b>Reviews:</b> ${ business["review_count"] } <br/>
                <b>Price:</b> ${ business["price"] } <br/>
                <b>Phone:</b> ${ business["display_phone"] } <br/>
                <b>Distance:</b> ${ (business["distance"]/1609.0).toFixed(2) } mi <br/>
                </p>
                </div>`;

              infoWindow = new google.maps.InfoWindow({
                content: contentString
              });

              // adds the info window to the map
              infoWindow.open(map, marker);
            });

          });
        }

        // sends the API request
        request.send();
      });
  }
}

// Displays restaurants given a specific search query
function search(event) {
  // checks if the ENTER key has been pressed
  if (event.keyCode === 13) {
    var input = document.getElementById("searchBar");
    searchTerm = input.value.toLowerCase();
    initMap();
  }
}
