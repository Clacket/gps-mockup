mapboxgl.accessToken = 'pk.eyJ1IjoibWFhcm91ZiIsImEiOiJjajkxYXBsNDcybXdiMzNuNzJ4cXEzcjVhIn0.aVSaQSDiS-9fAEs900V6Jw';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v10',
	center: [29.9187, 31.2001],
	zoom: 15
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var user_marker = new mapboxgl.Marker();

map.on("load", function () {	
	navigator.geolocation.getCurrentPosition(function(pos) {
		var cinemas = get5Cinemas(pos, 0.5);
		var center = [ pos.coords.longitude, pos.coords.latitude ];
		map.setCenter(center);
		map.addSource("polygon", createGeoJSONCircle(center, 0.5));
		map.addLayer({
			"id": "polygon",
			"type": "fill",
			"source": "polygon",
			"layout": {},
			"paint": {
			    "fill-color": "rgb(52, 152, 219)",
			    "fill-opacity": 0.4
			}
		});
		var data = {
		   "type": "FeatureCollection",
		   "features": [{
		       "type": "Feature",
		       "properties": {
		      	  "title": "You are here",
		      	  "icon": "circle"
		        },
		       "geometry": {
		          "type": "Point",
		          "coordinates": center
		      	}
		  	}]
		}
		map.addLayer({
			"id": "user_position",
			"type": "symbol",
			"source": {
				"type": "geojson",
				"data": data
			},
			"layout": {
			    "icon-image": "{icon}-15",
			    "text-field": "{title}",
			    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
			    "text-offset": [0, 0.6],
			    "text-anchor": "top"
			}
		});

		var cinema_data = {
			"type": "FeatureCollection",
			"features": cinemas
		}

		map.addLayer({
			"id": "cinemas",
			"type": "symbol",
			"source": {
				"type": "geojson",
				"data": cinema_data
			},
			"layout": {
			    "icon-image": "{icon}-15",
			    "text-field": "{title}",
			    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
			    "text-offset": [0, 0.6],
			    "text-anchor": "top",
			    "icon-allow-overlap": true
			}
		});

		// When a click event occurs on a feature in the places layer, open a popup at the
	    // location of the feature, with description HTML from its properties.
	    map.on('click', 'cinemas', function (e) {
	        new mapboxgl.Popup()
	            .setLngLat(e.features[0].geometry.coordinates)
	            .setHTML(e.features[0].properties.description)
	            .addTo(map);
	    });

	    // Change the cursor to a pointer when the mouse is over the places layer.
	    map.on('mouseenter', 'cinemas', function () {
	        map.getCanvas().style.cursor = 'pointer';
	    });

	    // Change it back to a pointer when it leaves.
	    map.on('mouseleave', 'cinemas', function () {
	        map.getCanvas().style.cursor = '';
	    });


	});
});


// src: https://stackoverflow.com/a/39006388
var createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};

var generateRandomLocation = function (radiusInKm, original_lat, original_lng) {
	var r = (radiusInKm * 1000) / 111300;
  	var y0 = original_lat;
  	var x0 = original_lng;
  	var u = Math.random();
  	var v = Math.random();
  	var w = r * Math.sqrt(u);
  	var t = 2 * Math.PI * v;
  	var x = w * Math.cos(t);
  	var y1 = w * Math.sin(t);
  	var x1 = x / Math.cos(y0);

  	return [x0 + x1, y0 + y1];
}

var get5Cinemas = function (pos, radiusInKm) {
	var c = [
		{ name: 'Cineplex', desc: "Showings start at 10AM. Sunday is off. +2031233455" },
		{ name: 'Renaissance', desc: "Prior reservation a must. +2012323445" },
		{ name: 'Grand Cinema', desc: "IMAX 3D Technology. +202839232" },
		{ name: 'MoviePlaza', desc: "Occasionally displays old movies. +2039283923" },
		{ name: 'MyCinema', desc: "Free popcorn with 2 or more tickets. +2098232232" }
	];
	var ret = [];
	for (var i=0; i<c.length; i++){
		c[i].pos = generateRandomLocation(radiusInKm, pos.coords.latitude, pos.coords.longitude);
		ret.push({
		    "type": "Feature",
		    "properties": {
		   	  "title": c[i].name,
		   	  "icon": "star",
		   	  "description": "<strong>" + c[i].name + "</strong><br>" + c[i].desc
		     },
		    "geometry": {
		       "type": "Point",
		       "coordinates": c[i].pos
		    }
		});
	}
	return ret;
}
