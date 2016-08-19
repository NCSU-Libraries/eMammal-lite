// JavaScript specific to the identify page

function loadPageJS() {
  if ($(".id-page ").length > 0) { identifyPage(); }

  // Initiate the functions for the identify page
  function identifyPage() {

    // Transition to next card when user presses next-arrow
    $(".next-arrow").on("click", function() {
      $(".next-arrow").toggleClass("visible");
      nextCardTransition("identified");
    });

    // When a user presses the skip button submit the identification form
    // without an identification id
    $(".skip-text").on("click", function() {
      $("#new_identification").submit();
      $(".skip-container").toggleClass("hidden");
      nextCardTransition("skipped");
    });

    function nextCardTransition(type) {
      // Clone the old card and add a 'new' class to the clone and an 'old'
      // class to the cloned
      var oldCard = $(".card");
      var cardWidth = oldCard.width();
      var cardOffset = oldCard.position().left;

      var newCard = $(".card").clone(true);


      newCard.addClass("new")
        .css({
          "left": "100vw"
        })
        .insertBefore(".next-arrow");

      var newCardOffset = -oldCard.position().left;

      oldCard.removeClass("new")
        .addClass("old")
        .css({
          "left": cardOffset + newCardOffset
        });

      // Animate old card out and new card in and flip if needed
      if (type === "identified") {
        $(".card").toggleClass("flipped");
      }

      newCard.animate(
        {"left": -cardOffset - newCardOffset},
        {"duration": 500}
      );

      oldCard.animate(
        {"left": -cardWidth - cardOffset},
        {
          "duration": 500,
          "complete": function() {
            // At end of animation remove the old card and remove "left"
            // positioning from the new card
            oldCard.remove();
            newCard.css("left", "");
            $(".skip-container").toggleClass("hidden");
          }
        }
      );

    }
    console.log("loaded js for id page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
