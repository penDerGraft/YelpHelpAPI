//$(function () {
//    $('#getButton').click(function () {
//        $list = $('#cityList');

//        $.getJSON('api/Restaurants').done(function (data) {
//            $.each(data, function (key, item) {
//                $('<li>' + item.name + " - " + item.state + "<br/></li>")
//                    $.each(data, function (key, restaurant) { 
//                        $('<ul><li>' + restaurant.name + '<br/>' + restaurant.rating + '<br/>' + restaurant.category + '</li></ul>')
//                        .appendTo(item)
//                    })
                    //create latitude/long in each function
//var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
//var marker = new google.maps.Marker({
//    position: myLatlng,
//    title: "Hello World!"
//});

//                .appendTo($list);
//            });
//        })
//        .fail(function (jqXHR, textStatus, err) {
//            alert('Error: ' + err);
//        });
//    });
//});






var map;
var markers = [];

$(function () {
    $("#post-btn").click(postNewRestaurant);
    $("#search-rating").click(getByRating);
    $("#search-name-btn").click(getByName);
    $("#search-cat-btn").click(getByCategory);

    google.maps.event.addDomListener(window, 'load', initialize);
})

//==== CRUD Functions =====================================================================================================

//GET one
function showDetails(id) {
    $.getJSON('api/Restaurants/' + id).done(function (data) {
        $("#map-canvas").hide();
        $("<div class='reset'><div class='jumbotron'><div class='container'>" +
            '<img class="img-thumbnail pull-right" src="' + data.imageURL + '">' +
            "<h1>" + data.name + "<small> - " + data.rating + " Stars</small></h1>" +            
            "<p>" + data.category +            
            //"</p><span>Rating: " + data.rating +
            "</span><p>" + data.address + "</p>" +
            '<button class="btn btn-primary btn-lg" type="button" id="edit-btn" data-toggle="modal" data-target="#update-rest">Edit Restaurant</button>' +
            '<button class="btn btn-primary btn-lg" type="button" id="delete-btn">Delete Restaurant</button></div></div>' +
            '<div class="container"><div class="row"><div class="col-lg-4"><h2>Life-Changing</h2><p>&ldquo;Probably the best restaurant I have ever eaten at in my life' +
            'the food made me feel sad for myself over all the days that I had not been eating it. If you care about food at all PLEASE eat at this place.' +
            'best decision I have ever made.&rdquo;' + '</p></div>' +
            '<div class="col-lg-4"><h2>Not My Fav...</h2><p>&ldquo;The food was okay, but overpriced in my opinion. You could probably find the same kind of' +
            'food for much cheaper at other places. Still, the service was good the environment was nice. Defnitely kid-friendly. If you are willing to' +
            'pay more for that, then this might be a good place for you.&rdquo;</p></div>' +
            '<div class="col-lg-4"><h2>Awesome</h2><p>&ldquo;I keep reading reveiws saying the food is "okay." I think these people mixed this restaurant up with' +
            'another one or something. This place is amazing. Do yourself a favor and try it. I have now had every item on their menu and have never been'+
            'disappointed. Eat here. You will be glad you did.&rdquo;</p></div></div></div></div>'
         ).appendTo("body");
        $("#update-btn").click(function() {
            updateRestaurant(data.ID, data.rating, data.latitude, data.longitude, data.imageURL);
        });

        $("body").on("click", "#delete-btn", function () {
            deleteRestaurant(data.ID);
        });

    });
}

//POST
function postNewRestaurant() {
    var $name = $("#rest-name").val();
    var $category = $("#category").val();
    var $street = $("#add-line-1").val();
    var $city = $("#add-city").val();
    var $state = $("#add-state").val();
    var $zip = $("#add-zip").val();
    var $rating = parseFloat($("#rest-rating").val())
    var $lat = parseFloat($("#lat").val())
    var $long = parseFloat($("#long").val())

    var data =
    {
        name: $name,
        rating: $rating,
        category: $category,
        city: $city,
        address: $street + " " + $city + ", " + $state + " " + $zip,
        latitude: $lat,
        longitude: $long
    };

    $.ajax({
        url: '/api/Restaurants',
        type: 'POST',
        data: data,
        success: function (result) {
            console.log("It worked");
            getAllRestaurants();
        },
        error: function (jqXHR, textStatus, err) {
            console.log('Error: ' + err);
        }
    });
}

//PUT
function updateRestaurant(id, rating, lat, long, URL) {

    var $name = $("#up-rest-name").val();
    var $category = $("#up-category").val();
    var $street = $("#up-add-line-1").val();
    var $city = $("#up-add-city").val();
    var $state = $("#up-add-state").val();
    var $zip = $("#up-add-zip").val();

    var data =
    {
        ID: id,
        name: $name,
        rating: rating,
        category: $category,
        city: $city,
        address: $street + " " + $city + ", " + $state + " " + $zip,
        latitude: lat,
        longitude: long,
        imageURL: URL

    };

    $.ajax({
        url: '/api/Restaurants/' + id,
        type: 'PUT',
        data: data,
        success: function (result) {
            console.log("It Worked");
            $(".reset").html("");
            showDetails(id);
        },
        error: function (jqXHR, textStatus, err) {
            console.log('Error: ' + err);
        }
    });
}

//DELETE
function deleteRestaurant(id) {
    $.ajax({
        url: '/api/Restaurants/'+ id,
        type: 'DELETE',
        success: function (result) {
            console.log("It worked");
            location.reload(true);
        },
        error: function (jqXHR, textStatus, err) {
            console.log('Error: ' + err);
        }
    });

}

//Helper for GET queries
function getRestaurants(path) {
    $.getJSON('api/Restaurants' + path).done(function (data) {
        clearMarkers();
        $.each(data, function (key, rest) {
            var myLatlng = new google.maps.LatLng(rest.latitude, rest.longitude);

            var contentString = '<div id="content">' +
            '<h1 id="firstHeading" class="firstHeading">' + rest.name + '</h1>' +
            '<div id="bodyContent"><p>' + rest.category +'</p>' +
            '<img src="' + rest.ratingURL + '"><br>' +
            '<a href="#" class="pull-right" onclick=showDetails(' + rest.ID + ')>See Restaurant Details</a> ' +
            '</div></div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: rest.name
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            })

            markers.push(marker);
            // To add the marker to the map, call setMap();           
        })
        showMarkers();
    })
    .fail(function (jqXHR, textStatus, err) {
        console.log('Error: ' + err);
    });
}

//'?name=' + (encodeURIComponent("Little Rock"))
function getAllRestaurants() {
    getRestaurants('/');
}

function getByRating() {
    $rating = $('#nav-rest-rating').val();
    console.log($rating);

    getRestaurants('?rating=' + $rating);
}

function getByName() {
    $name = $('#search-name').val()
    getRestaurants('?name=' + (encodeURIComponent($name)));
}

function getByCategory() {
    $cat = $('#search-cat').val()
    getRestaurants('?category=' + $cat);
}

//==== MAP API Functions =====================================================================================================

function initialize() {

    var mapOptions = {
        center: { lat: 35.246819, lng: -91.733688 },
        zoom: 13
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
    //var center = new google.maps.LatLng(35.246819, -91.733688);

    //Start with all restaurant markers on map
    getAllRestaurants();
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }   
}

function showMarkers() {
    setAllMap(map);
}

function clearMarkers() {
    setAllMap(null);
    markers = [];
}


