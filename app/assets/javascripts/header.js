// JavaScript specific to pages with a header

var loadHeaderJS = function() {

  // Check if header is present, if it is load js for pages with a header
  if ($(".header").length > 0) { pagesWithHeaderMobile(); }

  // JavaScript specific to pages with a header on mobile devices
  function pagesWithHeaderMobile() {
    // Show page information/instructions on icon click
    if ($(".info-drop-down").length > 0) {
      // $(".header-page-icon").on("click", toggleOverlays);
      $(".close-drop-down").on("click", function() {
        $(".info-drop-down").removeClass("pull-down");
        $(".will-blur").removeClass("blur");
        $(".prevent-click").removeClass("visible");
      });

      $(".header-page-icon").on("click", function() {
        $(".info-drop-down").toggleClass("pull-down");
        $(".will-blur").toggleClass("blur");
        $(".prevent-click").toggleClass("visible");
      });
    }
    // $(".menu-btn").on("click", toggleOverlays);
    // $(".prevent-click").on("click", toggleOverlays);

    $(".menu-btn").on("click", function() {
      $(".menu").toggleClass("pull-right");
      $(".will-blur").toggleClass("blur");
      $(".prevent-click").toggleClass("visible");
    });

    $(".prevent-click").on("click", function() {
      $(".info-drop-down").removeClass("pull-down");
      $(".menu").removeClass("pull-right");
      $(".will-blur").removeClass("blur");
      $(".prevent-click").removeClass("visible");
    });

    console.log("loaded js for pages with mobile header");
  }

  // Wait until window is loaded and then attach resize event, this prevents
  //  resize issues that occur during the page load
  $(window).on("load", function() {

    // Handle info drop down position on window resize
    $(window).on("resize", function() {

      // Check if header is present and return if not
      if ($(".header").length < 1) { return; }

      $(".info-drop-down").css("top", $(".info-drop-down").outerHeight() * -1);
      $(".menu").css("left", $(".menu").outerWidth() * -1);
      $(".will-blur").removeClass("blur");
      $(".prevent-click").removeClass("visible");
    });
  });
};

$(document).on("turbolinks:load", loadHeaderJS);
