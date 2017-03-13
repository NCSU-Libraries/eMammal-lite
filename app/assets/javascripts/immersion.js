function loadImmersionJS() {

  // The topojson file and some other variable used for drawing and
  // updating map and map pin.
  var mapData = gon.map;
  var mapSVG = d3.select(".map").select("svg");
  var proj = d3.geoMercator()
    .center([10, 40]);

  // Draw the map on the initial page load
  function makeMap() {
      proj.fitSize([parseFloat(mapSVG.style("width")),
        parseFloat(mapSVG.style("height"))], topojson.feature(mapData, mapData.objects.world));
    var path = d3.geoPath(proj);

    mapSVG.selectAll("path")
      .data(topojson.feature(mapData, mapData.objects.world).features)
      .enter().append("path")
      .attr("class", "map-path")
      .attr("d", path);

    // Draw pin but don't bind any data to it yet
    var pin = mapSVG.append("g").attr("class", "map-pin");

    pin.append("path")
      .attr("class", "pin-outer")
      .attr("d", "M29.87,0A30.09,30.09,0,0,0,0,30.29C0,51.67,29.87,83,29.87,83S59.73,52.54,59.73,30.29A30.08,30.08,0,0,0,29.87,0Zm0,47.42A17.69,17.69,0,1,1,47.56,29.73,17.69,17.69,0,0,1,29.87,47.42Z");

    pin.append("circle")
      .attr("class", "pin-inner")
      .attr("cx", "29.87px")
      .attr("cy", "29.73px")
      .attr("r", "11.75px");
  }
  makeMap();

  function updateProjectLocationPin(projectLatLon) {
    // Project the project location coordinates for the map pin
    // var coords = $(".map").data("url");
    var coords = projectLatLon;
    var pointXY = proj(coords);

    // Create group for the pin graphical pieces and set scale factor
    var pin = d3.select(".map-pin");
    var pinScale = 0.5;

    var pinWidth = pin.node().getBBox().width * pinScale;
    var pinHeight = pin.node().getBBox().height * pinScale;
    pin.attr("transform", "translate(" +
      (pointXY[0] - pinWidth / 2) + "," +
      (pointXY[1] - pinHeight) +
      ") scale(" + pinScale + ")");
    pin.style("visibility", "visible");
  }
  updateProjectLocationPin($(".map").data("url"));

  function updateProjectInfo(projectName) {
    $(".project-name-immersion").text(projectName);
  }

  var updateInterval = window.setInterval(changeProject, 10000);

  function changeProject() {
    $.ajax({
      type: "GET",
      url: "/immersion/new_project_data",
      success: function(json) {
        console.log(json);
        var projectData = json;
        updateProjectLocationPin([projectData.lon, projectData.lat]);
        updateProjectInfo(projectData.name);
      }
    });
  }


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
  if (document.getElementsByClassName("test-wrapper").length > 0) {
    testingBackground();
  }
}

$(document).on("turbolinks:load", loadImmersionJS);
