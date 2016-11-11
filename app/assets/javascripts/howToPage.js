// JavaScript specific to the identify page

var loadHowToPageJS = function() {
  if ($(".how-to-page").length > 0) { howToPage(); }

  function howToPage() {
    var frameNum = 0;

    // Assign the actions on each frame
    var frameFire = {
        "frame-0": function() {
          $(".identify-animation").addClass("start");
          $(".cartoon-card").addClass("start");
          $(".how-to-explanation").text("You will be presented with a card containing a camera trap photo and a choice of tag names.");
        },
        "frame-1": function() {
          $(".cartoon-photo").addClass("image-zoom");
          $(".how-to-explanation").text("Observe the animal in the image closely. You can tap on an image to view it larger.");
        },
        "frame-2": function() {
          $(".cartoon-photo").removeClass("image-zoom").addClass("start");
          $(".cartoon-btn").addClass("start");
          $(".how-to-explanation").text("If you can identify the animal, tag it using the provided choices. You may also choose to skip a card.");
        },
        "frame-3": function() {
          $(".cartoon-card").addClass("start-2");
          $(".check-mark").addClass("start");
          $(".check-mark-bubbles").addClass("start");
          $(".check-mark-bubble-group").addClass("start");
          $(".how-to-animations-svg").addClass("start");
          $(".how-to-explanation").text("A correct tag is rewarded with more info on the photo. Your score indicates your tagging progress.");
        },
        "frame-4": function() {
          $(".identify-how-to").addClass("hidden");
          $(".how-to-animations-svg").removeClass("start");
          $(".cartoon-btn").addClass("start");
          $(".how-to-explanation").text("Now start tagging animals! Tap the menu button above and select TAG ANIMALS.");
          $(".how-to-next-arrow-holder").addClass("hidden");
        }
      };

    // Fire the next animation
    $(".how-to-next-arrow-svg").on("click", function() {
      startAnimations();
      frameNum++;
      if (frameNum > 0) {
        // $(".how-to-back-arrow-holder").removeClass("hidden");
      } else
        $(".how-to-back-arrow-holder").addClass("hidden");
    });

    $(".how-to-back-arrow-svg").on("click", function() {
      startAnimations();
      frameNum--;
    });

    function startAnimations() {
      var currentFrame = "frame-" + frameNum;
      if (frameNum < Object.keys(frameFire).length) {
        frameFire[currentFrame]();
      }
    }

    console.log("loaded js for how to page");
  }
};

$(document).on("turbolinks:load", loadHowToPageJS);
