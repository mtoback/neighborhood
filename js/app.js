var viewModel = {
	address : ko.observable(''),
	city    : ko.observable(''),
	searches : ko.observableArray(['Post Office', 'Restaurant', 'Grocery Stores']),
	searchTag : ko.observable(),
	generateMap : function(){
		$.ajax({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location(),
			success: function(result){
				var lat = result.results[0].geometry.location.lat;
				var lng =  result.results[0].geometry.location.lng;
			  var mapProp = {
			    center:new google.maps.LatLng(lat,lng),
			    zoom:12,
			    mapTypeId:google.maps.MapTypeId.ROADMAP
			  };
			  $("#googleMap").show();
			  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
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
			  var near = 'Saratoga+CA';

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
				      term: $("#searchTag").val(),
				      location: viewModel.location()
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
						    title: name
						});
						function toggleBounce() {
						  if (marker.getAnimation() !== null) {
						    marker.setAnimation(null);
						  } else {
						    marker.setAnimation(google.maps.Animation.BOUNCE);
						  }
						};
						marker.addListener('click', toggleBounce);
						// To add the marker to the map, call setMap();
						marker.setMap(map);
					});
			      },
					error: function (xhr, ajaxOptions, thrownError) {
					        alert(xhr.status);
					        alert(thrownError);
					      }
    });

	}});
},
};
viewModel.location = ko.computed(function(){
	return this.address() + ',' + this.city();
}, viewModel);

ko.applyBindings(viewModel);

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