# Clacket GPS Mockup

## Purpose
As a mockup for the behavior expected by the GPS feature in Clacket, this map (after the browser asks permission to use the user's location) displays the user's location, as well as 5 cinemas (in random locations within a 0.5km radius) with their descriptions/details available on click. 
In Clacket, the locations will not be randomly generated, and the cinemas displayed will be the ones playing the movie(s) the user wants to watch.

## What This Does
- Gets the user's location
- Displays that location on the map (mapbox)
- Displays a 0.5km radius on the map
- Generates 5 locations, "cinemas", with their description and displays them
- Description for the location is available on click