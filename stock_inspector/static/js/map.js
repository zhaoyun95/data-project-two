//map
const url3 = "/api/v1.0/company";
d3.json(url3).then(function(data) {
 // Once we get a response, send the data.features object to the createFeatures function
data.latitude = +data.latitude
data.longitude = +data.longitude
data.mkt_cap = +data.mkt_cap
console.log(data)

// Function to determine marker size based on population
function markerSize(mkt_cap) {
    return mkt_cap * 100;
  }
  
 // Define arrays to hold created city and state markers
  var cityMarkers = [];
  var popups = [];
  // Loop through locations and create city and state markers
  for (var i = 0; i < data.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    cityMarkers.push(
      L.circle([data[i].latitude, data[i].longitude], {
        stroke: false,
        fillOpacity: 0.75,
        color: "purple",
        fillColor: "purple",
        radius: markerSize(data[i].mkt_cap)
      })
    );
  }
  
  //popup
  //loop through locations and create popups
  for (var i = 0; i < data.length; i++) {
    popups.push(
    L.marker([data[i].latitude, data[i].longitude])
    .bindPopup("<h3>" + data[i].name + "</h3> <hr> <h5> Sector:" + data[i].sector + "</h5>")
    );
}

  // Define variables for our base layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  // Create two separate layer groups: one for cities and one for states
  var cities = L.layerGroup(cityMarkers);
  var popuplab = L.layerGroup(popups);
  
  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create an overlay object
  var overlayMaps = {
     "City": cities,
     "Popups": popuplab
    };
  
  // Define a map object
  var myMap = L.map("mapid", {
    center: [51.505, -0.09],
    zoom: 2,
    layers: [streetmap, cities]
  });
  


  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});