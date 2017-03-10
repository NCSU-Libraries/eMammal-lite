function loadImmersionJS() {

  

  // Grid of panels simulating Immersion screen TODO: REMOVE FOR PRODUCTION
  function testingBackground() {
    var rows = 7;
    var columns = 16;

    // Select main wrapper to attach elements that will be created
    var mainWrapper = document.getElementsByClassName("test-wrapper")[0];

    // A transparent image overlay
    var imageTemplate = document.createElement("img");
    imageTemplate.className = "transparent-image-overlay";
    mainWrapper.appendChild(imageTemplate);

    // Create a grid of tiles to simulate actual tiles
    for (var i = 0; i < (columns * rows); i++) {
      var tile = document.createElement("div");
      tile.className = "tile tile-" + i;
      mainWrapper.appendChild(tile);
    }
  }
  testingBackground();
}

$(document).on("turbolinks:load", loadImmersionJS);
