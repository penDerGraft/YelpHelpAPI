$(function () {
    $('#getButton').click(function () {
        $list = $('#cityList');

        $.getJSON('api/City').done(function (data) {
            $.each(data, function (key, item) {
                $('<li>' + item.name + " - " + item.state + "<br/></li>")
                    $.each(data, function (key, restaurant) { 
                        $('<ul><li>' + restaurant.name + '<br/>' + restaurant.rating + '<br/>' + restaurant.category + '</li></ul>')
                        .appendTo(item)
                    })
                .appendTo($list);
            });
        })
        .fail(function (jqXHR, textStatus, err) {
            alert('Error: ' + err);
        });
    });
});
