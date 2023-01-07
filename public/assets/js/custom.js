 
    $('#doller_site').owlCarousel({
   margin:30,
  loop: true,
  autoplay: true,
  autoplayHoverPause: true,
   mouseDrag : true,
   dots: true,
  navText: ["<img src='assets/images/left.png'>","<img src='assets/images/right.png'>"],
  responsive: {
    0: {
      items:1
    },
    600: {
      items: 1
    },
    700: {
      items: 1
    },
     750: {
      items: 1
    },
    800: {
      items:1
    },
    900: {
      items: 1
    },
    1000: {
      items: 1
    },
     1200: {
      items: 1
    },
     1400: {
      items: 1
    }
  }

});




    $('#How_it_Works').owlCarousel({
   margin:30,
  loop: true,
  autoplay: true,
  
  autoplayHoverPause: true,
   mouseDrag : true,
   dots: true,
  navText: ["<img src='assets/images/Arrow_left.png'>","<img src='assets/images/Arrow_right.png'>"],
  responsive: {
    0: {
           items: 1,
      dotsEach:3
    },
    600: {
       items: 1,
      dotsEach:3
    },
    700: {
            items: 1,
      dotsEach:3
    },
     750: {
      items: 1,
      dotsEach:3
    },
    800: {
            items: 1,
      dotsEach:3
    },
    900: {
            items: 1,
      dotsEach:3
    },
    1000: {
          items: 1,
      dotsEach:3
    },
     1200: {
            items: 1,
      dotsEach:3
    },
     1400: {
      items: 1,
      dotsEach:3
    }
  }

});


   
 



  $(document).ready(function() {
      $('.minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
      });
      $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
      });
    });