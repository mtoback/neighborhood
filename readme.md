A Neighborhood Application
===========================

This application will give you information on any "neighborhood" you choose by providing an address, including:
- a map of the neighborhood showing the location of one or more items of interest in that neighborhood
- a list of one or more items of interest in that neighborhood
- the current weather in the neighborhood, and
- a way of filtering on those items

Attribution
===========

This application makes use of the knockout.js package for flow control, jQuery for javascript functions, and bootstrap for application layout.

Icons for the map were obtained from http://map-icons.com/

This program used the following node-modules to generate the production code via the Gruntfile.js file:
- grunt
- grunt-contrib-clean
- grunt-contrib-concat
- grunt-contrib-copy
- grunt-contrib-cssmin
- grunt-contrib-htmlmin
- grunt-contrib-imagemin
- grunt-contrib-jshint
- grunt-contrib-uglify
- grunt-responsive-images
- load-grunt-tasks

The apis used were provided by

- Google Map APIs - https://developers.google.com/maps/
- Yelp Search API - https://www.yelp.com/developers/documentation/v2/search_api
- Weather API - https://www.wunderground.com/
- Geolocation API - https://developers.google.com/maps/documentation/geolocation/intro
Application Overview
=====================

index.html - contains the single page of html
style.css - any styles used to show the site
app.js - the application javascript code

The user enters a valid location. Google map API converts that to a lat/long pair, which can then be used by the geolocation API to provide the nearest city/state. We leverage the location and one or more categories to find locations of interest.