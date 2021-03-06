$(document).ready(function() {
    var url_custom_digital;

    //Get ip saved
    if(localStorage.getItem('ip') !== '') {
        $( ".ip" ).val(localStorage.getItem('ip'));
        path()
    }

    //Get saved custom number
    if(localStorage.getItem('led-custom-number') !== '') {
        $( ".led-custom-number" ).val(localStorage.getItem('led-custom-number'));
        init_pin();
    }

    //Save the ip on change
    $( ".ip" ).change(function() {
        localStorage.setItem('ip', $(this).val());
        path();
        init_pin();
    });

    // Save the custom number on change
    $(".led-custom-number").change(function() {
        localStorage.setItem('led-custom-number', $(this).val());
        path();
        init_pin();
    });
    
    //Notification
    $('.notification').click(function() {
        $.get(url_custom_digital, function( data ) { 
            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    if(!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                });
            }
            if (Notification.permission === 'granted') {
                new Notification('Pin ' + $(".led-custom-number").val() +  ' Led', {
                    body : 'Pin state: ' + data.return_value
                });
            }
        });
    });

    //Control the custom led
    $('.led-custom').click(function() {
        var url_custom_;
        if($(this).is(':checked'))  {
            url_custom_ = url_custom_digital + '/1';
        } else {
            url_custom_ = url_custom_digital + '/0';
        }
        $.get( url_custom_, null);
    });
    //Set the path

    // set the URL for the ON/OFF GET request
    function path() {
        ip = $('.ip').val();
        url_custom_digital = 'http://' + ip + '/arduino/digital/' +
                             $('.led-custom-number').val();
    }

    // set OUTPUT mode for the selected pin
    function init_pin() {
        ip = $('.ip').val();
        pin = $('.led-custom-number').val();
        console.log("Init pin" + pin + " on " + ip);
        $.get('http://' + ip + '/arduino/mode/' + pin + '/o', null)
    }
});
