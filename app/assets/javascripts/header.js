

var loadPageJS = function() {

  // Show page information/instructions
  var position = 0;
  var blur = "2px";
  $(".header-page-icon").on("click", toggleDropDown);

  // Show dropdown information on page and blur underlying page
  function toggleDropDown() {
  $(".page-with-header").toggleClass("blur");

    $(".info-drop-down").animate({
      "top": position || 0
    }, {
      duration: 500,
      done: function() {

        // $(".page-with-header").css({"-webkit-filter": "blur(" + blur + ")"});

        if (position === 0) {
          position = $(".info-drop-down").outerHeight() * -1;
          blur = 0;
          $(".page-with-header").on("click", toggleDropDown);
        } else {
          position = 0;
          blur = "2px";
          $(".page-with-header").off("click", toggleDropDown);
        }
      }
    });
  }
};

// $(document).ready(loadPageJS);
$(document).on("turbolinks:load", loadPageJS);

$(window).on("resize", function() {
  $(".info-drop-down").css("top", $(".info-drop-down").outerHeight() * -1);
});
