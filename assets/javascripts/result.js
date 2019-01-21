/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
function initMap() {
  // init direction service
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();
  // search value
  const sValue = new URLSearchParams(document.location.search.substring(1)).get(
    "sValue"
  );
  // result check
  const searchResults = ["Microwave", "Printer"];
  if (!searchResults.includes(sValue)) {
    alert("result not found!");
    window.location.href = "../index.html"; // redirect to main page
  }

  const resultList = $("#result-list");
  let currentMarks = [];
  // current marker
  const resultCoordinates = [];
  // record all found result coordinates
  const bounds = new google.maps.LatLngBounds(); // record bounds
  // remove all cureent marks on the map
  const removeCurrentMarks = () => {
    if (currentMarks.length > 0) {
      currentMarks.forEach(cMarker => {
        cMarker.setMap(null);
      });
    }
  };

  // create a mark on map
  const creatMark = (lat, lng) => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map
    });
    currentMarks.push(marker);
    return marker;
  };
  // get current geolocation
  const getGeolocation = callback => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          callback(position.coords.latitude, position.coords.longitude);
        },
        err => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              alert(
                "You denied the request for Geolocation," +
                  "please allow us to get your location"
              );
              break;
            case err.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case err.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            case err.UNKNOWN_ERROR:
              alert("An unknown error occurred.");
              break;
            default:
              alert("A truly unknown error");
          }
          callback(43.076592, -89.4124875);
        }
      );
    } else {
      alert("Browser doesn't support geolocation.");
      callback(43.076592, -89.4124875);
      alert("Assume your position is at the center of the campus");
    }
  };
  // current scroll position and specific mode
  let currentScroll;
  let specMode = false;
  // show specific item
  const showSpcItem = obj => {
    specMode = true;
    $(".nav").show();
    currentScroll = this.scrollY;
    window.scrollTo(0, 0); // scoll to top
    resultList.hide(); // hide result list
    removeCurrentMarks();
    creatMark(obj.lat, obj.lng);
    map.setCenter({ lat: obj.lat, lng: obj.lng });
    map.setZoom(16);
    // set information for specific item
    $("#buildingName").text(`${obj.type} in ${obj.name}`);
    $("#buildingDes").text(obj.description);
    $("#buildingDis").text(`${obj.dist} miles`);
    $("#utilIMG").attr("href", obj.uImage);
    // direction button
    $("#directionBtn").prop("disabled", false); // enable first
    $("#directionBtn").on("click", () => {
      // calculating mask
      $("#map-loading-icon").show();
      $("#map").css("opacity", "0.5");
      // disable the button
      $("#directionBtn").prop("disabled", true);
      getGeolocation((lat, lng) => {
        removeCurrentMarks();
        const request = {
          origin: new google.maps.LatLng(lat, lng),
          destination: new google.maps.LatLng(obj.lat, obj.lng),
          travelMode: "WALKING"
        };
        directionsService.route(request, (result, status) => {
          if (status === "OK") {
            directionsDisplay.setDirections(result);
            $("#map-loading-icon").text("Got it! 😄");
            setTimeout(() => {
              $("#map-loading-icon").text("Searching... 🧐");
              $("#map-loading-icon").hide();
              $("#map").css("opacity", "1");
            }, 1000);
          }
        });
      });
    });
    $(".result-container").hide();
    $("#detail-container").show();
  };

  const createCard = obj => {
    const liTag = document.createElement("li");
    const imgTag = document.createElement("img");
    const hTag = document.createElement("h3");
    const desTag = document.createElement("p");
    const disTag = document.createElement("span");
    const textContainer = document.createElement("div");
    $(hTag).text(obj.name);
    $(imgTag).attr("src", obj.bImage);
    $(disTag).text(`${obj.dist} miles from me`);
    if ($(window).width() <= 576)
      $(desTag).text(`${obj.description.substring(0, 20)} ...`);
    else $(desTag).text(obj.description);
    $(liTag).addClass("card");
    $(imgTag).addClass("card-img");
    $(hTag).addClass("card-title");
    $(desTag).addClass("card-detail");
    $(disTag).addClass("card-annotation");
    $(textContainer).addClass("card-text-container");
    liTag.append(textContainer);
    liTag.append(imgTag);
    textContainer.append(hTag);
    textContainer.append(disTag);
    textContainer.append(desTag);
    $(liTag).on("click", () => {
      showSpcItem(obj);
    });
    return liTag;
  };

  const populateResults = data => {
    const buildings = data.next;
    // data array
    let center = [43.076592, -89.4124875];
    let dist = 0;
    const utils = [];
    // how to graph map
    map = new google.maps.Map(document.getElementById("map"), {
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      styles: [
        {
          featureType: "administrative.land_parcel",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text",
          stylers: [{ visibility: "off" }]
        },
        { featureType: "poi.business", stylers: [{ visibility: "off" }] },
        {
          featureType: "poi.school",
          elementType: "labels.text",
          stylers: [
            { color: "#c5050c" },
            { visibility: "simplified" },
            { weight: 3 }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "road.local",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        { featureType: "transit", stylers: [{ visibility: "off" }] }
      ]
    });
    directionsDisplay.setMap(map);

    const measureDist = (lat1, lng1, lat2, lng2) => {
      const R = 6378.137;
      const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
      const dLng = (lng2 * Math.PI) / 180 - (lng1 * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d * 1000;
    };

    const sortByDist = list => {
      // insertion sort
      const listt = list;
      for (let i = 1; i < list.length; i += 1) {
        let j = i - 1;
        while (j > -1 && list[j].dist >= list[j + 1].dist) {
          const temp = list[j];
          listt[j] = list[j + 1];
          listt[j + 1] = temp;
          j -= 1;
        }
      }
    };
    const loadMoreList = (liArr, step, btn) => {
      const cNums = liArr.length;
      // eslint-disable-next-line no-multi-assign
      let pp = (cp = step); // pp=pause_point cp=current_point
      if (cNums <= step) {
        pp = cNums;
        btn.hide();
      } else {
        btn.on("click", () => {
          if (pp <= cNums) {
            pp += step;
            while (cp < pp && cp < cNums) {
              $(createCard(liArr[cp])).insertBefore(btn);
              cp += 1;
            }
          }
          if (pp >= cNums) btn.hide(); // operation after loading all items
        });
      }
      // default load

      for (let i = 0; i < pp; i += 1) {
        $(createCard(liArr[i])).insertBefore(btn);
      }
    };

    getGeolocation((lati, longti) => {
      let mark; // used to store mark
      center = [];
      center.push(lati);
      center.push(longti);
      map.setCenter({ lat: center[0], lng: center[1] });
      buildings.forEach(building => {
        building.utilities.forEach(utility => {
          if (utility.type === sValue) {
            const tDist = measureDist(
              center[0],
              center[1],
              building.lat,
              building.lng
            );
            utils.push({
              dist: Math.round(tDist * 0.000621371 * 100) / 100,
              name: building.name,
              description: utility.description,
              lat: building.lat,
              lng: building.lng,
              bImage: building.image,
              uImage: utility.image,
              type: utility.type
            });
            dist = Math.max(tDist, dist);
            // create mark and list~~~~~~~~~~
            mark = creatMark(building.lat, building.lng);
            resultCoordinates.push({ lat: building.lat, lng: building.lng });
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            bounds.extend(mark.getPosition()); // add mark to bound
          }
        });
      });
      map.fitBounds(bounds); // set final bounds
      /* furthest distance:dist
      try to calculate the approporiate scale */
      sortByDist(utils);
      loadMoreList(utils, 4, $("#load-more-btn"));
      $("#back-btn").show();
      $(".sk-folding-cube").remove();
      $("#map-container").css("visibility", "visible");
      $("#load-more-btn").css("display", "block");
    });
  };

  // go back button initialize
  $("#back-btn").on("click", () => {
    // check display property to decide go back btn
    const c = document.querySelector("#detail-container").style.display;
    if (c === "none" || c === "") {
      window.location.href = "../index.html";
    } else {
      specMode = false; // quit spec mdoe for scroll listener
      directionsDisplay.set("directions", null);
      $("#detail-container").hide();
      $(".result-container").show();
      // remove all current marks
      removeCurrentMarks();
      currentMarks = [];
      // populate the marks again
      resultCoordinates.forEach(coor => {
        creatMark(coor.lat, coor.lng);
      });
      $("#directionBtn").off();
      map.fitBounds(bounds); // use old bounds
      window.scrollTo(0, currentScroll); // scroll to previous position
    }
  });

  $.ajax({
    url: "https://angrymap.herokuapp.com/USWISCUWMAD",
    type: "GET",
    crossDomain: true,
    dataType: "jsonp",
    success(data) {
      populateResults(data);
    },
    error() {
      alert("woops Server down!");
    }
  });

  // scroll down listener
  let scrollPos = 0; // Initial state
  // adding scroll event
  window.addEventListener("scroll", () => {
    if (!specMode) {
      // detects new state and compares it with the new one
      if (document.body.getBoundingClientRect().top > scrollPos) {
        $(".nav").show();
      } else {
        $(".nav").hide("fast");
      } // saves the new position for iteration.
      scrollPos = document.body.getBoundingClientRect().top;
    }
  });
  // lightbox 2 option
  // lightbox.option({
  //   resizeDuration: 100,
  //   wrapAround: true
  // });
}
