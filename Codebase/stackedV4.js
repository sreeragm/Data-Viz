var div;

function blurTheLine(classVar) {
  d3.selectAll('.' + classVar).attr('opacity', '0.5');

}

function callStackedBar(name) {


  var wins = [];
  var losses = [];
  var draws = [];
  var teamName = [];
  var masterObj = [];
  var dataV = [];
  var tooltipData = [];
  $.ajax({
    headers: {
      'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
    },
    url: '/competitions/leagueTable.json',
    dataType: 'json',
    type: 'GET',
    async: false,
  }).done(function(resp) {

    resp['standing'].forEach(function(element, index) {

      if (index < 10 || element['teamName'] == name) {
        wins.push(element['wins']);
        losses.push(element['losses']);
        draws.push(element['draws']);
        teamName.push(element['teamName'].replace("FC", ""));

        var childObj = {
          wins: element['wins'],
          losses: element['losses'],
          draws: element['draws']
        };

        var childTooltip = {
          goals: element['goals'],
          goalsAgainst: element['goalsAgainst'],
          playedGames: element['playedGames'],
          points: element['points']
        };

        masterObj.push(childObj);
        tooltipData.push(childTooltip);
      }

    });
    var winData = {
      name: 'wins',
      values: wins
    };
    dataV.push(winData);

    var lData = {
      name: 'losses',
      values: losses
    };
    dataV.push(lData);

    var dData = {
      name: 'draws',
      values: draws
    };
    dataV.push(dData);


  });



  var allRaces = ["wins", "losses", "draws"];
  var months = teamName;
  var groups = {}
  var races = {};
  var xkey = "raceethnicity" // the x axis
  var gkey = "month" // what we group by
  var processed = [];

  months.forEach(function(month, i) {
    var xdata = {};

    var result = {};
    allRaces.forEach(function(g) {
      result[g] = xdata[g] || 0;
    })
    processed.push(result)
  })
  var n = allRaces.length, // number of layers
    m = processed.length, // number of samples per layer
    stack = d3.stack().keys(allRaces);

  var layers = stack(masterObj); // calculate the stack layout


  layers.forEach(function(d, i) { //adding keys to every datapoint
    d.forEach(function(dd, j) {
      dd.month = months[j];
      dd.race = allRaces[i];
    })
  });

  var yGroupMax = d3.max(layers, function(layer) {
      return d3.max(layer, function(d) {
        return d[1] - d[0];
      });
    }),
    yStackMax = d3.max(layers, function(layer) {
      return d3.max(layer, function(d) {
        return d[1];
      });
    });
  var margin = {
      top: 40,
      right: 10,
      bottom: 20,
      left: 10
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scaleBand()
    .domain(months)
    .rangeRound([0, width])
    .padding(0.08);

  var y = d3.scaleLinear()
    .domain([0, yStackMax])
    .range([height, 0]);
  var z = d3.scaleBand().domain(allRaces).rangeRound([0, x.bandwidth()]);
  var color = d3.scaleOrdinal(d3.schemeCategory20c)
    .domain([0, n - 1])

  $("#main").fadeOut(2000);
  d3.select("#main").selectAll("svg").transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .remove();

  var svg = d3.select("#main").append("svg")
    .attr("width", width + 200 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  div = d3.select("#main").append("div")
    .attr("class", "innertooltip")
    .style("opacity", 0);

  var layer = svg.selectAll(".layer")
    .data(layers)
    .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) {
      if (i == 0)
        return 'green'
      else
      if (i == 1)
        return 'blue';
      else
        return 'red';
      /*return color(i); */
    });

  var rect = layer.selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function(d) {

      return x(d.month);
    })
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .style("opacity", function(d) {

      if (d['month'] != name.replace("FC", ""))
        return 0.2;
      else
        return 1;
    })
    .on("mousemove", function(d, i) {

      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(
          'Goals : ' + tooltipData[i]['goals'] + '<br/>' +
          'Goals Against : ' + tooltipData[i]['goalsAgainst'] + '<br/>' +
          'PlayedGames : ' + tooltipData[i]['playedGames'] + '<br/>' +
          'points : ' + tooltipData[i]['points'] + '<br/>'

        )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 20) + "px");



    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  rect.transition()
    .delay(function(d, i) {
      return i * 10;
    })
    .attr("y", function(d) {
      return y(d[1]);
    })
    .attr("height", function(d) {
      return y(d[0]) - y(d[1]);
    });
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  var legend = svg.selectAll(".legend")
    .data(allRaces)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width + 200 - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {
      if (i == 0)
        return 'green'
      else
      if (i == 1)
        return 'blue';
      else
        return 'red';

      /*return color(i)*/
    });

  legend.append("text")
    .attr("x", width + 200 - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });

  d3.selectAll("input").on("change", change);
  $("#main").fadeIn(1500);
  var timeout = setTimeout(function() {
    d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }

  function transitionGrouped() {
    y.domain([0, yGroupMax]);

    rect.transition()
      .duration(500)
      .delay(function(d, i) {
        return i * 10;
      })
      .attr("x", function(d) {
        return x(d.month) + z(d.race);
      })
      .attr("width", 20)
      .transition()
      .attr("y", function(d) {
        return y(d.data[d.race]);
      })
      .attr("height", function(d) {
        return height - y(d.data[d.race]);
      });
  }

  function transitionStacked() {
    y.domain([0, yStackMax]);

    rect.transition()
      .duration(500)
      .delay(function(d, i) {
        return i * 10;
      })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .transition()
      .attr("x", function(d) {
        return x(d.month);
      })
      .attr("width", x.bandwidth());
  }


  $('#gotoStackBar').fadeIn(1500);
  $('#navigate').fadeIn(1500);

}
/**
 * Shows the tooltip.
 */
function showInnerTooltip() {


  div.transition()
    .duration(200)
    .style("opacity", .9);
  div.html(
      'AAA'
    )
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 20) + "px");

}

function toolInnertipContent() {
  var bars;

  bars = [];
  layers.each(function(d) {
    bars.unshift({
      name: d.name,
      value: d.values[lastHoveredBarIndex].y.toFixed(4)
    });
  });

  return tooltipTemplate({
    bars: bars
  });
}

/**
 * Hides the tooltip.
 */
function hideInnerTooltip() {
  div.transition()
    .duration(500)
    .style("opacity", 0);

}