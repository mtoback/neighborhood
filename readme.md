# A Neighborhood Application
===========================

This application will give you information on any "neighborhood" you choose by providing an address, including:
- a map of the neighborhood showing the location of one or more items of interest in that neighborhood
- a list of one or more items of interest in that neighborhood
- the current weather in the neighborhood, and
- a way of filtering on those items

# Attribution
===========

This application makes use of the knockout.js package for flow control, jQuery for javascript functions, and bootstrap for application layout.

Icons for the map were obtained from http://map-icons.com/

This program used the following node-modules to generate the production code via the Gruntfile.js file:
- grunt
- grunt-contrib-clean
- grunt-contrib-copy
- grunt-contrib-csslint
- grunt-contrib-cssmin
- grunt-contrib-htmlmin
- grunt-contrib-imagemin
- grunt-contrib-jshint
- grunt-contrib-uglify
- grunt-jsdoc
- grunt-responsive-images
- grunt-w3c-html-validation
- load-grunt-tasks

The apis used were provided by

- Google Map APIs - https://developers.google.com/maps/
- Yelp Search API - https://www.yelp.com/developers/documentation/v2/search_api
- Weather API - https://www.wunderground.com/
- Geolocation API - https://developers.google.com/maps/documentation/geolocation/intro

# installation requirements

1. Install [node.js and npm](https://docs.npmjs.com/getting-started/installing-node) if required.
1. Install either [imageMagick or graphicsMagick](https://www.npmjs.com/package/grunt-responsive-images). I tested it with imageMagick.
1. run "npm install" in the home directory against package.json this will install the following packages:
+  grunt 1.0.1
+ grunt-contrib-clean 1.0.0
+ grunt-contrib-concat 1.0.1
+ grunt-contrib-cssmin 1.0.1
+ grunt-contrib-htmlmin 1.4.0
+ grunt-contrib-imagemin 1.0.0
+ grunt-contrib-jshint 1.0.0
+ grunt-contrib-uglify 1.0.1
+ grunt-contrib-watch 1.0.0
+ grunt-responsive-images 0.1.7
+ load-grunt-tasks 3.5.0

## How to update site

run grunt on top of site. Will generate dist directory for production site

# Application Overview
=====================

index.html - contains the single page of html
style.css - any styles used to show the site
app.js - the application javascript code

Documentation for the javascript can be found at doc/index.html
The user enters a valid location. Google map API converts that to a lat/long pair, which can then be used by the geolocation API to provide the nearest city/state. We leverage the location and one or more categories to find locations of interest via yelp. We leverage the lat/lng to generate the city/state to use with the weather.
