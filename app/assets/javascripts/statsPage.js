var loadStatsPageJS = function() {
  if ($(".stats-page ").length > 0) { statsPage(); }

  function statsPage() {
    // Grab user stats from data attached to page
    var stats = $(".stats-page").data("url");

    // Score stats
    function makeScoreBarGraph() {
      $(".percentage-bar")
        .attr("width", stats.correct / stats.attempts * 100 + "%");
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

      // If user has not id'd any photos put in default data
      var cleanData = stats.attempts === 0 ? [1, 0] : [(stats.attempts - stats.correct), stats.correct];

      // Add data to groups that will hold the donut pieces and text
      var donutPiece = donutChart.selectAll("g")
          .data(piePieceArcs(cleanData))
          .enter().append("g")
          .attr("class", "donut-piece");

      // Create paths of the pieces using the arc parameters
      donutPiece.append("path")
        .attr("class", function(d, i) { return "stat-color-" + i; })
        .attr("d", arc);

      var accuracy = Math.ceil(stats.correct / stats.attempts * 100) || 0;
      donutChart.append("text")
        .text(accuracy + "%")
        .attr("class", "xl-header bold-text donut-text");

      if (accuracy > 0) {
        d3.select(".accuracy-number").text(accuracy + "%");
      }
    }
    makeAccuracyDonut();

    // User's top identified animals stats
    function makeUserTopIdentifiedBarGraph() {
      var svgClassName = ".top-bar";
      var textClassName = ".top-text-user";
      var animalData = stats.animals;

      makeBarGraph(svgClassName, textClassName, animalData);
    }
    makeUserTopIdentifiedBarGraph();

    // Global top identified animals stats
    function makeGlobalTopIdentifiedBarGraph() {
      var svgClassName = ".top-bar-global";
      var textClassName = ".top-text-global";
      var animalData = $(".stats-top-identified-global").data("url");

      makeBarGraph(svgClassName, textClassName, animalData);
    }
    makeGlobalTopIdentifiedBarGraph();

    // Make a bar graph and text given the DOM elements on which to attach
    // and animal data
    function makeBarGraph(svgElement, textElement, data) {
      var width = $(svgElement).width();
      var height = $(svgElement).height();
      var topPadding = 20;
      var animalCounts = d3.values(data);
      var animalNames = d3.keys(data);

      function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
      }

      var bar = d3.select(svgElement).selectAll("g")
          .data(animalCounts)
          .enter().append("g");

      bar.append("rect")
      	.attr("x", function(d, i) { return i * width / 3; })
      	.attr("y",  function(d) {
          return height + topPadding - (d / getMaxOfArray(animalCounts) * height);
        })
      	.attr("width", width / 3)
      	.attr("height", function(d) {
          return (d / getMaxOfArray(animalCounts) * height - topPadding);
        })
        .attr("class", "bar");

      bar.append("text")
        .text(function(d) { return d; })
      	.attr("x", function(d, i) { return i * width / 3 + width / 6; })
      	.attr("y",  function(d) {
          return height + topPadding - (d / getMaxOfArray(animalCounts) * height);
        })
        .attr("class", "lg-header bold-text bar-number-text");

      var barLabelText = bar.append("text")
        .text("")
      	.attr("x", function(d, i) { return i * width / 3 + width / 6; })
      	.attr("y",  function(d) {
          return height + topPadding - (d / getMaxOfArray(animalCounts) * height) - 3;
        })
        .attr("class", "xs-text bar-label-text");

      // Split animal names at spaces for the text label tspans
      var tspaner = animalNames.map(function(d) {
        return d.split(" ").map(function(d) {
          return d;
        });
      });

      // Add tspans to label text to handle long multi-word names
      barLabelText.selectAll("tspan")
        .data(function(d, i) {return tspaner[i].reverse(); })
        .enter().append("tspan")
        .text(function(d) { return d; })
        .attr("dy", function(d, i) { return -i * 16; })
        .attr("x", function() {
          return parseFloat(d3.select(this.parentNode).attr("x"));
        });

      d3.select(svgElement).append("rect")
        .attr("x", "0")
        .attr("y", "99%")
        .attr("width", "100%")
        .attr("height", "2px")
        .attr("class", "bar-axis");

      // Handle top tags HTML text based on the number of animal types the
      // user has identified
      if (animalCounts.length > 0) {
        var topTagsText = "";
        if (animalCounts.length === 1) {
          if (textElement == ".top-text-user") {
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span> is the only type of animal you have identified. Keep tagging animals!";
          } else
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span> is the only animal identified in eMammal Lite so far.";
        } else if (animalCounts.length === 2) {
          if (textElement == ".top-text-user") {
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span>  and <span class='bold-text'>" + animalNames[1] + "</span> are the only animal types you have identified. Keep tagging animals!";
          } else
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span>  and <span class='bold-text'>" + animalNames[1] + "</span> are the top two animal types identified by all users";
        } else if (animalCounts.length === 3) {
          if (textElement == ".top-text-user") {
            topTagsText = "The top three animals you have tagged are <span class='bold-text'>"+ animalNames[0] + "</span>, <span class='bold-text'>" + animalNames[1] + "</span>, and <span class='bold-text'>" + animalNames[2] + "</span>.";
          } else
            topTagsText = "The top three animals tagged by all users are <span class='bold-text'>"+ animalNames[0] + "</span>, <span class='bold-text'>" + animalNames[1] + "</span>, and <span class='bold-text'>" + animalNames[2] + "</span>.";
        }
        d3.select(textElement).html(topTagsText);
      }
    }

    // Set up the ui and animation of the stats buttons
    var accordionBtns = $(".stats-group-header");

    accordionBtns.on("click", function() {
      // Select the parent of the clicked button
      var activeContainer = $(this).parent();
      var totalHeight = $(".stats-page").height() - 156;

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
    console.log("loaded js for stats page");
  }
};

$(document).on("turbolinks:load", loadStatsPageJS);
