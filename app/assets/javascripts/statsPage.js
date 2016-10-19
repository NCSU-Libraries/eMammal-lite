function loadPageJS() {
  if ($(".stats-page ").length > 0) { statsPage(); }

  function statsPage() {
    var stats = $(".stats-page").data("url");

    // Score stats
    function makeScoreBarGraph() {
      $(".percentage-bar")
        .attr("width", stats.correct / stats.total * 100 + "%");
    }
    makeScoreBarGraph();

    // Accuracy stats
    function makeAccuracyDonut() {
      var width = $(".accuracy-donut").width();
      var height = $(".accuracy-donut").height();

      // Create the initial arc parameters
      var arc = d3.arc()
       .innerRadius(height / 2 - 13)
       .outerRadius(height / 2 - 5);

      // Use d3.pie to set up reading of data to calculate inner/outer arc radius
      var piePieceArcs = d3.pie().value(function(d) { return d; });

      // Create group and move to center of div
      var donutChart = d3.select(".accuracy-donut")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // Add data to groups that will hold the donut pieces and text
      var donutPiece = donutChart.selectAll("g")
          .data(piePieceArcs([(stats.total - stats.correct), stats.correct]))
          .enter().append("g")
          .attr("class", "donut-piece");

      // Create paths of the pieces using the arc parameters
      donutPiece.append("path")
        .attr("class", function(d, i) { return "stat-color-" + i; })
        .attr("d", arc);

      donutChart.append("text")
        .text(Math.ceil(stats.correct / stats.total * 100) + "%")
        .attr("class", "xl-header bold-text donut-text");

      d3.select(".accuracy-number").text(Math.ceil(stats.correct / stats.total * 100) + "%");

    }
    makeAccuracyDonut();

    // Top identified animals stats
    function makeTopIdentifiedBarGraph() {
      var width = $(".top-bar").width();
      var height = $(".top-bar").height();
      var topPadding = 20;
      var animalCounts = d3.values(stats.animals);

      var bar = d3.select(".top-bar").selectAll("g")
          .data(animalCounts)
          .enter().append("g");

      bar.append("rect")
      	.attr("x", function(d, i) { return i * width / 3; })
      	.attr("y",  function(d) {
          return height + topPadding - (d / Math.max(...animalCounts) * height);
        })
      	.attr("width", width / 3)
      	.attr("height", height)
        .attr("class", "stat-color-0");

    }
    makeTopIdentifiedBarGraph();

    // Set up the ui and animation of the stats buttons
    var accordionBtns = $(".stats-group-header");

    accordionBtns.on("click", function() {
      // Select the parent of the clicked button
      var activeContainer = $(this).parent();
      var totalHeight = $(".stats-page").height() - 156;
      console.log(activeContainer);

      if (activeContainer.hasClass("active")) {
        activeContainer.removeClass("active");
        accordionBtns.removeClass("not-active");
        activeContainer.animate(
          {"height": 78},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
      } else {
        activeContainer.addClass("active");
        $(this).removeClass("not-active");
        activeContainer.animate(
          {"height": totalHeight},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
        activeContainer.siblings().removeClass("active");
        accordionBtns.not($(this)).addClass("not-active");
        activeContainer.siblings().animate(
          {"height": 78},
          {"duration": 600,
          "easing": "easeInOutSine"}
        );
      }
    });
    console.log(d3.values(stats.animals));
    console.log("loaded js for stats page");
  }
}

$(document).on("turbolinks:load", loadPageJS);
