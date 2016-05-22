var viewModel = {
	address : ko.observable(''),
	city    : ko.observable(''),
	searches : ko.observableArray(['Post Office', 'Restaurant', 'Grocery Stores']),
	markers : ko.observableArray(),
	displayMarkers: ko.observableArray(),
	searchTag : ko.observable(),
	localWeather : ko.observable(),
	filter: ko.observable(""),
	zoom: ko.observable(12),
	filterMap: function(){
		var filter = viewModel.filter();
		if (viewModel.markers().length > 0){
			setMapOnAll(null, viewModel.displayMarkers());
			viewModel.displayMarkers.removeAll();
			for (var i=0;i<viewModel.markers().length;i++){
				if(viewModel.markers()[i].title.indexOf(filter)> -1){
					viewModel.displayMarkers.push(viewModel.markers()[i]);
				}
			}
			setMapOnAll(map, viewModel.displayMarkers());
		}
	},
	// weather example: http://api.wunderground.com/api/421920ddc8bd7347/forecast/q/CA/Saratoga.json
	// lat long -> city : http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true
	weather: function(lat, lng){
		$.ajax({
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true',
			success: function(result){
				var components = result.results[0].address_components;
				var len = components.length;
				var foundCity = false;
                var foundState = false;
                var city = '';
                var state = '';
                // continue in loop until city and state found or items exhausted
				for(var i=0; i< len && !(foundCity && foundState); i++){
					var component = components[i];
					if (component.types[0] === 'locality'){
						city = component.long_name;
						foundCity = true;
					} else if (component.types[0]=== "administrative_area_level_1"){
						state = component.short_name;
						found_state = true;
					}
				}
				$.ajax({
					url: 'http://api.wunderground.com/api/421920ddc8bd7347/forecast/q/' + state + '/' + city + '.json',
					success: function(result){
						var forecast = result.forecast.simpleforecast.forecastday[0];
						var temp = forecast.low.fahrenheit + '-' + forecast.high.fahrenheit;
						var conditions = forecast.conditions;
						viewModel.localWeather(conditions + ':' + temp);
					}
				});
			}
		});
	},
	generateMap : function(){
		$.ajax({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location(),
			error: function (xhr, ajaxOptions, thrownError) {
			        if (xhr.status === 404){
			        	alert("internet failure occurred. Please check your connection");
			        } else {
			        	alert("unknown error occurred... status = " + xhr.status);
			        }
			      },
			success: function(result){
			  var lat = result.results[0].geometry.location.lat;
			  var lng =  result.results[0].geometry.location.lng;
			  viewModel.weather(lat,lng);
			  var mapProp = {
			    center:new google.maps.LatLng(lat,lng),
			    zoom: viewModel.zoom(),
			    mapTypeId:google.maps.MapTypeId.ROADMAP
			  };
			  $("#googleMap").show();
			  // this should be visible at the top level to enable us to control it
			  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
			  var auth = {
			    consumerKey : "IuMIJl585jfMDHz7spOj3w",
			    consumerSecret : "8qnDc0yEa59ZHfXN1uM3XY-RcW4",
			    accessToken : "bfEYLApv2Hxfs0vDEh6TMRsOllsGYEG1",
			    accessTokenSecret : "zcavaTCQX2wlPIjvm4DqUzzGV94",
			    serviceProvider : {
			        signatureMethod : "HMAC-SHA1"
			    }
			  };

			  var terms = 'food';
			  var near = viewModel.location();

				var accessor = {
				    consumerSecret : auth.consumerSecret,
				    tokenSecret : auth.accessTokenSecret
				};
				var parameters = {
				      oauth_consumer_key: "IuMIJl585jfMDHz7spOj3w",
				      oauth_token: "bfEYLApv2Hxfs0vDEh6TMRsOllsGYEG1",
				      oauth_nonce: nonce_generate(),
				      oauth_timestamp: Math.floor(Date.now()/1000),
				      oauth_signature_method: 'HMAC-SHA1',
				      oauth_version : '1.0',
				      callback: 'cb',
				      term: "restaurant",
				      location: viewModel.location(),
				      radius_filter: viewModel.radius_filter()
				    };
				var message = {
				    'action' : 'http://api.yelp.com/v2/search',
				    'method' : 'GET',
				    'parameters' : parameters
				};

				function nonce_generate() {
				  return (Math.floor(Math.random() * 1e12).toString());
				}
				var yelp_url = "https://api.yelp.com/v2/search";
				var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, "8qnDc0yEa59ZHfXN1uM3XY-RcW4",
					"zcavaTCQX2wlPIjvm4DqUzzGV94");
			    parameters.oauth_signature = encodedSignature;
                $.ajax({
			      url: yelp_url,
			      data: parameters,
			      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
			      dataType: 'jsonp',
			      success: function(results) {
			        var businesses = results.businesses;
			        businesses.forEach(function(business){
			        	var name = business.name;
			        	var url = business.mobile_url;
			        	var lat = business.location.coordinate.latitude;
			        	var lng = business.location.coordinate.longitude;
						var myLatlng = new google.maps.LatLng(lat, lng);

						var marker = new google.maps.Marker({
						    position: myLatlng,
							animation: google.maps.Animation.DROP,
						    title: name,
						    url: url
						});
						viewModel.markers.push(marker);
						viewModel.displayMarkers.push(marker);
						function toggleBounce() {
						  if (marker.getAnimation() !== null) {
						    marker.setAnimation(null);
						  } else {
						    marker.setAnimation(google.maps.Animation.BOUNCE);
						  }
						}
						marker.addListener('click', toggleBounce);
						// To add the marker to the map, call setMap();
						marker.setMap(map);
					});
					if (businesses.length > 0){
						$("#search").show();
					}
			      },
					error: function (xhr, ajaxOptions, thrownError) {
					        if (xhr.status === 404){
					        	alert("internet failure occurred. Please check your connection");
					        } else {
					        	alert("unknown error occurred... status = " + xhr.status);
					        }
					      }
    });

	}});
},
};

// Sets the map on all markers in the array.
function setMapOnAll(map, markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
viewModel.radius_filter = ko.computed(function(){
		if(this.zoom() === 11){
			return 40000;
		} else if(this.zoom() === 12) {
			return 20000;
		} else if (this.zoom() === 13){
			return 10000;
		} else {
			return 10000;
		}
	}, viewModel);
viewModel.location = ko.computed(function(){
	return this.address() + ',' + this.city();
}, viewModel);

ko.applyBindings(viewModel);
$( "#slider" ).slider({
	  // allow value to go from 11->12->13
      value: 250,
      min: 0,
      max: 500,
      step: 250,
      slide: function( event, ui ) {
        var value = ui.value;
        viewModel.zoom(11+value/250);
      }
    });
function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
$("#googleMap").hide();
google.maps.event.addDomListener(window, 'load', initialize);