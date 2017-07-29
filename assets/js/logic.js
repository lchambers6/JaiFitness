//The code in this document is written in jQuery, a javascript library

//List of global variables that are used for the below functions
var apiKey = "AIzaSyDewJP5LDBqFfsHhOFECYVRIjO6wS8uD9U"; //API key for the google API
var state = ""			// state var from google for camp
var homeAddress = "";	// home address from user input
var homeLoc = [];		// Lat & Long object for map centering
var homeState = "";		// State from googleAPI
var campSites = [];		// location of site from camping api
var campName = [];		// campsite name from camping api
var petsAllowed = [];	// petsAllowed info from camping api
var sewerHookup = [];	// sewerHookup info from camping api
var waterHookup = [];	// waterHookup info from camping api
var waterFront = [];	// waterFront info from camping api
var facilityPhoto = [];	// url for facilityPhoto from camping api

//when a person types an address in the in the search box form (#addressForm) on the fist page and
//submits it be pressing enter this function recognizes it and grabs the value from the input field (#addressInput)
//the value is then assigned to the address varable and submitted to the google url function
$("#addressForm").submit( function(event) {			//jQuery function which triggers when form is submitted
    event.preventDefault();							//prevents default action for submit function
    var address = $("#addressInput").val().trim();	//Sets address to user input
    googleUrl(address);								//Passes address to build google api query
    $("form").trigger("reset");						//Resets form
});

//this function take in an address in string format and inserts it along with the apiKey variable into a
//predesignated url format designed by google. This url is assigned to a string variable googleURL which
//is submitted to the googleAPI function
function googleUrl(address) {
	var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;
	googleAPI(googleURL);
};

//This function takes in a predefined URL (URL set up according to google API specification) and returns a json
//object with address information. paste in the below url to your browser for an exmaple of the repsonse json
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Pennsylvania+Ave+NW,+Washington,+DC+20500&key=AIzaSyDewJP5LDBqFfsHhOFECYVRIjO6wS8uD9U
//A json obeject is simply an object of arrays and other objects so we can
//traverse into this json to pull out information. For this function we need to pull out the latitude and longitude
//information. To get the homeLat we will reach into the response oject and access the result parameter (responce.result)
//it turns out the result parameter houses an array of objects. the first object is important to us so we reach
//into the array using [] (response.result[0]) the next step down is another object so we use the . sytax to
//access it (response.result[0].geometry) the next two levels are also objects so again we use the . syntax
//to access them (response.results[0].geometry.location.lat) we do the same process to get the longitude.
//If google can find the submitted address it the json will have a status of "OK" if no results are found
//the status will equal "ZERO_RESULTS"
function googleAPI(googleURL) {
	$.ajax({					//Ajax is a jQuery function that send a request to the google API
		url: googleURL,			//this is URL expected by the google API
		method: "GET",			//We are choose to a GET request (there are other types of request)
		dataType: "json",		//The data type to be returned
	}).done(function(response){	//once the response from google has arrived call the .done callback function
		if (response.status === "OK") { //Checks if the return json status is ok
			if (findCountry(response).toUpperCase() === "US") { //Checks if address is in the US by using findcounty function
    		$("#errorMessage").empty(); //clears error message if present from #errorMessage
    		$("#map").empty(); //clears any content from #map
				var homeLat = response.results[0].geometry.location.lat; //go into the returned json and fetch the latitude via the given path and assign it to a varable
				var homeLng = response.results[0].geometry.location.lng; //go into the returned json and fetch the longitude via the given path and assign it to a varable
				homeLoc = {lat: homeLat, lng: homeLng}; //build an object with the lat and long information and assign it to the homeLoc Varable for the submitted address
			  stateGiver(response); //send the reponse json to the the stateGiver function
				$("#map").css("display", "block"); //displays map id
			  lastElementTop = $('#map').position().top ; //finds position of map id
			  $('html, body').animate({ scrollTop: lastElementTop}, 'slow'); //scrolls to position of map id
			} else { //if address is not in US displays an error message
				$("#errorMessage").html("<h2>Choose an Address in the US</h2>"); //displays error message
        $("#map").empty(); //clears any content from #map
        $("#map").hide(); //hides the map id
			}
    } else { //if address is not a real address display error message
	   		$("#errorMessage").html("<h2>Invalid Entry</h2>"); //displays error message
	   		$("#map").empty(); //clears any content from #map
        $("#map").hide(); //hides the map id
	   	}
  });
}

