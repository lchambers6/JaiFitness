// Agency Theme JavaScript

(function ($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    //Before noon it says good morning, after noon it says welcome
    var currentTime = new Date();
    var hours = currentTime.getHours();
    if (hours <= 12) {
        $("#greeting").html("Good Morning!");
    }
    //Cycles through the heading titles
    var serviceArray = ['training', 'yoga', 'meditation', 'hiking', 'restoring', 'achieving', 'lifting', 'walking', 'resting', 'running', 'playing', 'feeling', 'sweating', 'pushing', 'pulling', 'jumping', 'swimming', 'climbing', 'exercising', 'stretching', 'loving'],
    i = -1;
    (function f() {
        i = (i + 1) % serviceArray.length;
        $("#movingHeader").html(serviceArray[i]);
        setTimeout(f, 2000);
    })();
})(jQuery); // End of use strict
