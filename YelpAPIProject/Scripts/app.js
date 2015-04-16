$(function () {
    $('#getButton').click(function () {
        $list = $('#cityList');

        $.getJSON('api/Restaurants').done(function (data) {
            $.each(data, function (key, item) {
                $('<li>' + item.name + " - " + item.rating + "<br/>" + item.category + '<br/>' + item.address + '</li>')
                 .appendTo($list);
            });
        })
        .fail(function (jqXHR, textStatus, err) {
            alert('Error: ' + err);
        });
    });
});
