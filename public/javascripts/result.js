function initMap() {
  var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  var icons = {
    info: {
      icon: iconBase + 'info-i_maps.png'
    }
  };  

  let sValue = new URLSearchParams(document.location.search.substring(1)).get("sValue");
  let resultList = $("#resultList")
 $.ajax({
    url: 'http://localhost:8080/USWISCUWMAD',
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    //callback~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    success: function(data) {
      var buildings = data.foundBuildings//data array
      var center = [43.076592,-89.4124875]; 
      var hasLocation = false;
      var dist = 0;
      var utils = [];
      //how to graph map
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14.5,
        center: new google.maps.LatLng(43.076592, -89.4124875),
        mapTypeId: 'roadmap'
      });

      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          center.push(position.coords.latitude);
          center.push(position.coords.longitude);
          map.setCenter({lat:center[0],lng:center[1]});
          hasLocation = true;
        }, function() {
	//nothing
	});
      } else {
          console.log("Browser doesn't support geolocation.");
      }

      buildings.forEach((building)=>{
          building.utilities.forEach((utility)=>{
            if(utility.type === sValue){
	     var tDist = measureDist(center[0],center[1],building.lat,building.lng);
	     utils.push({dist:tDist,name:building.name,description:utility.description});
	     dist = Math.max(tDist,dist);
              //create mark and list~~~~~~~~~~
              creatMark(building.lat,building.lng)
              // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            }
          })
      })
      //furthest distance:dist
      //try to calculate the approporiate scale
      sortByDist(utils);
      utils.forEach((util)=>{
      resultList.append( '<li>'+ 
              '<img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/bascom-hall-todd-klassy.jpg" />'+
              '<h3>'+util.name+'</h3>'+
              '<p>'+util.description+'</p>'+
	      '<p>'+util.dist+' meters from me</p>'+
              '</li>');
      });
      //center: current position, utils: [] of {dist, name, description}
      console.log(getMapSize());
      console.log(center);
      console.log(dist);
      console.log(utils); 
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    error: function() { alert('Failed!'); }
});


//create mark on map
const creatMark = (lat,lng) =>{
  var marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              icon: icons['info'].icon,
              map: map
            });
}

const measureDist = (lat1, lng1, lat2, lng2) => {
  var R = 6378.137; 
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLng = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; 
}

const sortByDist = (list) => {
  //insertion sort
  for(var i=1;i<list.length;i++){
    var j = i-1;
    while(j>-1&&list[j].dist>=list[j+1].dist){
      var temp = list[j];
      list[j]=list[j+1];
      list[j+1]=temp;
      j--;
    }
  }
}

function getMapSize(){
  var container = document.getElementById('map');
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  return {w:width,h:height};
}
}
