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
       $.ajax({
          url: 'http://localhost:8080/USWISCUWMAD',
          type: 'GET',
          crossDomain: true,
          dataType: 'jsonp',
          success: function(data) {
            var buildings = data.foundBuildings
            console.log(data)
            buildings.forEach((building)=>{
              var marker = new google.maps.Marker({
              position: new google.maps.LatLng(building.lat, building.lng),
              icon: icons['info'].icon,
              map: map
            });    
            })
          },
          error: function() { alert('Failed!'); }
      });
      }

      initMap();

