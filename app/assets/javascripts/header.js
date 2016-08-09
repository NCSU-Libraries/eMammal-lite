// JavaScript specific to pages with a header

var loadPageJS = function() {

  // Check if header is present, if it is load js for pages with a header
  if ($(".header").length > 0) { pagesWithHeaderMobile(); }

  // JavaScript specific to pages with a header on mobile devices
  function pagesWithHeaderMobile() {
    // Show page information/instructions on icon click
    if ($(".info-drop-down").length > 0) {
      $(".header-page-icon").on("click", toggleOverlays);
    }
    $(".menu-btn").on("click", toggleOverlays);
    $(".prevent-click").on("click", toggleOverlays);

    // Function to show/hide overlays (menu and information about current page)
    function toggleOverlays() {
      // Don't continue if animation is currently running
      if ($(".menu").is(":animated") || $(".info-drop-down").is(":animated")) {
        return;
      }

      var overlay;
      var animatePos = {};
      if ($(this).hasClass("prevent-click")) {
        var lastOverlay = $(".menu").css("left") === "0px" ?
          $(".menu-btn") : $(".header-page-icon");
          checkWhichOverlay(lastOverlay);
      } else checkWhichOverlay($(this));

      function checkWhichOverlay(currentOverlay) {
        if (currentOverlay.hasClass("menu-btn")) {
          overlay = $(".menu");
          animatePos.left = parseInt(overlay.css("left")) === 0 ?
            overlay.outerWidth() * -1 : 0;
        } else if (currentOverlay.hasClass("header-page-icon")) {
          overlay = $(".info-drop-down");
          animatePos.top = parseInt(overlay.css("top")) === 0 ?
            overlay.outerHeight() * -1 : 0;
        } else overlay = currentOverlay;
      }

      // Blur underlying screen and add invisible div to prevent clicking
      if (animatePos.left === 0 || animatePos.top === 0) {
        $(".will-blur").addClass("blur");
        $(".prevent-click").addClass("visible");
      } else {
        $(".will-blur").removeClass("blur");
        $(".prevent-click").removeClass("visible");
      }

      overlay.animate(animatePos, {duration: 500});
    }

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

$(document).on("turbolinks:load", loadPageJS);
