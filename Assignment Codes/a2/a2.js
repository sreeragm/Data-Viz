$(document).ready(function()
{
	/*http://api.jquery.com/bind/*/

	$("body").bind("load", callBarChart());

	$("body").bind("load", callStackBarChart());

	$("body").bind("load", init());

});

/*To compare between multiple countries, intermediary method to call multi line chart*/
function callCompare()
{
var selected = [];
$('#compareDiv input:checked').each(function() {
		selected.push($(this).attr('value'));
});

if(selected==null || selected=='')
{
	alert("Please select Country");
}
else
{
	callMultiLineChart(selected);
}


}

/*To initialize toggle between type dropdown*/
function ChangeMode(value)
{
	if(value=='Compare')
	{
	$('#regionDiv').hide();
	$('#compareDiv').show();	
	}
	else
	{
	updateLineChart($("#region").val());
	$('#regionDiv').show();
	$('#compareDiv').hide();
	
	
	}
}

/*To initialize the divs and input for Sections*/
function init()
{

var countries = Object.keys(refugees[0]).filter(function(k) { return k != "Year"; });

var newdiv = document.createElement("div");
newdiv.setAttribute("id","lineChart");

var labelType = document.createElement("label");
labelType.setAttribute("id","labelType");

var selectType = document.createElement("select");
selectType.setAttribute("name","selectType");
selectType.setAttribute("id","selectType");
selectType.setAttribute("onchange","ChangeMode(this.value)");

var sel1 = document.createElement("option");
sel1.setAttribute("id","sel1");
selectType.setAttribute("value","country");

var sel2 = document.createElement("option");
sel2.setAttribute("id","sel2");
sel2.setAttribute("value","Compare");

document.body.appendChild(newdiv);

var heading = document.createElement("h3");
heading.setAttribute("id","heading");

document.getElementById("lineChart").appendChild(heading);

document.getElementById("lineChart").appendChild(labelType);
document.getElementById("lineChart").appendChild(selectType);
document.getElementById("selectType").appendChild(sel1);
document.getElementById("selectType").appendChild(sel2);

document.getElementById("labelType").innerHTML='Type:';

document.getElementById("sel1").innerHTML='Country-Based line chart';
document.getElementById("sel2").innerHTML='Compare multi line chart';

var innerDiv = document.createElement("div");
innerDiv.setAttribute("id","innerDiv");

var regionDiv = document.createElement("div");
regionDiv.setAttribute("id","regionDiv");

var label = document.createElement("label");
label.setAttribute("id","inputlabel");


var lineDiv = document.createElement("div");
lineDiv.setAttribute("id","lineDiv");
document.body.appendChild(lineDiv);

var select = document.createElement("select");
select.setAttribute("name","region");
select.setAttribute("id","region");
select.setAttribute("onchange"," updateLineChart(this.value)");

document.getElementById("lineChart").appendChild(innerDiv);

document.getElementById("innerDiv").appendChild(regionDiv);
document.getElementById("regionDiv").appendChild(label);
document.getElementById("regionDiv").appendChild(select);



document.getElementById("heading").innerHTML='Line Chart';
document.getElementById("inputlabel").innerHTML='Region :';

var compareDiv = document.createElement("div");
compareDiv.setAttribute("id","compareDiv");

var checkBoxDiv = document.createElement("div");
checkBoxDiv.setAttribute("id","checkBoxDiv");


var clabel = document.createElement("label");
clabel.setAttribute("id","cinputlabel");

var cbutton = document.createElement("button");
cbutton.setAttribute("id","cbutton");
cbutton.setAttribute("value","Compare");
cbutton.setAttribute("onclick","callCompare()");

document.getElementById("innerDiv").appendChild(compareDiv);
document.getElementById("compareDiv").appendChild(clabel);
countries.forEach(function(value,i)
{

var inputval = document.createElement("input");
inputval.setAttribute("type","checkbox");
inputval.setAttribute("name","inputval"+i);
inputval.setAttribute("id","inputval"+i);
inputval.setAttribute("class","inputval");
inputval.setAttribute("value",value);

document.getElementById("compareDiv").appendChild(inputval);
document.getElementById("compareDiv").appendChild(cbutton);

document.getElementById("cbutton").innerHTML='Compare';

$("<label>"+value+"</label></br>").insertAfter('#'+inputval.id);

});



document.getElementById("cinputlabel").innerHTML='</br>'+'Region  (Select one or more regions):'+'</br>';
$('#compareDiv').hide();

d3.select("#innerDiv select")
    .selectAll("option").data(countries)
    .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });


