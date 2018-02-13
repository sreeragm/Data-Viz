var canvas1;
var path;
var type;
var counter=0;
var width=960;
var height=500;
$(document).ready(function()
{
	/*http://api.jquery.com/bind/*/

	type="q1";
	$("body").bind("load", CallChoropleth1());

});


function forceDirect()
{


d3.queue()
    .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/soccer-teammates-men.json")
    .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/guardian-16-men.json")
    .await(processData1);
}

function processData1(errors, graph, data) 
{

var canvas2 = d3.select("#forceL").
      append("svg").
      attr("width",width+400).
      attr("height",height+200);

var color=d3.scaleOrdinal(d3.schemeCategory10);


// Mike Bostock Example
// Stackoverflow for Distance param
var simulation=d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200).strength(1))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter((width+400)/2, (height+200)/2));


  
var links=[];

graph.forEach(function(value,i){
      var link= {source: value[0], target: value[1]};
     links.push(link);
});



var playertemparray1=graph.map(function(obj) 
  { 
   return obj[0];
  });

var playertemparray2=graph.map(function(obj) 
  { 
   return obj[1];
  });

var playertemparray=playertemparray1.concat(playertemparray2);
var playerarray = playertemparray.filter(function(item, i, ar){ return ar.indexOf(item) === i; });


var nodes=[];

playerarray.forEach(function(d,j)
    {

     var id= {id: d};
     nodes.push(id);
    });


var counts = data.reduce((prev, curr) => {
  var count = prev.get(curr['Nationality']) || 0;
  prev.set(curr['Nationality'], 1+ count);
  return prev;
}, new Map());

let reducedObjArr = [...counts].map(([key, value]) => {
  return {key, value}
})

reducedObjArr.sort(function(a,b) {return b.value - a.value});

reducedObjArr.forEach(function(val,i){
  if(i>8)
     reducedObjArr[i]['group']=9;
   else
     reducedObjArr[i]['group']=i;
});

nodes.forEach(function(value1,i){

  data.forEach(function(value2,j){


	if(value1['id']==value2['Name'])
	{
	reducedObjArr.forEach(function(value3,k){


	    if(value2['Nationality']==value3['key'])
	    {
	      nodes[i]['group']=value3['group'];
	      
	    }
	  });
	}
  });


});


var graph={nodes:nodes,links:links};

var link = canvas2.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", 2);


var gnodes = canvas2.selectAll('g.gnode')
  .data(graph.nodes)
  .enter()
  .append('g')
  .classed('gnode', true);

  var labels = gnodes.append("text")
  					.text(function(d) { return d.id; });

  var node = canvas2.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill",function(d,i) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)); 

  node.append("title")
      .text(function(d) { return d.id; });

var legend=[]


reducedObjArr.forEach(function(value3,k){
if(k<10)
{
  if(k==9)
  {
  var leg={'country':'Others','group':value3['group']};    
  }
  else
  {
  var leg={'country':value3['key'],'group':value3['group']};
  }

legend.push(leg);  
}

});



var rectangle2=canvas2.append("g").selectAll("rect")
          .data(legend)
          .enter()
          .append("rect")
            .attr("width",32)
            .attr("height",22)
            //.attr("fill",'red')
            .attr("y",function(d,i){return (82+(15*i));})
            .attr("x",550)
            .attr("fill",function(d, i) {
              var value;
              if(i>8)
                value=9;
              else
                value=d['group'];
               
               return color(value); 
                })
            .attr("stroke","white")
            .attr("stroke-width","1")
            .attr("transform","translate("+475+",0)");

            
  var text2=canvas2.append("g").selectAll("text")
            .data(legend)
            .enter()
            .append("text")
            .attr("y",function(d,i){return (86)+(15)*i;})
            .attr("x","1070")
            .attr("fill",function(d, i) { return color(d['group']); })
            .attr("dy", ".70em")
            .text(function(d,i){return d['country'];})


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation
      .force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

        // Translate the groups
  gnodes.attr("transform", function(d) { 
    return 'translate(' + [d.x, d.y] + ')'; 
  }); 
  }
  


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}



}


var rainbow=d3.scaleLinear().domain([0,10]).range(["white","blue"]);

function CallChoropleth1()
{

var id="";

// Type param to distinguish between 1st Choropleth graph and 2nd
if(type=='q1')
{
id="#choro1";
}
else
{
 id="#choro2";

}


canvas1 = d3.select(id).
					append("svg").
					attr("width",width).
					attr("height",height);

// Github projection link
var projection= d3.geoEckert4()   // define our projection with parameters
    .scale(170)
    .translate([width / 2, height / 2])
    .precision(.1);


path=d3.geoPath()
			.projection(projection);

var graticule=d3.geoGraticule();

canvas1.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

canvas1.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

canvas1.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

canvas1.append("path")
	.datum(graticule)
	.attr("class","graticule")
	.attr("d",path);


d3.queue()
    .defer(d3.json, "https://cdn.rawgit.com/johan/world.geo.json/master/countries.geo.json")
    .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/fifa-17-women.json")
    .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/guardian-16-men.json")
    .await(processData);

}

function processData(errors, world, data,data2) {


var countries=world.features;

var tagname;
var data3;


if(type=='q1')
{

	tagname='Country';
	data3=data;
}
else
{
	tagname='Nationality';
	data3=data2;

}

// Referred Stackoverflow for extraction logic 
var counts = data3.reduce((prev, curr) => {
  var count = prev.get(curr[tagname]) || 0;
  prev.set(curr[tagname], 1+ count);
  return prev;
}, new Map());

let reducedObjArr = [...counts].map(([key, value]) => {
  return {key, value}
})


countries.forEach(function(value1,i){

	reducedObjArr.forEach(function(value2,j){


		if(world['features'][i]['properties']['name']==value2['key'])
		{

		world['features'][i]['properties']['count']=value2['value'];	
		
		}
		

	});


});


	drawMap(world);

}

function drawMap(world) {

    canvas1.append("g")
    .attr("class", "county")
    .selectAll("path")
    .data(world.features)
.enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) {
    	if(d.properties.count!=0)
    	//console.log('name '+d['properties']['name']+' color '+d['properties']['count']);
        if(d.properties.count==undefined)
        	return rainbow(0);
       	else
	        return rainbow(d['properties']['count']);
    });


// Counter to differentiate between map 1 and map 2
if(counter==0)
{

	type='q2';
	CallChoropleth1(type);
	counter=counter+1;

  forceDirect();
}
    
}


// Referred Mike Bostock Example
function getDataRange() {


  var min = Infinity, max = -Infinity;  
  d3.selectAll('.country')
    .each(function(d,i) {
      var currentValue = d.properties[attributeArray[currentAttribute]];
      if(currentValue <= min && currentValue != -99 && currentValue != 'undefined') {
        min = currentValue;
      }
      if(currentValue >= max && currentValue != -99 && currentValue != 'undefined') {
        max = currentValue;
      }
  });
  return [min,max];  //boomsauce
}

// Referred Mike Bostock Example

function getColor(valueIn, valuesIn) {

  var color = d3.scaleLinear() // create a linear scale
    .domain([valuesIn[0],valuesIn[1]])  // input uses min and max values
    .range([.3,1]);   // output for opacity between .3 and 1 %

  return color(valueIn);  // return that number to the caller
}


