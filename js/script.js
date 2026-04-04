$(window).on("load", function() {
    $(".loader .inner").fadeOut(1200,
        function() {
            $(".loader").fadeOut(750);
        });

    $(".items").isotope({
        filter: '*',
        animationOptions: {
            duration: 1500,
            easing: 'linear',
            queue: false
        }
    });
});

$(document).ready(function () {

    $('#slides').superslides({
        animation: 'fade',
        play: 8000
    });

    new window.Typed(".typed", {
        strings: [ "Game Designer.", "Combat Designer.", "Systems Designer.", "AI Designer.", "Director.", "Photographer.", "Human."],
        typeSpeed: 70,
        loop: true,
        startDelay: 2000,
        showCursor: false
    });

    var statsTopOffset = $(".statsSection").offset().top;
    var countUpFinished = false;

    $(window).scroll(function() {
        if (!countUpFinished && window.pageYOffset > statsTopOffset - $(window).height() + 200) {
            $(".counter").each(function() {
                var element = $(this);
                var endVal = parseInt(element.text());
                element.countup(endVal);
            });
            countUpFinished = true;
        }
    });

    $("[data-fancybox]").fancybox();

    $("#filters a").click(function() {
        $("#filters .current").removeClass("current");
        $(this).addClass("current");

        var selector = $(this).attr("data-filter");

        $(".items").isotope({
            filter: selector,
            animationOptions: {
                duration: 1500,
                easing: 'linear',
                queue: false
            }
        });

        return false;
    });

    const nav = $("#navigation");

    $(window).on("scroll", stickyNavigation);

    function stickyNavigation() {
        var body = $("body");
        if ($(window).scrollTop() >= $(".overlay").height()) {
            body.css("padding-top", nav.outerHeight() + "px");
            body.addClass("fixedNav");
        } else {
            body.css("padding-top", 0);
            body.removeClass("fixedNav");
        }
    }

});