updateLineChart('Africa');
}

/*To design and update line chart based on the one or more countries selected Part C*/
function callMultiLineChart(countriesList)
{

console.log(refugees);
var colors = d3.scaleOrdinal(d3.schemeCategory10);

var refugeeCount=getTotals();

d3.select("#lineChart").selectAll("svg").remove();

var canvas1 = d3.select("#lineChart").
					append("svg").
					attr("width",1000).
					attr("height",500).
					append("g").
					attr("transform","translate(50,40)");


var xaxisScale1 = d3.scaleLinear()
				.domain([240000,0])
				.range([40,400]);


var xaxis1=d3.axisLeft().scale(xaxisScale1);

var yaxis1=d3.axisBottom().scale(yaxisScale1);


var heightscale1 = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var widthScale = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var xaxisScale1 = d3.scaleLinear()
				.domain([1975,2016])
				.range([0,516]);

var yaxisScale1 = d3.scaleLinear()
				.domain([160000,0])
				.range([40,400]);

var yaxis1=d3.axisLeft().scale(yaxisScale1);
var xaxis1=d3.axisBottom().scale(xaxisScale1);


countriesList.forEach(function(value,i){
		var line = d3.line()
			.x(function(d) { return xaxisScale1(d['Year']);})
			.y(function(d) { return yaxisScale1(d[value]); 

			})

	canvas1.append("path")
      .data([refugees])
      .transition()
  		.duration(2000) // 2 seconds
  		.ease(d3.easeLinear)
      .attr("fill", "none")
      .attr("stroke",  colors(i))
      .attr("stroke-width", 2.5)
      .attr("class","line")
      .attr("d", function(d) { 
				console.log(refugees);
      		console.log(d);
      	return line; })

      canvas1.append("text")
		.data(refugees)
		.attr("transform", "translate(520,"+yaxisScale1(findMax(value))+")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", colors(i))
		.text(value);

});



canvas1.append("g")
		.call(yaxis1.ticks(13).tickFormat(d3.formatPrefix(".0",1e3)));

canvas1.append("g")
		.attr("transform","translate(0,400)")
		.call(xaxis1.ticks(8).tickFormat(d3.format("d")));

canvas1.append("text")
		.attr("x","-150")
		.attr("y","12")
		.text("Number of Refugees")
		.attr("transform","rotate(-90,50,100)");


canvas1.append("text")
		.attr("x","-100")
		.attr("y","12")
		.text("Year")
		.attr("transform","translate(350,425)");		




}

