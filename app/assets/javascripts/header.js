

var loadPageJS = function() {

  var topPosition = 0;

  // Show page information/instructions on icon click
  $(".header-page-icon").on("click", toggleDropDown);

  // Show dropdown information on page and blur underlying page
  function toggleDropDown() {
    $(".page-with-header").toggleClass("blur");

    $(".info-drop-down").animate({
      "top": topPosition
    }, {
      duration: 500,
      done: function() {
        // After animation finishes set position for next toggle and add event
        //  listener for blured page
        if (topPosition === 0) {
          topPosition = $(".info-drop-down").outerHeight() * -1;
          $(".page-with-header").on("click", toggleDropDown);
        } else {
          topPosition = 0;
          $(".page-with-header").off("click", toggleDropDown);
        }
      }
    });
  }

  // Wait until window is loaded and then attach resize event, this prevents
  //  resize issues that occur during the page load
  $(window).on("load", function() {
    // Handle info drop down position on window resize
    $(window).on("resize", function() {
      // Set next top position variable, set top position, remove event
      //  listener for underlying page, and remove blur
      topPosition = 0;
        console.log($(".info-drop-down").outerHeight());
      $(".info-drop-down").css("top", $(".info-drop-down").outerHeight() * -1);
      $(".page-with-header").off("click", toggleDropDown);
      $(".page-with-header").removeClass("blur");
    });
  });
};

$(document).on("turbolinks:load", loadPageJS);
