function initMap(){
  let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  let icons = {
    info: {
      icon: iconBase + 'info-i_maps.png'
    }
  };  

//search value
let sValue = new URLSearchParams(document.location.search.substring(1)).get("sValue"),
    resultList = $("#resultList"),
    currentMarks = [], //current marker
    resultCoordinates = [],//record all found result coordinates
    bounds = new google.maps.LatLngBounds()//record bounds 
$.ajax({
    url: 'https://angrymap.herokuapp.com/USWISCUWMAD',
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data){populateResults(data)},
    error: function() { alert('Failed!') }
});

const createCard = (obj)=>{
 let liTag = document.createElement("li"),
     imgTag = document.createElement("img"),
     hTag = document.createElement("h3"),
     desTag = document.createElement("p"),
     disTag = document.createElement("span") 
     $(hTag).text(obj.name)
     $(imgTag).attr("src",obj.bImage)
     $(disTag).text(Math.round(obj.dist*0.000621371*100)/100  + " miles from me")
     if(obj.description.length > 20)
      $(desTag).text(obj.description.substring(0,30) + "...")
     else
     $(desTag).text(obj.description)
     liTag.append(imgTag)
     liTag.append(hTag)
     liTag.append(desTag)
     liTag.append(disTag)
     $(liTag).on('click',function(){
       showSpcItem(obj)
     })
     return liTag
}

const getGeolocation = (callback) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
          callback(position.coords.latitude,position.coords.longitude)
      },function(err){
        switch(err.code) {
          case err.PERMISSION_DENIED:
             alert("You denied the request for Geolocation," + 
              "please allow us to get your location")
              break;
          case err.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.")
              break;
          case err.TIMEOUT:
              alert("The request to get user location timed out.")
              break;
          case err.UNKNOWN_ERROR:
              alert("An unknown error occurred.")
              break;
        }
        callback(43.076592,-89.4124875)
      })
    }else{
      alert("Browser doesn't support geolocation.");
      callback(43.076592,-89.4124875)
      alert("Assume your position is at the center of the campus")
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
    mapTypeId: 'roadmap',
    disableDefaultUI: true
  });
  
  getGeolocation((lati,longti)=>{
      let mark//used to store mark
      center = [];
      center.push(lati);
      center.push(longti);
      map.setCenter({lat:center[0],lng:center[1]})
      hasLocation = true;
      buildings.forEach((building)=>{
        building.utilities.forEach((utility)=>{
          if(utility.type === sValue){
            let tDist = measureDist(center[0],center[1],
                                    building.lat,
                                    building.lng)
            utils.push({dist:Math.round(tDist),
                        name:building.name,
                        description:utility.description,
                        lat:building.lat,
                        lng:building.lng,
                        bImage:building.image,
                        uImage:utility.image,
                        type:utility.type})
            dist = Math.max(tDist,dist)
            //create mark and list~~~~~~~~~~
            mark = creatMark(building.lat,building.lng)
            resultCoordinates.push({lat:building.lat,lng:building.lng})
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            bounds.extend(mark.getPosition());//add mark to bound
          }
        })
      })
    map.fitBounds(bounds)//set final bounds
    /*furthest distance:dist
    try to calculate the approporiate scale*/
    sortByDist(utils)
    utils.forEach((util)=>{
      resultList.append(createCard(util))
    })
  })
}

//go back button initialize
  $("#back-btn").on('click',()=>{
    //check display property to decide go back btn
    let c = document.querySelector('#detail-container').style.display
    if(c=='none' || c == ""){
      window.history.back()
    }else{
      $("#detail-container").fadeOut("slow")
      resultList.css("display","block")
      //remove all current marks
      removeCurrentMarks()
      currentMarks = []
      //populate the marks again
      resultCoordinates.forEach((coor)=>{
        creatMark(coor.lat,coor.lng)
      })
      map.fitBounds(bounds)//use old bounds
      $("#directionBtn").off()
      $("#map").css("height","40%")
    }
  })

//show specific ite
const showSpcItem = (obj) => {
  resultList.css("display","none")//hide result list
  removeCurrentMarks()
  creatMark(obj.lat,obj.lng)
  map.setCenter({lat:obj.lat,lng:obj.lng})
  map.setZoom(16)
  //set information for specific item
  $("#buildingName").text(obj.type+ " in " +obj.name)
  $("#buildingDes").text(obj.description)
  $("#buildingDis").text(obj.dist + " meters")
  $("#utilityIMG").attr('src',obj.uImage)
  //direction button
  $("#directionBtn").on('click',()=>{
    getGeolocation((lat,lng)=>{
      window.open("http://maps.apple.com/?saddr="+lat+","+lng+
        "&daddr="+obj.lat+","+obj.lng+"&dirflg=w")
    })
  })
  //hold to show button
  let img = $("#utilityIMG")
  let showBtn = $('#showIMG')
  showBtn.on('click',()=>{
    if(showBtn.text() == 'Show Photo'){
      img.fadeIn('slow')
      showBtn.text('Show Map')
    }else{
      img.fadeOut('slow')
      showBtn.text('Show Photo')
    }
  })
  // $('#showIMG').on('mousedown mouseup', function mouseState(e) {
  //   if (e.type == "mousedown") {
  //     img.css('display','block')
  //   }else{
  //     img.css('display','none')
  //   }
  // })

  // //for mobile
  // let showBtn = document.querySelector("#showIMG")
  // showBtn.addEventListener('touchstart',()=>{
  //   img.css('display','block')
  // })
  // showBtn.addEventListener('touchend',()=>{
  //    img.css('display','none')
  // })
  $("#map").css("height","60%")
  $("#detail-container").fadeIn("slow")
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
  return marker
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

  const getMapSize=()=>{
    let container = document.getElementById('map');
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    return {w:width,h:height};
  }
}