// JavaScript specific to the identify page

function loadPageJS() {
  if ($(".id-page ").length > 0) { identifyPage(); }

  // Initiate the functions for the identify page
  function identifyPage() {

    // This function animates the transition between cards. Type refers to
    // either skipping a card or pressing the next arrow after identifiying
    function nextCardTransition(type) {
      // Get the width and position of the original card (old card)
      var oldCard = $(".card");
      var cardWidth = oldCard.width();
      var cardOffset = oldCard.position().left;

      // Clone the old card and add a 'new' class to the clone. Set the
      // initial relative position of the new card (right of the screen)
      // and insert into the DOM before the next arrow
      var newCard = oldCard.clone(true);
      newCard.addClass("new")
        .css({
          "left": "100vw"
        })
        .insertBefore(".next-arrow");

      // Get the position of the old card now that new card is added
      var newCardOffset = -oldCard.position().left;

     // Add 'old' class to original card and set its initial position
      oldCard.addClass("old")
        .css({
          "left": cardOffset + newCardOffset
        });

      //Flip if animating after an incorrect identification
      if (oldCard.hasClass("flipped")) {
        newCard.addClass("no-transition");
        newCard.toggleClass("flipped");
      }

      // Animate new card to old card position
      newCard.animate(
        {"left": -cardOffset - newCardOffset},
        {"duration": 500}
      );

      // Animate old card off the left of the screen and remove
      oldCard.animate(
        {"left": -cardWidth - cardOffset},
        {
          "duration": 500,
          "complete": function() {
            // At end of animation remove the old card and remove "left"
            // positioning from the new card
            oldCard.remove();
            newCard.removeClass("new no-transition")
              .css("left", "");
            $(".skip-container").toggleClass("hidden");
          }
        }
      );
    }

    // Clear the back of the card if content was on there
    $(".back").html("");

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

    console.log("loaded js for id page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