//This function takes in a json object retuned from a GoogleMaps API call and finds the two letter state code
//we have to use a double for loop to search through the json for the state code it searches through each address
//componant (first loop) then searches through each address componant type (second loop) and find the address
//componant type of "administrative_area_level_1" then sets the short name of the corresponding address componant
//the state variable then calls the geolist function
function stateGiver(response) {
	for (j = 0; j < response.results[0].address_components.length; j++) {
	  for (h = 0; h < response.results[0].address_components[j].types.length; h++) {
	    if (response.results[0].address_components[j].types[h] === "administrative_area_level_1") {
	      state = response.results[0].address_components[j].short_name;
	  	};
	  };
	};
	// geoList(state);
	geoJson(state);
};

//This function tests which country the submitted address originates. This function works just like stateGiver
function findCountry(response) {
	for (j = 0; j < response.results[0].address_components.length; j++) {
	  for (h = 0; h < response.results[0].address_components[j].types.length; h++) {
	    if (response.results[0].address_components[j].types[h] === "country") {
	      country = response.results[0].address_components[j].short_name;
	  	};
	  };
	};
	return country;
};

//This function queries the server and askes it to return a json object of all the campground geocoordinates
//It does this in the same way as the googleAPI function by employeeing an ajax call and supplying a URL
//of a specific format. This function takes in a two letter state code and builds this URL then send it to
//the server. The server knows how to handle a specific URL and return the correct information becuase of the
//geocode portion of the URL
function geoList(state) {
	$.ajax( {
        url: "https://campsites123.herokuapp.com/geocode/" + state,
        method: "GET",
        success: function(response){
        for (i = 0; i < response.length; i++) {
        var lat = Number(response[i].lat);
        var lng = Number(response[i].long);
        campSites.push({'lat': lat, 'lng': lng});
        }
        initMap();
      }
    })
}

//This function works exactly like the geoList function except this function has a slightly different URL
//specifically geojason vs geocode. There server knows how to hadle this difference. This function also
//takes the json returned from the server and parses it and fills up some global array variables which
//are later used to fill in the information about the campsites when clicked on the map
function geoJson(state) {
	$.ajax( {
        url: "https://campsites123.herokuapp.com/geojson/" + state,
        method: "GET",
        success: function(response){
        for (i = 0; i < response.length; i++) { //looks through the response json and pulls out information
        	var lat = Number(response[i].lat); //pulls out lat from json and assigns to variable
        	var lng = Number(response[i].long); //pulls out long from json and assigns to variable
        	campSites.push({'lat': lat, 'lng': lng}); //puts lat and long in an array of objects called campSites
        	campName.push(response[i].facilityName); //fills the campName array
        	petsAllowed.push(convertYesNo(response[i].petsAllowed)); //fills the petAllowed array uses convertYesNo
        	sewerHookup.push(convertYesNo(response[i].sewerHookup)); //fills the sewerHookup array uses convertYesNo
        	waterHookup.push(convertYesNo(response[i].waterHookup)); //fills the waterHookup array uses convertYesNo
        	waterFront.push(convertYesNo(response[i].waterFront)); //fills the waterFront array uses convertYesNo
        	facilityPhoto.push(response[i].facilityPhoto); //fills the faciliy photo array with the photo url
    	}
    	initMap(); //calls initMap function
      }
    })
}

//The amity informations returned from the server confirms with a "Y", "N", or "" this function converts
//those the "Yes", "No", or "Unknown"
function convertYesNo(str) { //function takes in a string
	if(str === "Y") { //does that string equal "Y"
		return "Yes" //then return the string "Yes"
	} else if (str === "N") { //does that string equal "N"
		return "No" //then return the string "No"
	} else { //does that string equal something besides "Y" or "N"
		return "Unknown" //then return the string Unknown
	}
}

