/**
  This file handles three different external APIs - Google Map, Yelp, and weather
  The Google Geocode API is used as a way to get from location to lat/lng, which
  is needed for the weather API..
**/
/** declare map as a global variable so it is visible to both the view model and markers */
var map;
/**
   view model handles *most* of the interaction between the view and the model. The exception
   is when you click on the markers, either the markers themselves or the list. That is handled
   via standard jQuery calls

   The view model tracks the markers returned as a static list and the displayMarkers, markers displayed,
   as a dynamic list.
**/
var ViewModel = function() {
        this.location = ko.observable('18764 Cox Ave, Saratoga CA');
        this.searches = ko.observableArray(['Post Office', 'Restaurant', 'Grocery Stores']);
        this.markers = ko.observableArray();
        this.displayMarkers = ko.observableArray();
        this.currentMarker = ko.observable();
        this.searchTag = ko.observable();
        this.localWeather = ko.observable();
        this.filter = ko.observable('');
        this.zoom = ko.observable(12);
    }
    /**
   when you click on the list, you want it to bounce the marker and generate the
   detailed entry
**/
ViewModel.prototype.updateMarker = function(marker) {
    if (typeof viewModel.currentMarker() !== 'undefined') {
        var aMarker = viewModel.currentMarker();
        if (aMarker.getAnimation() !== null) {
            aMarker.setAnimation(null);
        }
    }
    viewModel.currentMarker(marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
};

/**
	 execute the filter. Also, clear the detail entry
	**/
this.ViewModel.prototype.filterMap = function() {
    if (typeof viewModel.currentMarker() !== 'undefined') {
        var marker = viewModel.currentMarker();
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        }
    }
    var filter = viewModel.filter();
    if (viewModel.markers().length > 0) {
        setMapOnAll(null, viewModel.displayMarkers());
        viewModel.displayMarkers.removeAll();
        for (var i = 0; i < viewModel.markers().length; i++) {
            if (viewModel.markers()[i].title.indexOf(filter) > -1) {
                viewModel.displayMarkers.push(viewModel.markers()[i]);
            }
        }
        setMapOnAll(map, viewModel.displayMarkers());
    }
};
// weather example: http://api.wunderground.com/api/421920ddc8bd7347/forecast/q/CA/Saratoga.json
// lat long -> city : http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true
ViewModel.prototype.weather = function(lat, lng) {
    $.ajax({
        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true',
        success: function(result) {
            var components = result.results[0].address_components;
            var len = components.length;
            var foundCity = false;
            var foundState = false;
            var city = '';
            var state = '';
            // continue in loop until city and state found or items exhausted
            for (var i = 0; i < len && !(foundCity && foundState); i++) {
                var component = components[i];
                if (component.types[0] === 'locality') {
                    city = component.long_name;
                    foundCity = true;
                } else if (component.types[0] === 'administrative_area_level_1') {
                    state = component.short_name;
                    found_state = true;
                }
            }
            // Call the weather API given the city/state associated with the lat/lng
            $.ajax({
                url: 'http://api.wunderground.com/api/421920ddc8bd7347/forecast/q/' + state + '/' + city + '.json',
                success: function(result) {
                    var forecast = result.forecast.simpleforecast.forecastday[0];
                    var temp = forecast.low.fahrenheit + '-' + forecast.high.fahrenheit;
                    var conditions = forecast.conditions;
                    viewModel.localWeather(conditions + ':' + temp);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    if (xhr.status === 404) {
                        alert('internet failure occurred. Please check your connection');
                    } else {
                        alert('unknown error occurred... status = ' + xhr.status);
                    }
                }
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status === 404) {
                alert('internet failure occurred. Please check your connection');
            } else {
                alert('unknown error occurred... status = ' + xhr.status);
            }
        }
    });
};

var viewModel = new ViewModel();
/**
   iife to get the map generated
**/
(function(viewModel) {
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + viewModel.location(),
        success: function(result) {
            lat = result.results[0].geometry.location.lat;
            lng = result.results[0].geometry.location.lng;
            viewModel.weather(lat, lng);
            var mapProp = {
                center: new google.maps.LatLng(lat, lng),
                zoom: viewModel.zoom(),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
            initYelp(viewModel, map);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status === 404) {
                alert('internet failure occurred. Please check your connection');
            } else {
                alert('unknown error occurred... status = ' + xhr.status);
            }
        }
    });
})(viewModel);
/**
	initialize yelp and get generate marker array
	**/
function initYelp(viewModel, map) {
    var auth = {
        consumerKey: 'IuMIJl585jfMDHz7spOj3w',
        consumerSecret: '8qnDc0yEa59ZHfXN1uM3XY-RcW4',
        accessToken: 'bfEYLApv2Hxfs0vDEh6TMRsOllsGYEG1',
        accessTokenSecret: 'zcavaTCQX2wlPIjvm4DqUzzGV94',
        serviceProvider: {
            signatureMethod: 'HMAC-SHA1'
        }
    };


    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };
    var parameters = {
        oauth_consumer_key: auth.consumerKey,
        oauth_token: auth.accessToken,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        term: 'restaurant',
        location: 'Saratoga CA',
        radius_filter: viewModel.radius_filter()
    };
    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    var yelp_url = 'https://api.yelp.com/v2/search';
    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, '8qnDc0yEa59ZHfXN1uM3XY-RcW4',
        'zcavaTCQX2wlPIjvm4DqUzzGV94');
    parameters.oauth_signature = encodedSignature;
    $.ajax({
        url: yelp_url,
        data: parameters,
        cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            /**
	      	for each business, get information and put into marker data
	      	including categories for later display
	      	**/
            var businesses = results.businesses;
            businesses.forEach(function(business) {
                var name = business.name;
                var url = business.mobile_url;
                var categories = [];
                business.categories.forEach(function(category) {
                    categories.push(category[0]);
                });
                var lat = business.location.coordinate.latitude;
                var lng = business.location.coordinate.longitude;
                var myLatlng = new google.maps.LatLng(lat, lng);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    animation: google.maps.Animation.DROP,
                    title: name,
                    url: url,
                    categories: categories.join(', ')
                });
                viewModel.markers.push(marker);
                viewModel.displayMarkers.push(marker);
                /**
				   when you click on a marker, you want it to bounce the marker and generate the
				   detailed entry
				**/
                function toggleBounce() {
                    if (typeof viewModel.currentMarker() !== 'undefined') {
                        var aMarker = viewModel.currentMarker();
                        if (aMarker.getAnimation() !== null) {
                            aMarker.setAnimation(null);
                        }
                    }
                    viewModel.currentMarker(marker);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
                marker.addListener('click', toggleBounce);
                // To add the marker to the map, call setMap();
                marker.setMap(map);
            });
            if (businesses.length > 0) {
                $('#search').show();
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status === 404) {
                alert('internet failure occurred. Please check your connection');
            } else {
                alert('unknown error occurred... status = ' + xhr.status);
            }
        }
    });
}
/**
	  generate nonce for yelp api
	**/
function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
}
// Sets the map on all markers in the array.
// if map == None it clears markers from map
function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/**
convert Google map zoom setting to yelp radius filter
**/
viewModel.radius_filter = ko.computed(function() {
    if (this.zoom() === 11) {
        return 40000;
    } else if (this.zoom() === 12) {
        return 20000;
    } else if (this.zoom() === 13) {
        return 10000;
    } else {
        return 10000;
    }
}, viewModel);


ko.applyBindings(viewModel);