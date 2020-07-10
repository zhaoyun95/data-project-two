//map
const url3 = "/api/v1.0/company";
d3.json(url3).then(function(data) {
 // Once we get a response, send the data.features object to the createFeatures function
data.latitude = +data.latitude;
data.longitude = +data.longitude;
data.mkt_cap = +data.mkt_cap;
data.pe_ratio = +data.pe_ratio;
data.dividend_pct = +data.dividend_pct;
data.esg_score = +data.esg_score;
console.log(data)

// Function to determine marker size based on population
function markerSize(mkt_cap) {
    return mkt_cap * 100;
  }
  
 // Define arrays to hold created city and state markers
  var cityMarkers = [];
  var peRatioMarkers = [];
  var dividendMarkers = [];
  var esgMarkers = [];
  var popups = [];
  // Loop through locations and create city and state markers
  for (var i = 0; i < data.length; i++) {
    var name = data[i].name;
    var sector = data[i].sector;
    var latitude = data[i].latitude;
    var longitude = data[i].longitude;
    var pe_ratio = data[i].pe_ratio;
    var dividend_pct = data[i].dividend_pct;
    var esg_score = data[i].esg_score;
    var mkt_cap = data[i].mkt_cap;

    // Setting the marker radius for the state by passing population into the markerSize function
    cityMarkers.push(
      L.circle([latitude, longitude], {
        stroke: false,
        fillOpacity: 0.75,
        color: "black",
        fillColor: "purple",
        radius: markerSize(mkt_cap * 1.5)
      })
    );

    if (pe_ratio > 0) {
      peRatioMarkers.push(
        L.circle([latitude, longitude], {
          stroke: false,
          fillOpacity: 0.75,
          color: "black",
          fillColor: "red",
          radius: markerSize(pe_ratio * 10)
        })
      );
    }

    if ( dividend_pct > 0) {
      dividendMarkers.push(
        L.circle([latitude, longitude], {
          stroke: false,
          fillOpacity: 0.75,
          color: "black",
          fillColor: "blue",
          radius: markerSize(dividend_pct * 200)
        })
      );
    }

    if (esg_score > 0) {
      esgMarkers.push(
        L.circle([latitude, longitude], {
          stroke: false,
          fillOpacity: 0.75,
          color: "black",
          fillColor: "green",
          radius: markerSize(esg_score * 40)
        })
      );
    }

    popups.push(
        L.marker([latitude, longitude])
        .bindPopup(`<div><strong>${name}</strong></div><hr><div>Sector: ${sector}</div><br><div>Mkt Cap: ${mkt_cap} B</div><br><div>Dividend: ${dividend_pct}%</div><br><div>PE Ratio: ${pe_ratio}</div><br><div>ESG Score: ${esg_score}</div><br>` )
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
  var PERatiosLayer = L.layerGroup(peRatioMarkers);
  var DividendsLayer = L.layerGroup(dividendMarkers);
  var ESGLayer = L.layerGroup(esgMarkers);
  var popuplab = L.layerGroup(popups);
  
  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create an overlay object
  var overlayMaps = {
     "Market Cap": cities,
     "Dividend": DividendsLayer,
     "PE Ratio": PERatiosLayer,
     "ESG Score": ESGLayer,
     "Popups": popuplab
    };
  
  // Define a map object
  var myMap = L.map("mapid", {
    center: [51.505, -0.09],
    zoom: 2,
    layers: [streetmap, cities, popuplab]
  });
  
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});