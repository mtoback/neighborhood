function initYelp(viewModel,map){var auth={consumerKey:"IuMIJl585jfMDHz7spOj3w",consumerSecret:"8qnDc0yEa59ZHfXN1uM3XY-RcW4",accessToken:"bfEYLApv2Hxfs0vDEh6TMRsOllsGYEG1",accessTokenSecret:"zcavaTCQX2wlPIjvm4DqUzzGV94",serviceProvider:{signatureMethod:"HMAC-SHA1"}},parameters=({consumerSecret:auth.consumerSecret,tokenSecret:auth.accessTokenSecret},{oauth_consumer_key:auth.consumerKey,oauth_token:auth.accessToken,oauth_nonce:nonce_generate(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",oauth_version:"1.0",callback:"cb",term:"restaurant",location:"Saratoga CA",radius_filter:viewModel.radius_filter()}),yelp_url="https://api.yelp.com/v2/search",encodedSignature=oauthSignature.generate("GET",yelp_url,parameters,"8qnDc0yEa59ZHfXN1uM3XY-RcW4","zcavaTCQX2wlPIjvm4DqUzzGV94");parameters.oauth_signature=encodedSignature,$.ajax({url:yelp_url,data:parameters,cache:!0,dataType:"jsonp",success:function(results){var businesses=results.businesses;businesses.forEach(function(business){function toggleBounce(item){null!==marker.getAnimation()?marker.setAnimation(null):marker.setAnimation(google.maps.Animation.BOUNCE),$("#about").html("<a href='"+marker.url+"'>"+marker.title+"</a>  <span>"+marker.categories+"</span>"),$("#about").show()}var name=business.name,url=business.mobile_url,categories=[];business.categories.forEach(function(category){categories.push(category[0])});var lat=business.location.coordinate.latitude,lng=business.location.coordinate.longitude,myLatlng=new google.maps.LatLng(lat,lng),marker=new google.maps.Marker({position:myLatlng,animation:google.maps.Animation.DROP,title:name,url:url,categories:categories.join(", ")});viewModel.markers.push(marker),viewModel.displayMarkers.push(marker),marker.addListener("click",toggleBounce),marker.setMap(map)}),businesses.length>0&&$("#search").show()},error:function(xhr,ajaxOptions,thrownError){404===xhr.status?alert("internet failure occurred. Please check your connection"):alert("unknown error occurred... status = "+xhr.status)}})}function nonce_generate(){return Math.floor(1e12*Math.random()).toString()}function setMapOnAll(map,markers){for(var i=0;i<markers.length;i++)markers[i].setMap(map)}var map,viewModel={location:ko.observable("18764 Cox Ave, Saratoga CA"),searches:ko.observableArray(["Post Office","Restaurant","Grocery Stores"]),markers:ko.observableArray(),displayMarkers:ko.observableArray(),searchTag:ko.observable(),localWeather:ko.observable(),filter:ko.observable(""),zoom:ko.observable(12),filterMap:function(){$("#about").html("");var filter=viewModel.filter();if(viewModel.markers().length>0){setMapOnAll(null,viewModel.displayMarkers()),viewModel.displayMarkers.removeAll();for(var i=0;i<viewModel.markers().length;i++)viewModel.markers()[i].title.indexOf(filter)>-1&&viewModel.displayMarkers.push(viewModel.markers()[i]);setMapOnAll(map,viewModel.displayMarkers())}},weather:function(lat,lng){$.ajax({url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true",success:function(result){for(var components=result.results[0].address_components,len=components.length,foundCity=!1,foundState=!1,city="",state="",i=0;len>i&&(!foundCity||!foundState);i++){var component=components[i];"locality"===component.types[0]?(city=component.long_name,foundCity=!0):"administrative_area_level_1"===component.types[0]&&(state=component.short_name,found_state=!0)}$.ajax({url:"http://api.wunderground.com/api/421920ddc8bd7347/forecast/q/"+state+"/"+city+".json",success:function(result){var forecast=result.forecast.simpleforecast.forecastday[0],temp=forecast.low.fahrenheit+"-"+forecast.high.fahrenheit,conditions=forecast.conditions;viewModel.localWeather(conditions+":"+temp)}})}})}};!function(viewModel){$.ajax({url:"https://maps.googleapis.com/maps/api/geocode/json?address="+viewModel.location(),success:function(result){lat=result.results[0].geometry.location.lat,lng=result.results[0].geometry.location.lng,viewModel.weather(lat,lng);var mapProp={center:new google.maps.LatLng(lat,lng),zoom:viewModel.zoom(),mapTypeId:google.maps.MapTypeId.ROADMAP};map=new google.maps.Map(document.getElementById("googleMap"),mapProp),initYelp(viewModel,map)},error:function(xhr,ajaxOptions,thrownError){404===xhr.status?alert("internet failure occurred. Please check your connection"):alert("unknown error occurred... status = "+xhr.status)}})}(viewModel),viewModel.radius_filter=ko.computed(function(){return 11===this.zoom()?4e4:12===this.zoom()?2e4:(13===this.zoom(),1e4)},viewModel),$("#search").on("click","li span",function(){var title=$(this).html();viewModel.displayMarkers().forEach(function(marker){marker.title===title&&(null!==marker.getAnimation()?marker.setAnimation(null):marker.setAnimation(google.maps.Animation.BOUNCE),$("#about").html("<a href='"+marker.url+"'>"+marker.title+"</a>  <span>"+marker.categories+"</span>"),$("#about").show())})}),ko.applyBindings(viewModel);