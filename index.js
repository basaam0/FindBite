'use strict';

/* Yelp
Client ID: 16U1oFiyIsfEcayrt94vSA
API Key: 1nRpuvswzXKri1qY5ipjP6RugojOH-PrsVouyJZyGvZ0LxcczVHPiPx51iGwmMYFEvfqg0oh01yEu2cXa4n6mavxPKyqUpIjSpr3P6l-6Bt8Y5c_-R5H6YwmSdldXnYx
*/

/* Google Maps
API Key: AIzaSyC7QmxgrYeMwE8-BM2BnZddfOihhVRkuFo
Paid: AIzaSyB4cXCsMYsNwSeuHMH5JJGmgBrMM3ILxgU
*/

var map;
function initMap() {
  var request = new XMLHttpRequest();

  const apiKey = 'Bearer 1nRpuvswzXKri1qY5ipjP6RugojOH-PrsVouyJZyGvZ0LxcczVHPiPx51iGwmMYFEvfqg0oh01yEu2cXa4n6mavxPKyqUpIjSpr3P6l-6Bt8Y5c_-R5H6YwmSdldXnYx';

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        var { latitude, longitude } = position.coords;


        // URL-encodes a list of parameters
        function formatParams(params){
            return "?" + Object.keys(params).map(key => {
                return key+"="+encodeURIComponent(params[key]);
            }).join("&");
        }


        const searchRequest = {
          term:'Four Barrel Coffee',
          //location: 'san francisco, ca'
          latitude,
          longitude
        };


        // Open a new connection, using the GET request on the URL endpoint with parameters
        request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search' + formatParams(searchRequest), true);
        request.setRequestHeader('Authorization',apiKey);

        request.onload = function() {
          // Accesses the JSON response data
          var data = JSON.parse(this.response);

          const firstResult = data.businesses[0];
          const prettyJson = JSON.stringify(firstResult, null, 4);
          console.log(prettyJson);

          console.log(data);


          map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: latitude, lng: longitude},
            zoom: 10
          });

          data.businesses.forEach(business => {

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(business["coordinates"]["latitude"], business["coordinates"]["longitude"]),
              map: map,
              label: String(business["name"])
            });
          });
        }

        // Sends the API request
        request.send();


      });
  } else {
      var errorMsg = document.createElement("p");
      errorMsg.innerHTML = "Geolocation is not supported by this browser.";
      document.getElementsByClassName("body")[0].appendChild(errorMsg);
  }
}
