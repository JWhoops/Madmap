function initMap() {
  let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  let icons = {
    info: {
      icon: iconBase + 'info-i_maps.png'
    }
  };  

let sValue = new URLSearchParams(document.location.search.substring(1)).get("sValue");
let resultList = $("#resultList")
let currentMarks = [] //current marker
let resultCoordinates = []
let specificResult = $("#specificResult") 
$.ajax({
    url: 'https://angrymap.herokuapp.com/USWISCUWMAD',
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data){populateResults(data)},
    error: function() { alert('Failed!'); }
});

const createCard = (obj)=>{
 let liTag = document.createElement("li"),
     imgTag = document.createElement("img"),
     hTag = document.createElement("h3"),
     desTag = document.createElement("label"),
     disTag = document.createElement("p") 
     $(hTag).text(obj.name)
     $(imgTag).attr("src","https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/bascom-hall-todd-klassy.jpg")
     $(disTag).text("Distance: " + obj.dist + " meters")
     $(desTag).text("description: " + obj.description)
     liTag.append(imgTag)
     liTag.append(hTag)
     liTag.append(disTag)
     liTag.append(desTag)
     $(liTag).on('click',function(){
       showSpcItem(obj)
     })
     return liTag
}

const getGeolocation = (callback) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        callback(position.coords.latitude,position.coords.longitude)
      })
    }else{
      alert("Browser doesn't support geolocation.");
      callback(43.076592,-89.4124875)
    }
}

const populateResults = (data) => {
  let buildings = data.next,//data array
      center = [43.076592,-89.4124875], 
      hasLocation = false,
      dist = 0,
      utils = []
  //how to graph map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14.5,
    center: new google.maps.LatLng(43.076592, -89.4124875),
    mapTypeId: 'roadmap',
    disableDefaultUI: true
  });
  
  getGeolocation((lati,longti)=>{
      center = [];
      center.push(lati);
      center.push(longti);
      map.setCenter({lat:center[0],lng:center[1]});
      hasLocation = true;
      buildings.forEach((building)=>{
        building.utilities.forEach((utility)=>{
          if(utility.type === sValue){
            let tDist = measureDist(center[0],center[1],
                                    building.lat,
                                    building.lng);
            utils.push({dist:Math.round(tDist),
                        name:building.name,
                        description:utility.description,
                        lat:building.lat,
                        lng:building.lng});
            dist = Math.max(tDist,dist);
            //create mark and list~~~~~~~~~~
            creatMark(building.lat,building.lng)
            resultCoordinates.push({lat:building.lat,lng:building.lng})
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        })
      })
    /*furthest distance:dist
    try to calculate the approporiate scale*/
    sortByDist(utils);
    utils.forEach((util)=>{
      resultList.append(createCard(util))
    })
  })
}

const showSpcItem = (obj) => {
  resultList.css("display","none")
  removeCurrentMarks()
  creatMark(obj.lat,obj.lng)
  map.setCenter({lat:obj.lat,lng:obj.lng})
  map.setZoom(16)
  specificResult.append('<p>' + obj.name +'</p>')
  specificResult.append('<p>'+ "Description: " + obj.description +'</p>')
  specificResult.append('<p>'+ "Distance: " + obj.dist + " meters" +'</p>')
  let GBBtn     = document.createElement("button"),
      directBtn = document.createElement("button")
  $(GBBtn).text("Go Back")
  $(GBBtn).on('click',()=>{
    specificResult.css("display","none")
    specificResult.empty()
    resultList.css("display","block")
    removeCurrentMarks()
    currentMarks = []
    resultCoordinates.forEach((coor)=>{
      creatMark(coor.lat,coor.lng)
    })
    //center problem
    getGeolocation((lat,lng)=>{
      map.setCenter({lat:obj.lat,lng:obj.lng})  
    })
    map.setZoom(14.5)
  })

  $(directBtn).text("show direction")
  $(directBtn).on('click',()=>{
    getGeolocation((lat,lng)=>{
      window.open("http://maps.apple.com/?saddr="+lat+","+lng+
        "&daddr="+obj.lat+","+obj.lng+"&dirflg=w")
    })
  })

  specificResult.append(GBBtn)
  specificResult.append(directBtn)
  specificResult.css("display","block")
}

const removeCurrentMarks = () => {
  if(currentMarks.length > 0){
    currentMarks.forEach((cMarker)=>{
      cMarker.setMap(null)
    })
  }
}

//create mark on map
const creatMark = (lat,lng) =>{
  let marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              icon: icons['info'].icon,
              map: map
            })
  currentMarks.push(marker)
}

const measureDist = (lat1, lng1, lat2, lng2) => {
  let R = 6378.137; 
  let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  let dLng = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;
  return d * 1000; 
}

const sortByDist = (list) => {
  //insertion sort
  for(let i=1;i<list.length;i++){
    let j = i-1;
      while(j>-1&&list[j].dist>=list[j+1].dist){
        let temp = list[j];
        list[j]=list[j+1];
        list[j+1]=temp;
        j--;
      }
    }
  }

  function getMapSize(){
    let container = document.getElementById('map');
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    return {w:width,h:height};
  }
}