//This functions takes in string of all lowercase letters and returns that string in titlecase
//(First letter of each word capitalized)
function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) { //searches a string spaces (\s) and new words (\w)
        return match.toUpperCase(); //changes the beginning of the word to uppercase
    });
}

//This function intializes the google map in the DOM which will be filled with marker icons
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), { //looks for id in the HTML named map and sets it to display the google map
		zoom: 9, //sets zoom for this google map
		center: homeLoc, //centers the map on the gps coordinates for the submited address
    	scrollwheel: false //prevents the map from sooming with the mouse scrool wheel
	});

	var homeMarker = new google.maps.Marker({ //creates a marker for the submited address
		position: homeLoc, //places a marker on the gps coordinates saved in the homeLoc object (the submitted address)
		title: "Searched Address", //this title presented when you hover over the icon for the submitted address
		icon: "assets/images/homeIcon.png", //uses this image for the icon of the submitted address
		map: map //sets the map to displayed the map generated above
	});

	for(i=0; i < campSites.length; i++){ //this loop searches thought the arrays filled in the geojson function and fills in the information to be displayed on the map
		var siteName = toTitleCase(he.decode(campName[i]).toLowerCase()); //takes ith element from the campName array and changes it to lowercase then uses the he.js library of function (extrally downloaded) and convert char numbers to their corresponding characters then pases it to the titlecase function and assigns it to a variable
		var marker = new google.maps.Marker({ //makes a marker to be used for the ith element of the campSites array
		position: campSites[i], //positions the marker in on the gps corrdinates for the ith element of the campSites array
		title: siteName, //this title presented when you hover over the icon for the submitted address
		icon: "assets/images/mapmarker.png", //uses this image for the icon
		map: map //sets the map to displayed the map generated above
		});
		//the below line will fills in the information for the infoWindow which popsup when you click on the icons in the map. it gets this information from the array filled in the geojson function
		var content = "<div style='text-align:left;'><div style='font-size:15px;font-weight: bold;'>Name: " + siteName + "</div>" + "<img src='http://www.reserveamerica.com/"+ facilityPhoto[i] + "'>" + "<br>Pets Allowed: " + petsAllowed[i] + "<br>Sewer Hookup: " + sewerHookup[i] + "<br>Water Hookup: " + waterHookup[i] + "<br>Water Front: " + waterFront[i] + "</div>";
		var infowindow = new google.maps.InfoWindow(); //created an infowindow to be displayed when you click on a icon in the man
		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ //listnes for the user to lick on of the isons in the map
	        return function() { //returns the information to be presented in the infowindoe
	           infowindow.setContent(content); //fills the content in the infowindow with the content variable set above
	           infowindow.open(map,marker); //opens the infowindow in the map
	        };
	    })(marker,content,infowindow));
	};
}

//This function displays the Meet the Developers page once the user clicks the "Meet the Developers" button
$("#developers").on('click', function(){			//jQuery function which triggers when developers link clicked
    $(".container").css("display", "block");		//displays the previously hidden container class block
    lastElementTop = $('.container').position().top ; //finds the position of the container class and assigns to variable
    $('html, body').animate({scrollTop: lastElementTop}, 'slow'); //scrolls to the position found in last line
});

//This function displays the Resources page once the user clicks the "Resources" button
//works the exact same way as the previous Developers link
$("#Resources").on('click', function(){
    $(".Resources").css("display", "block");
    lastElementTop = $('.Resources').position().top ;
    $('html, body').animate({scrollTop: lastElementTop}, 'slow');
});


//This Function scrolls to the top of the page when click the camping icon in top left corner
$('#logo').on('click', function(){					//jQuery function which triggers when camp icon is clicked
    $('html, body').animate({ scrollTop: 0 }, 'slow'); //scrolls to position 0 (top of page)
})
