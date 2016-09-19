function loadPageJS() {
  if ($(".photo-archive-page").length > 0) { photoArchivePage(); }

  function photoArchivePage() {
    $(".sm-img").on("click", function() {
      $(".card-container-absolute").addClass("visible");
      $(".will-blur").addClass("blur");
      $(".prevent-click").addClass("visible");
    });

    $(".card-absolute").on("click", function(e, d) {
      var card = $(this);
      e.stopPropagation();
      card.toggleClass("flipped");
    });

    $(".card-container-absolute").on("click", function() {
      $(".card-container-absolute").removeClass("visible");
      $(".will-blur").removeClass("blur");
      $(".prevent-click").removeClass("visible");
    });

    console.log("loaded js for photo archive page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
