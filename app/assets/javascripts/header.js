

var loadPageJS = function() {

  var infoTopPosition = 0;
  var menuLeftPosition = 0;

  // Show page information/instructions on icon click
  $(".header-page-icon").on("click", toggleDropDown);
  $(".menu-btn").on("click", toggleMenu);

  // Show dropdown information on page and blur underlying page
  function toggleDropDown() {
    $(".page-with-header").toggleClass("blur");

    $(".info-drop-down").animate({
      "top": infoTopPosition
    }, {
      duration: 500,
      done: function() {
        // After animation finishes set position for next toggle and add event
        //  listener for blured page
        if (infoTopPosition === 0) {
          infoTopPosition = $(".info-drop-down").outerHeight() * -1;
          $(".page-with-header").on("click", toggleDropDown);
        } else {
          infoTopPosition = 0;
          $(".page-with-header").off("click", toggleDropDown);
        }
      }
    });
  }

  // Show menu and blur underlying page
  function toggleMenu() {
    console.log(menuLeftPosition);
    $(".page-with-header").toggleClass("blur");
    $(".menu").animate({
      "left": menuLeftPosition
    }, {
      duration: 500,
      done: function() {

        // After animation finishes set position for next toggle and add event
        //  listener for blured page
        if (menuLeftPosition === 0) {
          menuLeftPosition = $(".menu").outerWidth() * -1;
          $(".page-with-header").on("click", toggleMenu);
          $(".header-page-icon").off("click", toggleDropDown);
        } else {
          menuLeftPosition = 0;
          $(".page-with-header").off("click", toggleMenu);
          $(".header-page-icon").on("click", toggleDropDown);
        }
      }
    });
  }

  // Wait until window is loaded and then attach resize event, this prevents
  //  resize issues that occur during the page load
  $(window).on("load", function() {

    // Handle info drop down position on window resize
    $(window).on("resize", function() {

      // Check if header is present and return if not
      if ($(".header").length < 1) { return; }

      // Set next top and left position variable and local div heights
      infoTopPosition = 0;
      menuLeftPosition = 0;
      var dropDownHeight = $(".info-drop-down").outerHeight();
      // Move menu and drop-down to initial hidden positions, remove
      //  event listener for underlying page, and remove blur
      if ($(".menu").css("left") === "0px") {
        $(".header-page-icon").on("click", toggleDropDown);
      }
      $(".info-drop-down").css("top", $(".info-drop-down").outerHeight() * -1);
      $(".menu").css("left", $(".menu").outerWidth() * -1);
      $(".page-with-header").off("click", toggleDropDown);
      $(".page-with-header").removeClass("blur");
    });
  });
};

$(document).on("turbolinks:load", loadPageJS);
