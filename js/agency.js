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

    //Cycles through the heading titles 
    var serviceArray = ['<a href="https://www.google.com/" target="_blank">Training</a>', '<a href="https://www.facebook.com/" target="_blank">Yoga</a>', '<a href="http://www.bing.com/" target="_blank">Meditating</a>'],
        i = -1;
    (function f() {
        i = (i + 1) % serviceArray.length;
        $("#movingHeader").html(serviceArray[i]);
        setTimeout(f, 3500);
    })();
})(jQuery); // End of use strict
