var teamStat = [];

function getSquadGrap() {
  $('#gotoStackBar').hide(1000);


  d3.select("#main").selectAll("svg").transition()
    .remove();



  $('.teamC').html("");

  if (localStorage.getItem("transferResp") != null) {
    var resp = JSON.parse(localStorage.getItem("transferResp"));

    createTransferChart(resp[1]);
  } else {
    $.ajax({
      headers: {
        'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
      },
      url: 'http://api.football-data.org/v1/competitions',
      dataType: 'json',
      type: 'GET',
    }).done(function(response) {

      localStorage.setItem("transferResp", JSON.stringify(response));

      var resp = JSON.parse(localStorage.getItem("transferResp"));

      createTransferChart(resp[1]);

    });
  }
}



function createAxis() {
  var heightscale1 = d3.scaleLinear()
    .domain([1, 25000])
    .range([0, 100]);

}

function createTransferChart(data) {

  if (localStorage.getItem("teamtransferResp") != null) {



    var response = JSON.parse(localStorage.getItem("teamtransferResp"));

    var defenders = [];
    var attackers = [];
    var midfielders = [];

    response['teams'].forEach(function(data, i) {


      var response = JSON.parse(localStorage.getItem("ImageResp" + i));


      var image = data['crestUrl'];



      response['players'].forEach(function(element, index) {


      });
      var code = data['code'];
      var count = [];



      squadValue.forEach(function(element, index) {

        if (element['name'] == code) {
          count.push(element['details']['attack']);
          count.push(element['details']['midfield']);
          count.push(element['details']['defence']);

          attackers.push(element['details']['attack']);
          midfielders.push(element['details']['midfield']);
          defenders.push(element['details']['defence']);


          var obj1 = {
            name: code,
            image: image,
            count: count
          };

          teamStat.push(obj1);
        }
      });



    });


    createBarChart(teamStat, attackers, midfielders, defenders);
  } else {
    $.ajax({
      headers: {
        'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
      },
      url: '/competitions/teams.json',
      dataType: 'json',
      type: 'GET',
      async: false,
    }).done(function(resp) {
      localStorage.setItem("teamtransferResp", JSON.stringify(resp));

      var response = JSON.parse(localStorage.getItem("teamtransferResp"));

      var defenders = [];
      var attackers = [];
      var midfielders = [];

      response['teams'].forEach(function(data, i) {

        $.ajax({
          headers: {
            'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
          },
          url: data['_links']['players']['href'],
          dataType: 'json',
          type: 'GET',
          async: false,
        }).done(function(resp) {

          localStorage.setItem("ImageResp" + i, JSON.stringify(resp));

          var response = JSON.parse(localStorage.getItem("ImageResp" + i));



          var image = data['crestUrl'];



          response['players'].forEach(function(element, index) {


          });
          var code = data['code'];
          var count = [];



          squadValue.forEach(function(element, index) {

            if (element['name'] == code) {
              count.push(element['details']['attack']);
              count.push(element['details']['midfield']);
              count.push(element['details']['defence']);

              attackers.push(element['details']['attack']);
              midfielders.push(element['details']['midfield']);
              defenders.push(element['details']['defence']);



              var obj1 = {
                name: code,
                image: image,
                count: count
              };

              teamStat.push(obj1);
            }
          });



        });



      });



      createBarChart(teamStat, attackers, midfielders, defenders);

    });

  }
}