/*To design and update line chart based on the country selected Part C*/
function updateLineChart(country)
{

var refugeeCount=getTotals();

d3.select("#lineChart").selectAll("svg").remove();

var canvas1 = d3.select("#lineChart").
					append("svg").
					attr("width",1000).
					attr("height",500).
					append("g").
					attr("transform","translate(50,40)");


var xaxisScale1 = d3.scaleLinear()
				.domain([240000,0])
				.range([40,400]);


var xaxis1=d3.axisLeft().scale(xaxisScale1);

var yaxis1=d3.axisBottom().scale(yaxisScale1);


var heightscale1 = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var widthScale = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var xaxisScale1 = d3.scaleLinear()
				.domain([1975,2016])
				.range([0,516]);

var yaxisScale1 = d3.scaleLinear()
				.domain([160000,0])
				.range([40,400]);

var yaxis1=d3.axisLeft().scale(yaxisScale1);
var xaxis1=d3.axisBottom().scale(xaxisScale1);

/*https://bl.ocks.org/mbostock/3884955*/
var line = d3.line()
			.x(function(d) { return xaxisScale1(d['Year']);})
			.y(function(d) { return yaxisScale1(d[country]); 
			})

console.log(refugees);
canvas1.append("path")
      .data([refugees])
      .transition()
  		.duration(2000) // 2 seconds
  		.ease(d3.easeLinear)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("class","line")
           
     .attr("d", line);


canvas1.append("g")
		.call(yaxis1.ticks(13).tickFormat(d3.formatPrefix(".0",1e3)));

canvas1.append("g")
		.attr("transform","translate(0,400)")
		.call(xaxis1.ticks(8).tickFormat(d3.format("d")));

canvas1.append("text")
		.attr("x","-150")
		.attr("y","12")
		.text("Number of Refugees")
		.attr("transform","rotate(-90,50,100)");


canvas1.append("text")
		.attr("x","-100")
		.attr("y","12")
		.text("Year")
		.attr("transform","translate(350,425)");		


canvas1.append("text")
		.data(refugees)
		.attr("transform", "translate(520,"+yaxisScale1(findMax(country))+")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "steelblue")
		.text(country);

}

/*To design Stacked bar Chart for Part B*/
function callStackBarChart()
{

var newdiv = document.createElement("div");
newdiv.setAttribute("id","StackedBarchart");

var heading = document.createElement("h3");
heading.setAttribute("id","StackedBarheading");

document.body.appendChild(newdiv);
document.getElementById("StackedBarchart").appendChild(heading);
document.getElementById("StackedBarheading").innerHTML='Stacked Bar Chart';


	var refugeeCount=getTotals();

	var coordinateValue=0;
	var dataIntermediate=Object.keys(refugees[0]).filter(function(k) { return k != "Year"; }).map(function(key,i){
		return refugees.map(function(d,j)
		{
       		 return {key: d['Year'], value: d[key] 
    	};
    })
	})
	
/*	https://github.com/d3/d3-shape/blob/master/README.md#stacks*/
	var stack = d3.stack()
    .keys(Object.keys(refugees[0]).filter(function(k) { return k != "Year"; }))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

var series = stack(refugees);

console.log(series);

var canvas1 = d3.select("body").
					append("svg").
					attr("width",600).
					attr("height",500).
					append("g").
					attr("transform","translate(50,40)");


var xaxisScale1 = d3.scaleLinear()
				.domain([240000,0])
				.range([40,400]);


var xaxis1=d3.axisLeft().scale(xaxisScale1);

var yaxisScale1 = d3.scaleLinear()
				.domain([1974,2016])
				.range([0,516]);

var yaxis1=d3.axisBottom().scale(yaxisScale1);


var heightscale1 = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var colors = d3.scaleOrdinal(d3.schemeCategory10);

/*https://bl.ocks.org/mbostock/3886208*/
var groups = canvas1.selectAll("g.stackchart")
  .data(series)
  .enter().append("g")
  .attr("class","stackchart")
  .style("fill", function(d, i) { return colors(i); });

var rectangle1=groups.selectAll("rect")
					.data(function(d){return d;})
					.enter()
					.append("rect")
						.attr("width",12)
						.attr("height",function(d) {return heightscale1(d[1]-d[0]);})
						//.attr("fill",'red')
						.attr("y",function(d,i){return (400-heightscale1(d[1]));})
						.attr("x",function(d,i){return ((12)*i);})
						.attr("fill",function(d, i) { return colors[i]; })
						.attr("stroke","white")
						.attr("stroke-width","1")
						.attr("transform","translate("+12+",0)");

var rectangle2=groups
					.append("rect")
						.attr("width",12)
						.attr("height",12)
						//.attr("fill",'red')
						.attr("y",function(d,i){return (22+(15*i));})
						.attr("x",250)
						.attr("fill",function(d, i) { return colors[i]; })
						.attr("stroke","white")
						.attr("stroke-width","1")
						.attr("transform","translate("+75+",0)");


						
						canvas1.selectAll("text")
						.data(Object.keys(refugees[0]).filter(function(k) { return k != "Year"; }))
						.enter()
						.append("text")
						.attr("y",function(d,i){return (32)+(15)*i;})
						.attr("x","350")
						.attr("fill",function(d, i) { return colors(i); })
						.text(function(d,i){return d;})

						


/*https://github.com/d3/d3-axis/blob/master/README.md#axis_tickFormat*/

canvas1.append("g")
		.call(xaxis1.ticks(13).tickFormat(d3.formatPrefix(".0",1e3)));

canvas1.append("g")
		.attr("transform","translate(0,400)")
		.call(yaxis1.ticks(8).tickFormat(d3.format("d")));
	

canvas1.append("text")
		.attr("x","-150")
		.attr("y","12")
		.text("Number of Refugees")
		.attr("transform","rotate(-90,50,100)");


canvas1.append("text")
		.attr("x","-100")
		.attr("y","12")
		.text("Year")
		.attr("transform","translate(350,425)");		





}

/*To design bar chart for Part A*/
function callBarChart()
{

var newdiv = document.createElement("div");
newdiv.setAttribute("id","Barchart");

var heading = document.createElement("h3");
heading.setAttribute("id","Barheading");

document.body.appendChild(newdiv);
document.getElementById("Barchart").appendChild(heading);
document.getElementById("Barheading").innerHTML='Bar Chart';

var refugeeCount=getTotals();


var canvas1 = d3.select("body").
					append("svg").
					attr("width",600).
					attr("height",500).
					append("g").
					attr("transform","translate(50,40)");


var xaxisScale1 = d3.scaleLinear()
				.domain([240000,0])
				.range([40,400]);


var xaxis1=d3.axisLeft().scale(xaxisScale1);

var yaxisScale1 = d3.scaleLinear()
				.domain([1974,2016])
				.range([0,516]);

var yaxis1=d3.axisBottom().scale(yaxisScale1);


var heightscale1 = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var widthScale = d3.scaleLinear()
    			.domain([0,240000])
    			.range([0,360]);

var rectangle1=canvas1.selectAll("rect")
					.data(refugeeCount)
					.enter()
					.append("rect")
						.attr("width",12)
						.attr("height",function(d) {return heightscale1(d);})
						//.attr("fill",'red')
						.attr("y",function(d,i){return (400-heightscale1(d));})
						.attr("x",function(d,i){return (12*i);})
						.attr("fill","red")
						.attr("stroke","white")
						.attr("stroke-width","1")
						.attr("transform","translate("+12+",0)");

canvas1.append("g")
		.call(xaxis1.ticks(13).tickFormat(d3.formatPrefix(".0",1e3)));

canvas1.append("g")
		.attr("transform","translate(0,400)")
		.call(yaxis1.ticks(8).tickFormat(d3.format("d")));


	

canvas1.append("text")
		.attr("x","-150")
		.attr("y","12")
		.text("Number of Refugees")
		.attr("transform","rotate(-90,50,100)");


canvas1.append("text")
		.attr("x","-100")
		.attr("y","12")
		.text("Year")
		.attr("transform","translate(350,425)");		

}

/*To find the total count of refugees per year*/
function getTotals()
{

var sum = refugees.map(function(obj) { 
  
   return obj["Africa"]+obj["Asia"]+obj["Europe"]+obj["Former Soviet Union"]+obj["Kosovo"]+obj["Latin America/Caribbean"]+obj["Near East/South Asia"];
});

return sum;
}

/*To find the coordinateValue to plot the text in line chart*/
function findMax(country)
{

var sum = refugees.map(function(obj) { 

   return obj[country];
});

var max = sum.reduce(function(a, b) {
    return Math.max(a, b);
});

//Hard coded to avoid overlapping
if(country=='Africa')
max=max-12000;
return max;
}