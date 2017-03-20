function loadImmersionJS() {
  if ($(".immersion-page").length > 0) { immersionPage(); }

  function immersionPage() {
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

    var photoData = [];

    // This interval is 1/5 of the entire animation time set in the
    // ".animate-card" css class
    // var animateCardInterval = window.setInterval(animateCard, 4000);
    var cardNumber = 0;
    var cards = $(".cards");
    var animationLength = parseInt(cards.css("animation-duration")) * 1000;
    cards.on("animationstart", function() {
      window.setTimeout(animateCard, animationLength / cards.length);
    });
    cards.on("animationend", function() {
      $(this).removeClass("animate-card");

        if(!$(".cards").hasClass("animate-card")) {
          changeProject();
          cardNumber = 0;
        }
    });

    function animateCard() {
      var card = $(".card-" + (cardNumber % 5 + 1));


      if (cardNumber < photoData.length) {
        if (!card.hasClass("animate-card")) {
          card.addClass("animate-card");
        }

        addInfoToCard();

      } else {
        card.removeClass("animate-card");
      }

      cardNumber++;
    }

    function addInfoToCard() {
      var photoInfo = photoData[cardNumber];
      var enteredCard = d3.select(".card-" + (cardNumber % 5 + 1));
      enteredCard.select(".animal-img")
        .attr("src",
          "https://s3.amazonaws.com/emammalphoto/" +
          photoInfo.source + "_o.jpg"
        );
      enteredCard.select(".animal-name").text(photoInfo.animal);
      enteredCard.select(".sci-name").text(photoInfo.sci_name);

      // Test if the photo has been attempted (i.e., at least one stat is > 0)
      if (!d3.values(photoInfo.stats).every(function(d) { return d === 0; })) {
        makeCardGraphs();
      }

      function makeCardGraphs() {
        var data = photoInfo.stats;
        // Filter the data to remove any weird values and the total and sort high to low
        var filteredData = d3.entries(data)
          .filter(function(d) { return d.key != "total" && d.value >= 0; })
          .sort(function (a,b) { return b.key - a.key; });

        var textSizes = ["54px", "45px", "36px"];

        if (d3.select(".card-" + (cardNumber % 5 + 1)).select("g").empty()) {

          // var filter = enteredCard.select(".stats")
          //   .selectAll(".has-filter").append("defs")
          //     .append("filter")
          //       .attr("id", "blur")
          //     .append("feGaussianBlur")
          //       .attr("stdDeviation", 5);
        }

        makeBarChart(filteredData);
        makePieChart(filteredData);

        function makeBarChart(graphData) {
          // console.log(filteredData, photoInfo.animal, enteredCard);
          var width = $(".bar-chart").width();
          var height = $(".bar-chart").height();
          var barHeight = 45;
          var topPadding = barHeight;
          var horPadding = 24;
          var text = {
            "correct": "Correct tags: ",
            "incorrect":"Incorrect tags: ",
            "skipped": "Skips: "};
          var maxValue = d3.max(graphData.map(function(d) { return d.value; }));

          var bar = enteredCard.select(".bar-chart-svg").selectAll("g")
              .data(graphData);

          var barEnter = bar.enter().append("g");

          barEnter.append("rect")
            .attr("class", "svg-shadow")
          	.attr("x", 9)
          	.attr("y", function(d, i) { return i * barHeight * 2.5 + topPadding + 63; })
          	.attr("width", function(d) {
              return d.value / maxValue * (width - horPadding * 2) + 1;
            })
          	.attr("height", barHeight)
            .attr("filter", "url(#blur)");

          bar.select(".svg-shadow")
            .attr("width", function(d) {
              return d.value / maxValue * (width - horPadding * 2) + 1;
            });

          barEnter.append("rect")
          	.attr("x", 0)
          	.attr("y", function(d, i) { return i * barHeight * 2.5 + topPadding + 54; })
          	.attr("width", function(d) {
              return d.value / maxValue * (width - horPadding * 2) + 1;
            })
          	.attr("height", barHeight)
            .attr("class", function(d) { return "total-bars color-immersion-" + d.key; });

          bar.select(".total-bars")
            .attr("width", function(d) {
              return d.value / maxValue * (width - horPadding * 2) + 1;
            });

          barEnter.append("text")
          	.text(function(d) { return text[d.key] + d.value; })
          	.attr("class", "bar-label")
          	.attr("x", 0)
          	.attr("y", function(d, i) {
              return i * barHeight * 2.5 + topPadding + 45;
            });

          bar.select(".bar-label")
          	.text(function(d) { return text[d.key] + d.value; });
        }

        function makePieChart(graphData) {
          var width = $(".pie-chart-svg").width();
          var height = $(".pie-chart-svg").height();

          // Create the initial arc parameters
          var arc = d3.arc()
           .innerRadius(0)
           .outerRadius(height / 2 - 18);

          // Use d3.pie to set up reading of data to calculate inner/outer arc radius
          var piePieceArcs = d3.pie().value(function(d) { return d.value; });

          var pieChart;
          if (enteredCard.select(".pie-chart-svg").select("g").empty()) {
          // Create group and move to center of div
          pieChart = enteredCard.select(".stats").select(".pie-chart-svg")
            .append("g")
            .attr("class", "pie-group")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            pieChart.append("circle")
              .attr("class", "svg-shadow")
              .attr("cx", 9)
              .attr("cy", 9)
              .attr("r", height / 2 - 18)
              .attr("filter", "url(#blur)");
          } else pieChart = enteredCard.select(".pie-group");

          // Add data to groups that will hold the pie pieces and text
          var piePiece = pieChart.selectAll("g")
              .data(piePieceArcs(graphData));

          var piePieceEnter = piePiece.enter().append("g")
              .attr("class", "pie-piece");

          // Create paths of the pieces using the arc parameters
          piePieceEnter.append("path")
            .attr("class", function(d) {
              return "pie-piece color-immersion-" + d.data.key;
            })
            .attr("d", arc);

          piePiece.select(".pie-piece").attr("d", arc);

          // Add text to centroid of each pie piece
          piePieceEnter.append("text")
            .attr("class", "pie-piece-label")
            .text(function(d) { return d.data.value > 0 ?
                Math.floor(d.data.value / data.total * 100) + "%" : "";
            })
            .attr("x", function(d) { return arc.centroid(d)[0]; })
            .attr("y", function(d) { return arc.centroid(d)[1]; })
            .style("font-size", function(d, i) { return textSizes[i]; });


          piePiece.select(".pie-piece-label")
            .text(function(d) { return d.data.value > 0 ?
                Math.floor(d.data.value / data.total * 100) + "%" : "";
            })
            .attr("x", function(d) { return arc.centroid(d)[0]; })
            .attr("y", function(d) { return arc.centroid(d)[1]; })
            .style("font-size", function(d, i) { return textSizes[i]; });

          d3.selectAll(".pie-table")
            .data(filteredData)
            .text(function(d) {
              return Math.floor(d.value / data.total * 100) + "% " + d.key;
            });
        }
      }
    }

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

    function updateProjectInfo(name, description) {
      $(".project-name-immersion").text(name);
      $(".project-description-text").text(description);
    }

    // Update data for new project on a timer
    // var updateInterval = window.setInterval(changeProject, 60000);
    function changeProject() {
      $.ajax({
        type: "GET",
        url: "/immersion/new_project_data",
        success: function(json) {
          var projectData = json[0];
          photoData = json[1];
          updateProjectLocationPin([projectData.lon, projectData.lat]);
          updateProjectInfo(projectData.name, projectData.description);
          animateCard();
        }
      });
    }

    //Initial load of data
    changeProject();


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
}

$(document).on("turbolinks:load", loadImmersionJS);
