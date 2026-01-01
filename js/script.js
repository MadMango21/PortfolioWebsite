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

animation:'fade',
play: 5000
});

var typed = new Typed(".typed", {
strings: ["Game Designer.", "Director.","Photographer.", "Human."],
typeSpeed: 70,
loop: true,
startDelay: 1000,
showCursor: false

});
$(document).ready(function () {
    var owl = $(".owl-carousel"),
        // rangeArr = [],
        inputType = $("input[type=range]");
    owl.owlCarousel({
        loop: true,
        mouseDrag: true,
        autoplay: false,
        responsive: {
            0: {
                items: 1,
                slideBy: 1

            },
            480: {
                items: 2,
                slideBy: 1

            },
            768: {
                items: 3,
                slideBy: 1
            },
            938: {
                items: 4,
                slideBy: 1
            }
        }

    });
    //   function getIndex(event) {

    //   }
    owl.on('changed.owl.carousel', function (event) {
        console.log(event.item.index);
        inputType.val(event.item.index);

    });

    $(".go-me").click(function () {
        owl.trigger("next.owl.carousel");
    });
    $(".back-me").on("click", function () {
        owl.trigger("prev.owl.carousel");
    });
    $("input").on("change", function (e) {
        e.preventDefault();
        console.log(inputType.val());
        // console.log(e.item.index);
        // FIGURE OUT HOW TO GET CAROUSEL INDEX

        $('.owl-carousel').trigger('to.owl.carousel', [inputType.val(), 1, true]);

    });
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})




//2003.21875
  var skillsTopOffset = $(".skillsSection").offset().top;
  var statsTopOffset = $(".statsSection").offset().top;
  var countUpFinished = false;

  $(window).scroll(function(){

    if(window.pageYOffset > skillsTopOffset - $(window).height()+200){

      $('.chart').easyPieChart({
            easing: 'easeInOut',
            barColor: '#fff',
            trackColor: false,
            scaleColor: false,
            lineWidth: 4,
            size: 152,
            animate:{
              duration: 3000,
              enabled: true
            },
            onStep: function(from, to, percent){
              $(this.el).find('.percent').text(Math.round(percent));
            }
        });

    }

    if(!countUpFinished && window.pageYOffset > statsTopOffset - $(window).height()+200){
      $(".counter").each(function(){
          var element = $(this);
          var endVal = parseInt(element.text());

          element.countup(endVal);
        })
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
    const navTop = nav.offset().top;

    $(window).on("scroll", stickyNavigation);

    function stickyNavigation() {

        var body = $("body");

        if ($(window).scrollTop() >= $(".overlay").height()) {
            body.css("padding-top", nav.outerHeight() + "px");
            body.addClass("fixedNav");
        }
        else {
            body.css("padding-top", 0);
            body.removeClass("fixedNav");
        }
    }

});
