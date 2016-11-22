// JavaScript specific to the identify page

var loadHowToPageJS = function() {
  if ($(".how-to-page").length > 0) { howToPage(); }

  function howToPage() {
    var frameNum = 0;

    // Assign the actions on each frame
    var frameFire = {
        "frame-0": function() {
          $(".logo").addClass("hidden");
          $(".identify-animation").addClass("start");
          $(".how-to-title").text("Tag Animals");
          $(".how-to-explanation").text("You will find over 5,000 camera trap photos with animals waiting to be tagged in TAG ANIMALS.");
        },
        "frame-1": function() {
          $(".identify-animation").addClass("start-2");
          $(".cartoon-card").addClass("start");
          $(".how-to-explanation").text("In TAG ANIMALS you will be presented with a card containing a camera trap photo and a choice of three tag names.");
        },
        "frame-2": function() {
          $(".cartoon-photo").addClass("image-zoom");
          $(".how-to-explanation").text("Observe the animal in the image closely. You can tap on an image to zoom in for more detail.");
        },
        "frame-3": function() {
          $(".cartoon-photo").removeClass("image-zoom").addClass("start");
          $(".cartoon-btn").addClass("start");
          $(".how-to-explanation").text("If you can identify the animal, tag it using the provided names. You may also choose to skip a card.");
        },
        "frame-4": function() {
          $(".cartoon-card").addClass("start-2");
          $(".check-mark").addClass("start");
          $(".check-mark-bubbles").addClass("start");
          $(".check-mark-bubble-group").addClass("start");
          $(".how-to-animations-svg").addClass("start");
          $(".how-to-explanation").text("A correct tag will provide you with more info on a photo. Your score indicates your tagging progress.");
        },
        "frame-5": function() {
          $(".how-to-animations-svg").removeClass("start");
          $(".identify-how-to").addClass("hidden");
          $(".stats-how-to").removeClass("hidden");
          $(".stats-animation").addClass("start");
          $(".how-to-title").text("Track Stats");
          $(".how-to-explanation").text("You can track your progress and how well you are doing compared to other taggers in STATS.");

          $(".identify-icon").addClass("hidden");
          $(".stats-icon").removeClass("hidden").addClass("visible");
          $(".p-1").removeClass("active");
          $(".p-2").addClass("active");
        },
        "frame-6": function() {
          $(".stats-animation").addClass("start-2");
          $(".cartoon-stats").addClass("start");
          $(".how-to-explanation").text("Explore your score and ranking, how accurate your tags are, and the top types of animals that you have tagged.");
        },
        "frame-7": function() {
          $(".stat-group-2").addClass("start");
          $(".stat-group-3").addClass("start");
          $(".stat-cover").addClass("start");
          $(".cartoon-stats").addClass("start");

          $(".stat-1").addClass("start");
          $(".stat-2").addClass("start");

          $(".how-to-explanation").text("Tap on a bar to access your own score, accuracy, or top tags as well as the score, accuracy, and top tags of others.");
        },
        "frame-8": function() {
          $(".stats-how-to").addClass("hidden");
          $(".archive-how-to").removeClass("hidden");
          $(".archive-animation").addClass("start");
          $(".how-to-title").text("Explore the Archive");
          $(".how-to-explanation").text("To study up on your animals or to just browse the eMammal Lite camera trap photo collection, check out the PHOTO ARCHIVE.");

          $(".stats-icon").addClass("hidden");
          $(".archive-icon").removeClass("hidden").addClass("visible");
          $(".p-2").removeClass("active");
          $(".p-3").addClass("active");
        },
        "frame-9": function() {
          $(".archive-animation").addClass("start-2");
          $(".cartoon-archive").removeClass("hidden").addClass("start");
          $(".how-to-explanation").text("In the PHOTO ARCHIVE you can search for animals by general or specific names and browse any matching photos.");
        },
        "frame-10": function() {
          $(".archive-photo").addClass("start");
          $(".archive-card-front").addClass("start");

          $(".how-to-explanation").text("Tap on an image to open the camera trap photo card for more information about a photo.");
        },
        "frame-11": function() {
          $(".archive-card-front").addClass("start-2");
          $(".archive-card-back").addClass("start");

          $(".how-to-explanation").text("Tap on the open card to flip it and view user statistics.");
        },
        "frame-12": function() {
          $(".archive-how-to").addClass("hidden");
          $(".logo").removeClass("hidden").addClass("visible");
          $(".how-to-title").text("Now Start Tagging!");
          $(".how-to-explanation").text("Tap the menu button at the top of the screen and select TAG ANIMALS.");
          $(".how-to-next-arrow-holder").addClass("hidden");
        }
      };

    // Fire the next animation
    $(".how-to-next-arrow-svg").on("click", function() {
      startAnimations();
      // animTesting();
      frameNum++;
      if (frameNum > 0) {
        // $(".how-to-back-arrow-holder").removeClass("hidden");
      } else
        $(".how-to-back-arrow-holder").addClass("hidden");
    });

    $(".how-to-back-arrow-svg").on("click", function() {
      // startAnimations();
      animTesting();
      frameNum--;
    });

    function startAnimations() {
      var currentFrame = "frame-" + frameNum;
      if (frameNum < Object.keys(frameFire).length) {
        frameFire[currentFrame]();
      }
    }


    var frameTesting = {
    };

    function animTesting() {
      var currentFrame = "frame-" + frameNum;
      if (frameNum < Object.keys(frameTesting).length) {
        frameTesting[currentFrame]();
      }
    }


    console.log("loaded js for how to page");
  }
};

$(document).on("turbolinks:load", loadHowToPageJS);
