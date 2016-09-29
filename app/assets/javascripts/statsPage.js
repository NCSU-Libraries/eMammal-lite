function loadPageJS() {
  if ($(".stats-page ").length > 0) { statsPage(); }

  function statsPage() {
    var accordionBtns = $(".stats-group-header");

    accordionBtns.on("click", function() {
      // Select the parent of the clicked button
      var activeContainer = $(this).parent();
      var totalHeight = $(".stats-page").height() - 156;
      console.log(activeContainer);

      if (activeContainer.hasClass("active")) {
        activeContainer.removeClass("active");
        accordionBtns.removeClass("not-active");
        activeContainer.animate(
          {"height": 78},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
      } else {
        activeContainer.addClass("active");
        $(this).removeClass("not-active");
        activeContainer.animate(
          {"height": totalHeight},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
        activeContainer.siblings().removeClass("active");
        accordionBtns.not($(this)).addClass("not-active");
        activeContainer.siblings().animate(
          {"height": 78},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
      }
    });
    console.log("loaded js for stats page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
