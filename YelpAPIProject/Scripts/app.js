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

function initialize() {
    var mapOptions = {
        center: { lat: 39.203315, lng: -95.419616 },
        zoom: 5
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    //$.getJSON function should go here. 
}
google.maps.event.addDomListener(window, 'load', initialize);
