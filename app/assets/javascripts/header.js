

var loadPageJS = function() {

  // Show page information/instructions
  var position = 0;
  var blur = "2px";
  $(".header-page-icon").on("click", function() {
    console.log(position);
    $(".info-drop-down").animate({"top": position}, 600);
    $(".page-with-header").css({"-webkit-filter": "blur(" + blur + ")"});

    if (position === 0) {
      position = "-100%";
      blur = 0;
    } else {
      position = 0;
      blur = "2px";
    }
  });
};

// $(document).ready(loadPageJS);
$(document).on("turbolinks:load", loadPageJS);
