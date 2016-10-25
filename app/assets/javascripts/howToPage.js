// JavaScript specific to the identify page

var loadHowToPageJS = function() {
  if ($(".how-to-page").length > 0) { howToPage(); }

  function howToPage() {

    console.log("loaded js for how to page");
  }
};

$(document).on("turbolinks:load", loadHowToPageJS);
