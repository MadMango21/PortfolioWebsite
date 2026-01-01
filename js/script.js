$(window).on("load", function() {
    $(".loader .inner").fadeOut(1200,
        function() {
            $(".loader").fadeOut(750);
        });

    $(".items").isotope({
        filter: selector,
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
$('.owl-carousel').owlCarousel({
    loop:true,
    items: 4,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        768:{
            items:3
        },
        938:{
            items:4
        }
    }
});



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

$(".items").isotope({
  filter: '*',
  animationOptions: {
    duration:1500,
    easing: 'linear',
    queue: false
  }

});

$("#filters a").click(function() {

  $("#filters .current").removeClass("current");
  $(this).addClass("current");

  var selector = $(this).attr("data-filter");

  

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
