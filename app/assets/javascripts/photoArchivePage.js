function loadPageJS() {
  if ($(".photo-archive-page").length > 0) { photoArchivePage(); }

  function photoArchivePage() {
    var card = $(".card");

    function addAnimationTriggers() {
      $(".sm-img").on("click", moveCardIn);
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
            }
          }
        );
      }
    }

    // Make the data graphics that will show on the back of the card
    function makeGraphs() {
      var data = $(".card-results-header").data("url");
      // Filter the data to remove 0 values and the total and sort high to low
      var filteredData = d3.entries(data)
        .filter(function(d) { return d.key != "total" && d.value > 0; })
        .sort(function (a,b) { return b.value - a.value; });

      if (filteredData.length > 0) {
        var textSizes = ["lg-header", "sm-header", "lg-text"];

        var filter = d3.selectAll("svg").append("defs")
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
        var topPadding = 20;

        var bar = d3.select(".bar-chart-svg").selectAll("g")
            .data(filteredData)
            .enter().append("g");

          bar.append("rect")
            .attr("class", "svg-shadow")
          	.attr("x", 3)
          	.attr("y", function(d, i) { return i * height / 3 + topPadding + 3; })
          	.attr("width", function(d) {
              return d.value / filteredData[0].value * (width - 40);
            })
          	.attr("height", height / 3 - 20)
            .attr("filter", "url(#blur)");

          bar.append("rect")
          	.attr("x", 0)
          	.attr("y", function(d, i) { return i * height / 3 + topPadding; })
          	.attr("width", function(d) {
              return d.value / filteredData[0].value * (width - 40);
            })
          	.attr("height", height / 3 - 20)
            .attr("class", function(d) { return "color-" + d.key; });

          bar.append("text")
          	.text(function(d) { return d.key; })
          	.attr("class", "xs-text bar-title")
          	.attr("x", 0)
          	.attr("y", function(d, i) {
              return i * height / 3 + topPadding - 2;
            });

          bar.append("text")
          	.text(function(d) { return d.value; })
          	.attr("class", "sm-header bar-label")
          	.attr("x", function(d) {
              return d.value / filteredData[0].value * (width - 45);
            })
          	.attr("y", function(d, i) {
              return i * height / 3 + (height / 3 - 20) / 2 + topPadding;
            });
      }

      function makePieChart() {
        var width = $(".pie-chart").width();
        var height = $(".pie-chart").height();

        // Create the initial arc parameters
        var arc = d3.arc()
         .innerRadius(0)
         .outerRadius(width / 2 - 5);

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
          .attr("r", width / 2 - 5)
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
        	.text(function(d) { return Math.floor(d.data.value / data.total * 100) + "%"; })
        	.attr("class", function(d, i) {
            return textSizes[i] + " pie-piece-label"; })
        	.attr("x", function(d) { return arc.centroid(d)[0]; })
        	.attr("y", function(d) { return arc.centroid(d)[1]; });
      }
    }

    console.log("loaded js for photo archive page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
