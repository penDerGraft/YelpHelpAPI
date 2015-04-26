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
        },
        error: function (jqXHR, textStatus, err) {
            console.log('Error: ' + err);
        }
    });
}

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

function initialize() {
    var mapOptions = {
        center: { lat: 39.203315, lng: -95.419616 },
        zoom: 5
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    //$.getJSON function should go here. 

    var myLatlng = new google.maps.LatLng(35.246819, -91.733688);
    var mapOptions = {
        zoom: 4,
        center: myLatlng
    }

    var contentString = '<div id="content">'+
    '<h1 id="firstHeading" class="firstHeading">Searcy</h1>'+
    '<a href="#" onclick=showDetails(18)>See Restaurant Details</a> '+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Searcy, AR'
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);

    $("#post-btn").click(postNewRestaurant);
    
}
google.maps.event.addDomListener(window, 'load', initialize);
