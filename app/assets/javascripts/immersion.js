function loadImmersionJS() {
  if ($(".immersion-page").length > 0) { immersionPage(); }

  function immersionPage() {
    // Add method to d3 to move an item to the back of the parent node
    d3.selection.prototype.moveToBack = function() {
      return this.each(function() {
          var firstChild = this.parentNode.firstChild;
          if (firstChild) {
              this.parentNode.insertBefore(this, firstChild);
          }
      });
    };

    // The topojson file and some other variable used for drawing and
    // updating map and map pin.
    var mapData = gon.map;
    var mapSVG = d3.select(".map").select("svg");
    var proj = d3.geoNaturalEarth()
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

      var mapWidth = parseInt(mapSVG.style("width"));
      var mapHeight = parseInt(mapSVG.style("height"));
      pin.attr("transform", "translate(" +
        mapWidth / 2 + ",0)");
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

    function updateProjectLocationPin(projectLatLon) {
      // Project the project location coordinates for the map pin
      var coords = projectLatLon;
      var pointXY = proj(coords);

      // Create group for the pin graphical pieces and set scale factor
      var pin = d3.select(".map-pin");
      var pinScale = 0.5;

      var pinWidth = pin.node().getBBox().width * pinScale;
      var pinHeight = pin.node().getBBox().height * pinScale;

      pin.transition()
        .duration(5000).ease(d3.easeCubicIn)
          .attr(
            "transform", "translate(" +
            (pointXY[0] - pinWidth / 2) + "," +
            (pointXY[1] - pinHeight) +
            ") scale(" + pinScale + ")"
          );
      pin.style("visibility", "visible");
    }

    function updateProjectInfo(name, description) {
      var t = d3.transition()
        .duration(2500);

      var banner = d3.select(".project-name-immersion");
      var bannerWidth = parseInt(banner.style("width")) + 39;

      banner
        .transition(t).ease(d3.easeCubicOut)
          .style("transform", "translateX(-" + bannerWidth + "px)")
          .on("end", function() {
            // if new name is longer need to move banner a little further
            d3.select(this)
              .text(name)
              .style("transform", "translateX(-" +
                (parseInt(banner.style("width")) + 60)+ "px)"
              );
          })
        .transition(t).ease(d3.easeCubicIn)
          .style("transform", "translateX(0)")
          .text(name);

      d3.select(".project-description-text")
        .transition(t)
          .style("opacity", 0)
        .transition(t)
          .style("opacity", 1)
          .text(description);
    }

    function updateBackgroundImg() {
      d3.selectAll(".project-background-img")
        .classed("visible-img", false)
        .classed("hidden-img", true);
      d3.select(".img-" + Math.floor(Math.random() * 15))
      .style("top", function() {
        return -parseInt(d3.select(this).style("height")) / 2 +
        window.innerHeight / 2 + "px";
      })
      .classed("visible-img", true)
      .classed("hidden-img", false);
    }

    function addInfoToCard() {
      var photoInfo = photoData[cardNumber];
      var enteredCard = d3.select(".card-" + (cardNumber % 5 + 1));

      // var animalPhoto = document.getElementById("background-img");
      // animalPhoto.addEventListener("load", function() {
      //   enteredCard.select(".animal-name").text(photoInfo.animal);
      //   enteredCard.select(".sci-name").text(photoInfo.sci_name);
      // })
      // animalPhoto.src = "https://s3.amazonaws.com/emammalphoto/" +
      //   photoInfo.source + "_o.jpg"

      enteredCard.select(".animal-img")
        .attr("src", "https://s3.amazonaws.com/emammalphoto/" +
          photoInfo.source + "_o.jpg"
        );
      enteredCard.select(".animal-name").text(photoInfo.animal);
      enteredCard.select(".sci-name").text(photoInfo.sci_name);

      // Test if the photo has been attempted (i.e., at least one stat is > 0)
      if (!d3.values(photoInfo.stats).every(function(d) {
        return d === 0;
      })) {
        enteredCard.select(".stats")
          .style("visibility", "visible")
          .style("height", "auto");
        enteredCard.select(".no-stats-filler")
          .style("display", "none");
        makeCardGraphs();
      } else {
        enteredCard.select(".stats")
          .style("visibility", "hidden")
          .style("height", "0");
        enteredCard.select(".no-stats-filler")
          .style("display", "block");
      }

      function makeCardGraphs() {
        var data = photoInfo.stats;
        // Filter the data to remove any weird values and the total and sort high to low
        var filteredData = d3.entries(data)
          .filter(function(d) { return d.key != "total" && d.value >= 0; })
          .sort(function (a,b) { return b.key - a.key; });

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
            .attr("d", arc)
            .moveToBack();

          piePiece.select(".pie-piece").attr("d", arc);

          // Add text to centroid of each pie piece
          piePieceEnter.append("text")
            .attr("class", "pie-piece-label")
            .text(function(d) { return d.data.value > 0 ?
                Math.floor(d.data.value / data.total * 100) + "%" : "";
            })
            .attr("x", function(d) {
              if (Math.floor(d.data.value / data.total * 100) < 15) {
                arc.outerRadius(height / 1.5);
              }
              return arc.centroid(d)[0];
            })
            .attr("y", function(d) {
              if (Math.floor(d.data.value / data.total * 100) < 15) {
                arc.outerRadius(height / 1.5);
              }
              return arc.centroid(d)[1];
             })
            .style("font-size", function(d) {
              return ((d.data.value / data.total * 100) * 18 / 100 + 36) +
                "px";
            });


          piePiece.select(".pie-piece-label")
            .text(function(d) { return d.data.value > 0 ?
                Math.floor(d.data.value / data.total * 100) + "%" : "";
            })
            .attr("x", function(d) {
              if (Math.floor(d.data.value / data.total * 100) < 15) {
                arc.outerRadius(height / 1.5);
              }
              return arc.centroid(d)[0];
            })
            .attr("y", function(d) {
              if (Math.floor(d.data.value / data.total * 100) < 15) {
                arc.outerRadius(height / 1.5);
              }
              return arc.centroid(d)[1];
             })
            .style("font-size", function(d) {
              return ((d.data.value / data.total * 100) * 18 / 100 + 36) +
                "px";
            });
        }
      }
    }

    function updateGlobalStats(globalStats) {

      function updateTopFive(topFiveData) {
        var topScores = d3.selectAll(".top-score").data(topFiveData);

        if (d3.select(".top-score").select(".score").empty()) {
          topScores.append("h2")
            .text(function(d, i) { return d.score; })
            .attr("class", "score");

          topScores.append("h2")
            .text(function(d, i) { return d.name; })
            .attr("class", "name");

          topScores.append("div")
            .attr("class", function(d) {
              return d.icon !== null ? "icon icon-" + d.icon : "icon icon-default";
            });
        } else {
          topScores.select(".score")
            .text(function(d, i) { return d.score; })
            .attr("class", "score");

          topScores.select(".name")
            .text(function(d, i) { return d.name; })
            .attr("class", "name");

          topScores.select(".icon")
            .attr("class", function(d) {
              return d.icon !== null ? "icon icon-" + d.icon : "icon icon-default";
            });
        }
      }

      function updateAccuracyDonut(accuracyData) {
        var width = $(".accuracy-svg").width();
        var height = $(".accuracy-svg").height();

        // Create the initial arc parameters
        var arc = d3.arc()
         .innerRadius(height / 2 - 27)
         .outerRadius(height / 2 - 9);

        // Use d3.pie to set up reading of data to calculate inner/outer arc radius
        var piePieceArcs = d3.pie().value(function(d) { return d; });

        var donutChart;
        // Create group and move to center of div
        if (d3.select(".accuracy-svg").select("g").empty()) {
         donutChart = d3.select(".accuracy-svg")
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
          .attr("class", "donut-chart");
        } else donutChart = d3.select(".donut-chart");
        // If user has not id'd any photos put in default data
        var cleanData = accuracyData.attempts === 0 ?
          [1, 0] :
          [
            (accuracyData.attempts - accuracyData.correct),
            accuracyData.correct
          ];

        // Add data to groups that will hold the donut pieces and text
        var donutPiece = donutChart.selectAll("g")
            .data(piePieceArcs(cleanData));

        var donutPieceEnter = donutPiece.enter().append("g")
            .attr("class", "donut-piece");

        // Create paths of the pieces using the arc parameters
        donutPieceEnter.append("path")
          .attr("class", function(d, i) { return "stat stat-color-" + i; })
          .attr("d", arc);

        donutPiece.select(".stat").attr("d", arc);

        var accuracy = Math.ceil(accuracyData.correct / accuracyData.attempts * 100) || 0;
        donutPieceEnter.append("text")
          .text(accuracy + "%")
          .attr("class", "donut-text");

        donutPiece.select(".donut-text").text(accuracy + "%");

        if (accuracy > 0) {
          d3.select(".accuracy-number")
            .text(accuracy + "%");
        }
      }

      function updateTopIdentifiedBarGraph(topIdentifiedData) {
        var width = $(".top-identified-svg").width();
        var height = $(".top-identified-svg").height();
        var topPadding = 45;
        var animalCounts = topIdentifiedData.map(function(d) { return d.tags; });
        var animalNames = topIdentifiedData.map(function(d) { return d.name; });

        function getMaxOfArray(numArray) {
          return Math.max.apply(null, numArray);
        }

        var bar = d3.select(".top-identified-svg").selectAll("g")
            .data(animalCounts);

        var barEnter = bar.enter().append("g");

        barEnter.append("rect")
        	.attr("x", function(d, i) { return i * width / 3; })
        	.attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height);
          })
        	.attr("width", width / 3)
        	.attr("height", function(d) {
            return (d / getMaxOfArray(animalCounts) * height - topPadding);
          })
          .attr("class", "bar");

        bar.select(".bar")
          .attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height);
          })
        	.attr("height", function(d) {
            return (d / getMaxOfArray(animalCounts) * height - topPadding);
          });

        barEnter.append("text")
          .text(function(d) { return d; })
        	.attr("x", function(d, i) { return i * width / 3 + width / 6; })
        	.attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height) + 36;
          })
          .attr("class", "bar-number-text");

        bar.select(".bar-number-text")
          .text(function(d) { return d; })
          .attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height) + 36;
          });

        var barLabelTextEnter = barEnter.append("text")
          .text("")
        	.attr("x", function(d, i) { return i * width / 3 + width / 6; })
        	.attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height) - 13;
          })
          .attr("class", "bar-label-text");

        var barLabelText = bar.select(".bar-label-text")
          .attr("y",  function(d) {
            return height + topPadding -
            (d / getMaxOfArray(animalCounts) * height) - 13;
          });

        // Split animal names at spaces for the text label tspans
        var tspaner = animalNames.map(function(d) {
          return d.split(" ").map(function(d) {
            return d;
          });
        });

        // Add tspans to label text to handle long multi-word names
        barLabelTextEnter.selectAll("tspan")
          .data(function(d, i) {return tspaner[i].reverse(); })
          .enter().append("tspan")
          .text(function(d) { return d; })
          .attr("dy", function(d, i) { return i > 0 ? -45 : 0; })
          .attr("x", function() {
            return parseFloat(d3.select(this.parentNode).attr("x"));
          });

        barLabelText.selectAll("tspan")
          .data(function(d, i) {return tspaner[i].reverse(); })
          .text(function(d) { return d; })
          .attr("dy", function(d, i) { return i > 0 ? -45 : 0; });

        if (d3.select(".bar-axis").empty()) {
          d3.select(".top-identified-svg").append("rect")
            .attr("x", "0")
            .attr("y", "99%")
            .attr("width", "100%")
            .attr("height", "9px")
            .attr("class", "bar-axis");
        }

        // Handle top tags HTML text based on the number of animal types the
        // user has identified
        if (animalCounts.length > 0) {
          var topTagsText = "";
          if (animalCounts.length === 1) {
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span> is the only animal identified by eMammal Lite users in eMammal Lite so far.";
          } else if (animalCounts.length === 2) {
            topTagsText = "<span class='bold-text'>" + animalNames[0] + "</span>  and <span class='bold-text'>" + animalNames[1] + "</span> are the top two animal types identified by eMammal Lite users";
          } else if (animalCounts.length === 3) {
            topTagsText = "The top three animals tagged by eMammal Lite users are <span class='bold-text'>"+ animalNames[0] + "</span>, <span class='bold-text'>" + animalNames[1] + "</span>, and <span class='bold-text'>" + animalNames[2] + "</span>.";
          }
          d3.select(".top-identified-descrpition").html(topTagsText);
        }
      }

      updateTopFive(globalStats[0]);
      updateAccuracyDonut(globalStats[1]);
      updateTopIdentifiedBarGraph(globalStats[2]);
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
          updateBackgroundImg();

          animateCard();
        }
      });
    }

    // Update data for global stats on a timer
    var updateInterval = window.setInterval(getCurrentGlobalStats, 10000);
    function getCurrentGlobalStats(first) {
      $.ajax({
        type: "GET",
        url: "/immersion/current_global_stats",
        success: function(json) {
          console.log(json);
          if (json[3] || first) {
            updateGlobalStats(json);
          }
        }
      });
    }

    //Initial load of data
    changeProject();
    getCurrentGlobalStats(true);

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
