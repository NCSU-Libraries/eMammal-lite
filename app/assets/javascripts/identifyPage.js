// JavaScript specific to the identify page

var loadtagPageJS = function() {
  if ($(".id-page").length > 0) { tagPage(); }

  // Initiate the functions for the identify page
  function tagPage() {
    // Set the width of the card if on a desktop display
    if (window.matchMedia("(min-width: 769px)").matches) {
      $(".card").height($(".card").width() * 0.465);
    }

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
        {
          "duration": 600,
          "easing": "easeInOutSine"
        }
      );

      // Animate old card off the left of the screen and remove
      oldCard.animate(
        {"left": -cardWidth - cardOffset},
        {
          "duration": 600,
          "easing": "easeInOutSine",
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

    // Set uo function to run on end of resize event
    var resizeTimeout;
    $(window).on("resize", function() {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function() {
        // Set the width of the card if on a desktop display
        if (window.matchMedia("(min-width: 769px)").matches) {
          $(".card").height($(".card").width() * 0.465);
        } else $(".card").height("");
      }, 250);
    });

    // console.log("loaded js for id page");
  }
};

$(document).on("turbolinks:load", loadtagPageJS);
