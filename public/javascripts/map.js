        // This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: new google.maps.LatLng(43.076592, -89.4124875),
          mapTypeId: 'roadmap'
        });

        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
          info: {
            icon: iconBase + 'info-i_maps.png'
          }
        };

        let lng

      //  $.ajax({
      //     url: 'http://localhost:8080/USWISCUWMAD',
      //     type: 'GET',
      //     crossDomain: true,
      //     dataType: 'jsonp',
      //     success: function(data) {
      //       var buildings = data.foundBuildings
      //       console.log(data)
      //       buildings.forEach((building)=>{
      //         var marker = new google.maps.Marker({
      //         position: new google.maps.LatLng(building.lat, building.lng),
      //         icon: icons['info'].icon,
      //         map: map
      //       });    
      //       })
      //     },
      //     error: function() { alert('Failed!'); }
      // });
         
        // Create markers.
        // features.forEach(function(feature) {
        //   var marker = new google.maps.Marker({
        //     position: feature.position,
        //     icon: icons[feature.type].icon,
        //     map: map
        //   });
        // });
      }

  let g
  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            //console.log("lat:" + position.coords.latitude + " lng:"+ position.coords.longitude)
            g = position.coords
          });
      } else { 
          console.log("Geolocation is not supported by this browser.");
      }
  }


  // getLocation();
