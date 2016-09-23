function loadPageJS() {
  if ($(".photo-archive-page").length > 0) { photoArchivePage(); }

  function photoArchivePage() {

    cardAnimations();

    function cardAnimations() {
      var card = $(".card");
      card.css("left", "100vw");

      $(".sm-img").on("click", function() {
        if ($(".card-absolute").is(":animated")) {
          return;
        }

        $(".card-container-absolute").addClass("visible");
        $(".will-blur").addClass("blur");
        $(".prevent-click").addClass("visible");

        card.animate(
          {"left": 0},
          {
            "duration": 600,
            "easing": "easeInQuart"
        }
        );
      });

      card.on("click", function(e) {
        if ($(e.target).hasClass("archive-img")) {
          return;
        }
        card.toggleClass("flipped");
      });

      $(".card-container-absolute").on("click", closeCard);
      $(".prevent-click").on("click", closeCard);

      function closeCard(e) {
        if ($(e.target).hasClass("card-container-absolute") ||
          $(e.target).hasClass("prevent-click")) {
          $(".will-blur").removeClass("blur");
          $(".prevent-click").removeClass("visible");

          var cardWidth = card.width();
          var cardOffset = card.position().left;
          card.animate(
            {"left": -cardWidth - cardOffset},
            {
              "duration": 600,
              "easing": "easeOutQuart",
              "complete": function() {
                card.css({
                  "left": "100vw"
                });
                $(".card-container-absolute").removeClass("visible");
                card.removeClass("flipped");
              }
            }
          );
        }
      }
    }

    console.log("loaded js for photo archive page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
