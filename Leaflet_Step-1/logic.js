// Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-02-05&endtime=" 
 + "2020-02-06&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer : addcircle
  });

  createMap(earthquakes);
});


// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake

     return layer.bindPopup(`<h3> Location: ${feature.properties.place} </h3> <hr> <p> Magnitude: ${feature.properties.mag} </p> <hr> <p> ${Date(feature.properties.time)} </p>`);
   }

// function add circles

function addcircle (feature, latlng) {

    var color = "";
  
    if (feature.properties.mag > 6){
      color = "red";
    }
    else if (feature.properties.mag > 3){
      color = "blue";
    }
    else if (feature.properties.mag > 1){
      color = "lime";
    }
    else {
      color = "yellow";
    }
  
    return new L.circle(latlng,{
      fillOpacity: 0.45,
      color: color,
      fillColor: color,
      radius: feature.properties.mag * 30000
    })

}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
