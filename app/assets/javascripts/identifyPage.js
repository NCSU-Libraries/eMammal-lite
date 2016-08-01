// JavaScript specific to the identify page

function loadPageJS() {
  if ($(".id-page ").length > 0) { identifyPage(); }

  function identifyPage() {
    // TODO
    $(".skip-text").on("click", function(e) {
      e.preventDefault();
      $("#new_identification").submit();
    });

    var flipper = $(".next-arrow");

    flipper.on("click", flipCard);

    function flipCard() {
      $(".card").toggleClass("flipped");
      $(".next-arrow").toggleClass("visible");

      console.log("FLIPPED!");
    }

    console.log("loaded js for id page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