function createBarChart(teamStat, attackers, midfielders, defenders) {

  var attackavg = attackers.reduce((a, b) => a + b, 0) / attackers.length;
  var midavg = midfielders.reduce((a, b) => a + b, 0) / midfielders.length;
  var defavg = defenders.reduce((a, b) => a + b, 0) / defenders.length;


  callAxisDef(defavg);
  callAxisMid(midavg);
  callAxisAttack(attackavg);



  teamStat.forEach(function(element, index) {

    var canvas1 = d3.select("#teamC").
    append("svg").
    attr("width", 120).
    attr("height", 220).
    attr("id", "id" + index).
    attr("class", "transfer").
    attr("onmouseover", "changeOpacity(" + index + ")").
    attr("onmouseout", "changeBackOpacity(" + attackavg + "," + midavg + "," + defavg + ")").
    append("g").
    //attr("class","brect")
    attr("transform", "translate(20,20)");



    var img = canvas1.append("svg:image")
      .attr("xlink:href", element['image'])
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", 8)
      .attr("y", 3);

    var clubname;
    if (element['name'] != null && element['name'] != undefined && element['name'].length > 4)
      clubname = element['name'].substring(0, 5);
    else
      clubname = element['name']



    var heightscale1 = d3.scaleLinear()
      .domain([1, 25000])
      .range([0, 100]);


    var count = element['count'];

    var sumofcount = count.reduce((a, b) => a + b, 0);


    var rectangle1 = canvas1.selectAll("rect")
      .data(count)
      .enter()
      .append("rect")
      .attr("width", 30)
      .attr("height", function(d) {

        return heightscale1(d);
      })

      .attr("y", function(d, i) {
        return (150 - heightscale1(d));
      })
      .attr("x", function(d, i) {
        return (30 * i);
      })
      .attr("fill", function(d, i) {

        if (i == 0) return 'red';
        else if (i == 1) return 'blue';
        else if (i == 2) return 'green';
      })
      .attr("stroke", "white")
      .attr("stroke-width", "1")
      .attr("transform", "translate(" + 2 + ",0)");



    var text3 = canvas1.selectAll("text")
      .data(count)
      .enter()
      .append("text")
      .attr("y", 169)
      .attr("fill", "grey")
      .attr("x", function(d, i) {
        return ((i) * 30) + 6;
      })

      .attr("dy", ".110em")
      .text(function(d, i) {

        if (i == 0) return 'Att';
        else if (i == 1) return 'Mid';
        else if (i == 2) return 'Def';
      });

    var prc = d3.precisionFixed(0.2)
    var formatNum = d3.format("." + prc + "s");


    var text4 = canvas1.selectAll("#text")
      .data(count)
      .enter()
      .append("text")
      .attr("y", 189)
      .attr("fill", "grey")
      .attr("x", function(d, i) {
        return ((i) * 30) + 6;
      })

      .attr("dy", ".110em")
      .attr("font-size", "10.5px")
      .text(function(d, i) {

        return "€ " + formatNum(d).replace("M", "");
      });



    var text2 = canvas1.append("text")
      .attr("y", 23)
      .attr("x", 52)

      .attr("dy", ".110em")
      .text(clubname);

    var text5 = canvas1.append("text")
      .attr("y", 53)
      .attr("x", 35)

      .attr("dy", ".110em")
      .text("€ " + formatNum(sumofcount).replace("M", ""));



  });


  $("#teamCAxis").fadeIn(1000);
  $('#teamC').fadeIn(1000);


}

function callAxisAttack(value) {

  var canvas1 = d3.select("#teamCAxis").
  append("svg").
  attr("width", 75).
  attr("height", 800).
  attr("class", "AAxis").
  append("g").
  attr("transform", "translate(20,20)");


  d3.selectAll(".Aaxiscircle").remove();

  var yaxisScaleA = d3.scaleLinear()
    .domain([20000, 0])
    .range([0, 400]);

  d3.selectAll(".Aaxiscircle").remove();

  var yaxisA = d3.axisLeft().scale(yaxisScaleA);


  canvas1.append("g")
    .call(customYAxis);

  canvas1.append("g").append("circle")
    .attr("class", "Aaxiscircle")
    .attr("r", 8)
    .attr("cx", 35)
    .attr("cy", yaxisScaleA(value))
    .attr("fill", "green");

  canvas1.append("g").append("circle")
    .attr("x", "150")
    .attr("y", "12")
    .text("Attack")
    .attr("transform", "rotate(-90,50,100)");


  function customYAxis() {
    canvas1.call(yaxisA.ticks(13).tickFormat(d3.formatPrefix(".0", 1e3)));
    canvas1.select(".domain").remove();
    canvas1.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    canvas1.selectAll(".tick text").attr("x", 4).attr("dy", 0);
  }

}


