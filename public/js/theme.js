$(document).ready(function () {
  'use strict';

  //-------- Fixed Header Js ----------//
  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= 80) {
      $('.header-area').addClass('header-fixed');
    } else {
      $('.header-area').removeClass('header-fixed');
    }
  });

  // -------   Owl Carousel -----//
  function home_banner_slider() {
    if ($('.home-banner-owl').length) {
      $('.home-banner-owl').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        nav: false,
        autoplay: 2500,
        smartSpeed: 1500,
        dots: false,
        responsiveClass: true,
      });
    }
  }
  home_banner_slider();

  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') ==
          this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length
          ? target
          : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate(
            {
              scrollTop: target.offset().top - 60,
            },
            1000,
            function () {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(':focus')) {
                // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              }
            }
          );
        }
      }
    });
});
