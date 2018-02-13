$(document).ready(function() {

  $("body").bind("load", sunburst());

});


function sunburst() {
  $('#navigate').hide();


  $.ajax({
    headers: {
      'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
    },
    url: '/competitions/competitions.json',
    async: false,
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    var valueAll1 = JSON.parse(JSON.stringify(response));

    createJSON(valueAll1);


  });



}

function callAjax(data) {
  var childsParent = [];
  var obj;


  data.forEach(function(value, index) {

    if (value.id != 429 && value.id != 432 && value.id != 424 && value.id != 440) {


      var url = '/competitions/' + value.id + '.json';

      $.ajax({
        headers: {
          'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
        },
        url: url,
        async: false,
        dataType: 'json',
        type: 'GET',
      }).done(function(response) {
        console.log(response);
        localStorage.setItem("responseAllLeague11" + index, JSON.stringify(response));

        var valueAll1 = JSON.parse(index, JSON.stringify(response));

        console.log(valueAll1);
        var name = response.leagueCaption;
        var children = [];


        for (var i = 0; i < 4; i++) {
          var childElements = {
            'name': response['standing'][i]['teamName'],
            'size': response['standing'][i]['goals']
          }
          children.push(childElements);
        }

        obj = {
          'name': name,
          'children': children
        };

        childsParent.push(obj);


      });



    }


  });

  return childsParent;
}


function createJSON(data) {

  var parent = [];

  var child1 = [];

  var childlink = {
    'name': 'England'
  };

  child1.push(childlink);

  parent.push(child1);


  var child2 = [];

  var child2link = {
    'name': 'Spain'
  };

  child2.push(child2link);

  parent.push(child2);


  var child3 = [];

  var child3link = {
    'name': 'France'
  };

  child3.push(child3link);

  parent.push(child3);

  var child4 = [];

  var child4link = {
    'name': 'Dutch'
  };

  child4.push(child4link);

  parent.push(child4);

  var child5 = [];

  var child5link = {
    'name': 'Germany'
  };

  child5.push(child5link);

  parent.push(child5);


  var child6 = [];

  var child6link = {
    'name': 'Germany'
  };

  child6.push(child6link);

  parent.push(child6);



  var main = [];

  var link = {
    'name': 'Europe',
    'children': parent
  };

  main.push(link);


  childsParent = callAjax(data);

  var master;

  var gChild = [];
  var eChild = [];
  var dChild = [];
  var iChild = [];
  var sChild = [];
  var pChild = [];
  var fChild = [];


  childsParent.forEach(function(value, i) {

    if (i == 4 || i == 3) {;

      gChild.push(childsParent[i]);
    } else
    if (i == 1 || i == 0 || i == 2 || i == 13 || i == 14) {

      eChild.push(childsParent[i]);
    } else
    if (i == 5) {

      dChild.push(childsParent[i]);
    } else
    if (i == 10 || i == 12) {

      iChild.push(childsParent[i]);
    } else
    if (i == 8 || i == 9) {

      sChild.push(childsParent[i]);
    } else
    if (i == 11) {

      pChild.push(childsParent[i]);
    } else {
      fChild.push(childsParent[i]);
    }
    //

  });

  var link1 = {
    'name': 'Germany',
    'children': gChild
  };
  var link2 = {
    'name': 'England',
    'children': eChild
  };
  var link3 = {
    'name': 'Dutch',
    'children': dChild
  };
  var link4 = {
    'name': 'Italy',
    'children': iChild
  };
  var link5 = {
    'name': 'Spain',
    'children': sChild
  };
  var link6 = {
    'name': 'Portugal',
    'children': pChild
  };
  var link7 = {
    'name': 'France',
    'children': fChild
  };

  var masterChildren = [];
  masterChildren.push(link1);
  masterChildren.push(link2);
  masterChildren.push(link3);
  masterChildren.push(link4);
  masterChildren.push(link5);
  masterChildren.push(link6);
  masterChildren.push(link7);


  master = {
    'name': 'Europe',
    'children': masterChildren
  };

  createGraph(master);

}

function createGraph(data) {
  var width = 960;
  var height = 700;
  var radius = (Math.min(width, height) / 2) - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

  var y = d3.scaleSqrt()
    .range([0, radius]);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var partition = d3.partition();

  var arc = d3.arc()
    .startAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
    })
    .endAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
    })
    .innerRadius(function(d) {
      return Math.max(0, y(d.y0));
    })
    .outerRadius(function(d) {
      return Math.max(0, y(d.y1));
    });

  $("#teamC").fadeOut(1000);
  $("#teamCAxis").fadeOut(1000);
  d3.select("#main").selectAll("svg").transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .remove();

  d3.select("#teamC").selectAll("svg").transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .remove();
  var canvas = d3.select("#main").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  data = d3.hierarchy(data);
  data.sum(function(d) {
    return d.size;
  });


  canvas.selectAll("path")
    .data(partition(data).descendants())
    .enter().append("g").attr("class", "node");

  var path = canvas.selectAll(".node")
    .append("path")
    .attr("d", arc)
    .style("fill", function(d) {
      return color((d.children ? d : d.parent).data.name);
    })
    .attr("id", function(d) {
      return d.data.name === "root" ? "" : d.data.name
    })
    .on("click", click)
    .append("title")
    .text(function(d) {
      return d.data.name + "\n" + formatNumber(d.value);
    });

  var text = canvas.selectAll(".node")
    .append("text")
    .attr("transform", function(d) {
      return "rotate(" + computeTextRotation(d) + ")";
    })
    .attr("x", function(d, i) {
      return y(d.y0);
    })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .text(function(d) {

      return d.data.name === "root" ? "" : d.data.name
    });



  function click(d) {


    canvas.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]),
          yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) {
          x.domain(xd(t));
          y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll("path")
      .attrTween("d", function(d) {
        return function() {
          return arc(d);
        };
      })
      .on("end", function(e, i) {
        // check if the animated element's data e lies within the visible angle span given in d
        if (e.x0 > d.x0 && e.x0 < d.x1) {
          // get a selection of the associated text element
          var arcText = d3.select(this.parentNode).select("text");
          // fade in the text element and recalculate positions
          arcText.transition().duration(750)
            .attr("opacity", 1)
            .attr("class", "visible")
            .attr("transform", function() {
              return "rotate(" + computeTextRotation(e) + ")"
            })
            .attr("x", function(d) {
              return y(d.y0);
            })
            .text(function(d) {
              return d.data.name === "root" ? "" : d.data.name
            });
        }
      });
    if (d['data']['name'] == 'Premier League 2016/17') {
      comparePremierLeague();
    }

  }

  function computeTextRotation(d) {
    return (x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI * 180;
  }

  d3.select(self.frameElement).style("height", height + "px");
}