function callAxisMid(value) {

  var canvas1 = d3.select("#teamCAxis").
  append("svg").
  attr("width", 75).
  attr("height", 800).
  attr("class", "MAxis").
  append("g").
  attr("transform", "translate(20,20)");


  d3.selectAll(".Maxiscircle").remove();

  var yaxisScaleA = d3.scaleLinear()
    .domain([20000, 0])
    .range([0, 400]);

  d3.selectAll(".Maxiscircle").remove();

  var yaxisA = d3.axisLeft().scale(yaxisScaleA);


  canvas1.append("g")
    .call(customYAxis);


  canvas1.append("g").append("circle")
    .attr("class", "Maxiscircle")
    .attr("r", 8)
    .attr("cx", 35)
    .attr("cy", yaxisScaleA(value))
    .attr("fill", "blue");

  function customYAxis() {
    canvas1.call(yaxisA.ticks(13).tickFormat(d3.formatPrefix(".0", 1e3)));
    canvas1.select(".domain").remove();
    canvas1.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    canvas1.selectAll(".tick text").attr("x", 4).attr("dy", 0);
  }

}


function callAxisDef(value) {

  var canvas1 = d3.select("#teamCAxis").
  append("svg").
  attr("width", 75).
  attr("height", 800).
  attr("class", "DAxis").
  append("g").
  attr("transform", "translate(20,20)");


  d3.selectAll(".Daxiscircle").remove();

  var yaxisScaleA = d3.scaleLinear()
    .domain([20000, 0])
    .range([0, 400]);

  d3.selectAll(".Daxiscircle").remove();

  var yaxisA = d3.axisLeft().scale(yaxisScaleA);


  canvas1.append("g")
    .call(customYAxis);


  canvas1.append("g").append("circle")
    .attr("class", "Daxiscircle")
    .attr("r", 8)
    .attr("cx", 35)
    .attr("cy", yaxisScaleA(value))
    .attr("fill", "red");

  function customYAxis() {
    canvas1.call(yaxisA.ticks(13).tickFormat(d3.formatPrefix(".0", 1e3)));
    canvas1.select(".domain").remove();
    canvas1.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    canvas1.selectAll(".tick text").attr("x", 4).attr("dy", 0);
  }

}


function updateAxisValue(axis, value) {
  var canvas1 = d3.select("." + axis).remove();

  if (axis == 'AAxis')
    callAxisAttack(value);
  else
  if (axis == 'MAxis')
    callAxisMid(value);
  else
  if (axis == 'DAxis')
    callAxisDef(value);
}

function revertAxisValue(axis, value) {
  var className;
  if (value == 'DAxis')
    className = 'Daxiscircle';
  else
  if (value == 'AAxis')
    className = 'Aaxiscircle';
  else
  if (value == 'MAxis')
    className = 'Maxiscircle';

  d3.selectAll("." + className).remove();



}

function toggleFocus(value) {

  if (document.getElementById(value) != null) {
    document.getElementById(value).setAttribute("fill", "green");


  } else {
    var updateAll = document.getElementsByClassName("rect");

    for (var i = 0; i < updateAll.length; i++) {
      updateAll[i].setAttribute("fill", "red")
    }

  }
}

function changeOpacity(value) {

  var idValue = "#id" + value;

  d3.selectAll(".transfer").
  attr("opacity", 0.2);
  teamStat.forEach(function(element, index) {

    if (value == index) {
      d3.selectAll("#teamC " + idValue).
      attr("opacity", 1);
    }


  });

  updateAxisValue('DAxis', teamStat[value]['count']['0']);


  updateAxisValue('MAxis', teamStat[value]['count']['1']);

  updateAxisValue('AAxis', teamStat[value]['count']['2']);
}

function changeBackOpacity(attackavg, midavg, defavg) {
  d3.selectAll(".transfer").
  attr("opacity", 1);

  d3.selectAll(".Daxiscircle").remove();
  d3.selectAll(".Aaxiscircle").remove();
  d3.selectAll(".Maxiscircle").remove();

  updateAxisValue('DAxis', defavg);


  updateAxisValue('MAxis', midavg);

  updateAxisValue('AAxis', attackavg);


}