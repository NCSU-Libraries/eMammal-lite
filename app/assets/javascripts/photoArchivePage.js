var loadPhotoArchivePageJS = function() {
  if ($(".photo-archive-page").length > 0) { photoArchivePage(); }

  function photoArchivePage() {
    var card = $(".card");
    // Set the width of the card if on a desktop display
    if (window.matchMedia("(min-width: 769px)").matches) {
      card.height(card.width() * 0.465);
    }

    function addAnimationTriggers() {
      // Bind the sm-img click to the document to handle partial update
      $(document).on("click", ".sm-img", moveCardIn);
      $(".card-container-absolute").on("click", moveCardOut);
      $(".prevent-click").on("click", moveCardOut);

      card.on("click", function(e) {
        if ($(e.target).hasClass("archive-img")) {
          return;
        }
        card.toggleClass("flipped");
      });
    }
    addAnimationTriggers();

    function moveCardIn() {
      if ($(".card-absolute").is(":animated")) {
        return;
      }

      card.css({"left": "100vw"});

      $(".card-container-absolute").addClass("visible");
      $(".will-blur").addClass("blur");
      $(".prevent-click").addClass("visible");

      // Move the card in from the right and draw graphics on back of card
      // after completion
      card.animate(
        {"left": 0},
        {
          "duration": 600,
          "easing": "easeInQuart",
          "complete": function() {
            updateMap();
            drawProjectLocationPin();
            makeGraphs();
          }
        }
      );
    }

    function moveCardOut(e) {
      if ($(e.target).hasClass("card-container-absolute") ||
        $(e.target).hasClass("prevent-click")) {
        $(".will-blur").removeClass("blur");
        $(".prevent-click").removeClass("visible");

        var cardWidth = card.width();
        var cardOffset = card.position().left;
        card.animate(
          {"left": -cardWidth - cardOffset},
          {
            "duration": 600,
            "easing": "easeOutQuart",
            "complete": function() {
              $(".card-container-absolute").removeClass("visible");
              card.removeClass("flipped");

              // Hide map pin on exit
              d3.select(".map-pin").classed("visible", false);
            }
          }
        );
      }
    }

    // The topojson file and some other variable used for drawing and
    // updating map and map pin.
    var mapData = gon.map;
    var mapSVG = d3.select(".map").select("svg");
    var proj = d3.geoMercator()
      .center([0, 40]);

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

    function updateMap() {
      proj.fitSize([parseFloat(mapSVG.style("width")),
          parseFloat(mapSVG.style("height"))], topojson.feature(mapData, mapData.objects.world));
      var path = d3.geoPath(proj);

      mapSVG.selectAll(".map-path")
        .attr("d", path);
    }

    function drawProjectLocationPin() {
      proj.fitSize([parseFloat(mapSVG.style("width")),
        parseFloat(mapSVG.style("height"))], topojson.feature(mapData, mapData.objects.world));

      // Project the project location coordinates for the map pin
      var coords = $(".map-data").data("url");
      var pointXY = proj(coords);

      // Create group for the pin graphical pieces and set scale factor
      var pin = d3.select(".map-pin");
      var pinScale = 0.2;

      var pinWidth = pin.node().getBBox().width * pinScale;
      var pinHeight = pin.node().getBBox().height * pinScale;
      pin.attr("transform", "translate(" +
        (pointXY[0] - pinWidth / 2) + "," +
        (pointXY[1] - pinHeight) +
        ") scale(" + pinScale + ")");
      pin.classed("visible", true);
    }

    function updateProjectLocationPin() {
      // Project the project location coordinates for the map pin
      var coords = $(".map-data").data("url");
      var pointXY = proj(coords);

      // Create group for the pin graphical pieces and set scale factor
      var pin = d3.select(".map-pin");
      var pinScale = 0.2;

      var pinWidth = pin.node().getBBox().width * pinScale;
      var pinHeight = pin.node().getBBox().height * pinScale;
      pin.attr("transform", "translate(" +
        (pointXY[0] - pinWidth / 2) + "," +
        (pointXY[1] - pinHeight) +
        ") scale(" + pinScale + ")");
    }

    // Make the data graphics that will show on the back of the card
    function makeGraphs() {
      var data = $(".card-results-header").data("url");
      // Filter the data to remove any weird values and the total and sort high to low
      var filteredData = d3.entries(data)
        .filter(function(d) { return d.key != "total" && d.value >= 0; })
        .sort(function (a,b) { return b.value - a.value; });

      if (filteredData.length > 0) {
        var textSizes = ["lg-header", "sm-header", "lg-text"];

        var filter = d3.selectAll(".has-filter").append("defs")
          .append("filter")
            .attr("id", "blur")
          .append("feGaussianBlur")
            .attr("stdDeviation", 5);

        makeBarChart();
        makePieChart();
      }

      function makeBarChart() {
        var width = $(".bar-chart").width();
        var height = $(".bar-chart").height();
        var barHeight = 8;
        var topPadding = 8;
        var horPadding = 8;
        var text = {
          "correct": "Correct tags: ",
          "incorrect":"Incorrect tags: ",
          "skipped": "Skips: "};

        var bar = d3.select(".bar-chart-svg").selectAll("g")
            .data(filteredData)
            .enter().append("g");

          bar.append("rect")
            .attr("class", "svg-shadow")
          	.attr("x", 3)
          	.attr("y", function(d, i) { return i * barHeight * 4 + topPadding + barHeight * 3 + 3; })
          	.attr("width", function(d) {
              return d.value / filteredData[0].value * (width - horPadding * 2) + 1;
            })
          	.attr("height", 8)
            .attr("filter", "url(#blur)");

          bar.append("rect")
          	.attr("x", 0)
          	.attr("y", function(d, i) { return i * barHeight * 4 + topPadding + barHeight * 3; })
          	.attr("width", function(d) {
              return d.value / filteredData[0].value * (width - horPadding * 2) + 1;
            })
          	.attr("height", 8)
            .attr("class", function(d) { return "color-" + d.key; });

          // bar.append("text")
          // 	.text(function(d) { return d.key; })
          // 	.attr("class", "xs-text bar-title")
          // 	.attr("x", 0)
          // 	.attr("y", function(d, i) {
          //     return i * barHeight * 4 + topPadding - 2;
          //   });

          bar.append("text")
          	.text(function(d) { return text[d.key] + d.value; })
          	.attr("class", "xs-text bar-label")
          	.attr("x", 0)
          	.attr("y", function(d, i) {
              return i * barHeight * 4 + topPadding + barHeight * 3 - 3;
            });
      }

      function makePieChart() {
        var width = $(".pie-chart").width();
        var height = $(".pie-chart").height();

        // Create the initial arc parameters
        var arc = d3.arc()
         .innerRadius(0)
         .outerRadius(height / 2 - 5);

        // Use d3.pie to set up reading of data to calculate inner/outer arc radius
        var piePieceArcs = d3.pie().value(function(d) { return d.value; });

        // Create group and move to center of div
        var pieChart = d3.select(".pie-chart-svg")
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        pieChart.append("circle")
          .attr("class", "svg-shadow")
          .attr("cx", 3)
          .attr("cy", 3)
          .attr("r", height / 2 - 5)
          .attr("filter", "url(#blur)");

        // Add data to groups that will hold the pie pieces and text
        var piePiece = pieChart.selectAll("g")
            .data(piePieceArcs(filteredData))
            .enter().append("g")
            .attr("class", "pie-piece");

        // Create paths of the pieces using the arc parameters
        piePiece.append("path")
          .attr("class", function(d) { return "pie-piece color-" + d.data.key; })
          .attr("d", arc);

        // Add text to centroid of each pie piece
        piePiece.append("text")
        	.text(function(d) { return d.data.value > 0 ?
              Math.floor(d.data.value / data.total * 100) + "%" : "";
          })
        	.attr("class", function(d, i) {
            return textSizes[i] + " pie-piece-label"; })
        	.attr("x", function(d) { return arc.centroid(d)[0]; })
        	.attr("y", function(d) { return arc.centroid(d)[1]; });

        d3.selectAll(".pie-table")
          .data(filteredData)
          .text(function(d) {
            return Math.floor(d.value / data.total * 100) + "% " + d.key;
          });
      }
    }

    // Infinite scroll to load more images
    var photoLoadTimeout;
    $(".photos-container").on("scroll", function() {
      clearTimeout(photoLoadTimeout);
      var morePosts = $(".next_page").attr("href");

      if (morePosts && $(".photos-container").scrollTop() > $(".photos-container")[0].scrollHeight - $(".photos-container").height() - 5) {
        photoLoadTimeout = setTimeout(function() {
          $.getScript(morePosts);
        }, 250);
      }
    });

    // Submit the search form when 'filter by my tags' checkbox is toggled
    $(".filter-check-box").on("change", function() {
      $("form").submit();
    });


    var resizeTimeout;
    $(window).on("resize", function() {
      if ($(".photo-archive-page").length < 1) { return; }

      updateMap();
      updateProjectLocationPin();

      clearTimeout(resizeTimeout);

      // Set up function to run on end of resize event to test new size
      resizeTimeout = setTimeout(function() {
        // Set the width of the card if on a desktop display
        if (window.matchMedia("(min-width: 769px)").matches) {
          card.height(card.width() * 0.465);
        } else card.height("");
      }, 250);
    });

    // console.log("loaded js for photo archive page");
  }
};

$(document).on("turbolinks:load", loadPhotoArchivePageJS);
