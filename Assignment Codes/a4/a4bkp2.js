function extractJobsPct(jobData, year, occCode, number) {
    var res = jobData.filter(
	function(d) { return ((year == null || d.year == year) &&
			      (occCode == null || d.occ_code == occCode)); });
    res = res.sort(function(a,b) {
	return d3.descending(+a.jobs_1000,+b.jobs_1000);
    });
    if (number) {
	return res.slice(0,number);
    } else {
	return res;
    }
}

var barW = 500,
    barH = 300,
    barMargin = {top: 20, bottom: 120, left: 100, right: 20},
    barX = d3.scaleBand().padding(0.1),
    barY = d3.scaleLinear(),
    barXAxis = null;

function createBars(divId, jobData, year, occCode) {
    var svg = d3.select(divId).append("svg")
	.attr("width", barW+barMargin.left+barMargin.right)
	.attr("height", barH+barMargin.top+barMargin.bottom)
	.append("g")
	.attr("class", "main")
	.attr("transform",
	      "translate(" + barMargin.left + "," + barMargin.top + ")")

    var csData = extractJobsPct(jobData, year, occCode, 18);



    barX.range([0,barW])
	.domain(csData.map(function(d) { return d.area_title; }));
    barY.range([barH,0])
	.domain([0,d3.max(extractJobsPct(jobData, null, occCode),
			  function(d) { return +d.jobs_1000; })]);

    svg.selectAll("rect")
	.data(csData)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return barX(d.area_title); })
	.attr("y", function(d) { return barY(+d.jobs_1000); })
	.attr("width", barX.bandwidth())
	.attr("height", function(d) { return barH - barY(+d.jobs_1000); })

    barXAxis = d3.axisBottom(barX);

    svg.append("g")
	.attr("transform", "translate(0," + barH +")")
	.attr("class", "x axis")
	.attr("id", "x-axis")
	.call(barXAxis)

    var barYAxis = d3.axisLeft(barY);

    svg.append("g")
	.attr("class", "y axis")
	.call(barYAxis)

    svg.append("g")
	.attr("transform", "translate(-30," + (barH/2) + ") rotate(-90)")
	.append("text")
	.style("text-anchor", "middle")
	.text("Jobs Per 1000")

    svg.append("text")
	.attr("x", barW/2)
	.attr("y", barH + 115)
	.text("State")
}

function updateBars(divId, jobData, year) {
    // write code to update the bar chart created to the specified year
    // you should use two transitions, one to update the bar values
    // and the other to reorder the bars
    // Make sure to transition the axes, too!

	var svg = d3.select(divId);

	var OldcsData = extractJobsPct(jobData, '2012', '15-0000', 18);
	var csData = extractJobsPct(jobData, year, '15-0000', 18);
    var newcsData=[];

	console.log(OldcsData);
	console.log(csData);

	OldcsData.forEach( function(element, index) 
	{
	
		var state=element['area_title'];
    	var flag=false;
    	
    	csData.forEach( function(element1, index1) 
    	{
    		if(state==element1['area_title'])
    		{
    			console.log(state);
    			flag=true;
    			var data={'area_title': state,'jobs_1000':element1['jobs_1000']};
    			newcsData.push(data);
    		}
    	});

	   	 if(!flag)
    	{
    		flag=true;
    			var data={'area_title': state,'jobs_1000':0};
    			newcsData.push(data);
    	}

	});

	console.log(newcsData);

	var t = d3.transition()
    .duration(2000)
    .ease(d3.easeLinear);

    var selection=svg.selectAll("rect")
	.data(newcsData);
-	//.sort(function(a,b) { return d3.descending(+a.value, +b.value); });



    selection
	.transition(t)
	.attr("class", "bar")
	//.attr("x", function(d) { return barX(d.area_title); })
	.attr("y", function(d) { 
			console.log(barY(+d.jobs_1000));
		return barY(+d.jobs_1000); })
	//.attr("width", barX.bandwidth())
	.attr("height", function(d) { return barH - barY(+d.jobs_1000); })

var selection1=svg.selectAll("rect")
	.data(newcsData);

/*var reselection=svg.selectAll("rect")
	.data(newcsData.filter(function(k) { return k.jobs_1000!=0}));*/		
		/*newcsData.sort(function (a, b) {
  				return b.jobs_1000 - a.jobs_1000;
		})*/

console.log(newcsData.sort(function(a,b) { return d3.descending(+a.jobs_1000, +b.jobs_1000); }));
console.log(newcsData.map(function(d) { return d.area_title; }));
	barX.range([0,barW])
	.domain(csData.sort(function(a,b) { 
		
			return d3.descending(+a.jobs_1000, +b.jobs_1000); }).map(function(d) { return d.area_title; }));
    barY.range([barH,0])
	.domain([0,d3.max(csData.sort(function(a,b) { return d3.descending(+a.jobs_1000, +b.jobs_1000); }),
			  function(d) { return +d.jobs_1000; })]);

console.log(d3.max(newcsData,
			  function(d) { return +d.jobs_1000; }));
	 barXAxis = d3.axisBottom(barX);


console.log(newcsData);

var t=d3.transition()
	.duration(2000)
	.delay(3000);

	selection1
	.transition(t)
	.attr("class", "bar")
	.attr("x", function(d) { 
		if(barX(d.area_title)!=undefined)
			return barX(d.area_title); 
	 	else
	 		return 0;});
	//.attr("y", function(d) { return barY(+d.jobs_1000); })
	//.attr("width", barX.bandwidth())
	//.attr("height", function(d) { return barH - barY(+d.jobs_1000); })
		

	svg.selectAll("#x-axis")
		.transition(t)
		.call(barXAxis);


var selection2=svg.selectAll("rect")
	.data(csData);

var t2=d3.transition()
	.duration(2000)
	.delay(3000);

	selection2
	.transition(t2)
	.attr("class", "bar")
	.attr("y", function(d) { 
			console.log(barY(+d.jobs_1000));
		return barY(+d.jobs_1000); })
	//.attr("width", barX.bandwidth())
	.attr("height", function(d) { return barH - barY(+d.jobs_1000); });


	/*console.log(newcsData.filter(function(k) { return (barH - barY(+k.jobs_1000)) !=0; }));

	d3.selectAll("rect")
	.data(newcsData.filter(function(k) { return (barH - barY(+k.jobs_1000)) != 0; }))
	.exit()
	.remove();*/

/*
	selection.exit()
	.remove();
    */
}

function getStateRankings(jobData, occCode) {
    // TODO: compute the state rankings for the given occCode
    
    // TODO: remove this statically encoded solution that only works for code "15-0000"

//console.log(jobData);

var nested_data = d3.nest()

.key(function(d) { return d.area_title; })
.key(function(d) { return d.occ_code; })
.rollup(function(d) {  
var value=d.reduce(function(acc, val) {
  				//console.log(acc);
				if(!isNaN(acc) && !isNaN(val.tot_emp))
  						return parseInt(acc) + parseInt(val.tot_emp);
  				else
	  					return 0;
				}, 0);
			return value; })
.entries(jobData);


//console.log(nested_data);

 var output = {};

nested_data.forEach( function(element, index) {
	
	nested_data[index]['values'].sort(function (a, b) {
  return b.value - a.value;
});

var key=nested_data[index]['key'];

//console.log(key);

var value=nested_data[index]['values'].findIndex(function isBigEnough(element) {
  	//console.log(element['key']);
  	//console.log(occCode);
  return element['key'] == occCode;
});

//console.log(value);

output[key]=value;
});

return output;
    //return {"Alabama":16,"Alaska":18,"Arizona":12,"Arkansas":15,"California":10,"Colorado":9,"Connecticut":14,"Delaware":10,"District of Columbia":4,"Florida":15,"Georgia":11,"Hawaii":17,"Idaho":14,"Illinois":10,"Indiana":15,"Iowa":14,"Kansas":14,"Kentucky":15,"Louisiana":17,"Maine":15,"Maryland":8,"Massachusetts":9,"Michigan":15,"Minnesota":11,"Mississippi":17,"Missouri":13,"Montana":16,"Nebraska":12,"Nevada":16,"New Hampshire":13,"New Jersey":10,"New Mexico":16,"New York":15,"North Carolina":13,"North Dakota":14,"Ohio":13,"Oklahoma":15,"Oregon":13,"Pennsylvania":14,"Rhode Island":13,"South Carolina":16,"South Dakota":14,"Tennessee":15,"Texas":12,"Utah":11,"Vermont":14,"Virginia":7,"Washington":9,"West Virginia":16,"Wisconsin":13,"Wyoming":19}
}


function createBrushedVis(divId, usMap, jobData, year) {
    /*var jobData = jobData.filter(
	function(d) { return (+d.year == year); });*/
    
    var width = 600,
	height = 400;

    var svg = d3.select(divId).append("svg")
	.attr("width", width)
	.attr("height", height);

    var projection = d3.geoAlbersUsa()
	.fitExtent([[0,0],[width,height]], usMap);

    var path = d3.geoPath()
	.projection(projection);

    var rankings = getStateRankings(jobData, "15-0000");
    var color = d3.scaleSequential(d3.interpolateViridis).domain([22,0]);
    
    svg.append("g")
	.selectAll("path")
	.data(usMap.features)
	.enter().append("path")
	.attr("d", path)
	.attr("fill",
	      function(d) { return color(rankings[d.properties.name]); })
	.attr("class", "state-boundary")
	.classed("highlight", false)
    
    var bWidth = 400,
	bHeight = 400,
	midX = 200;
    
    var allJobs = d3.nest()
	.key(function(d) { return d["occ_code"]; })
	.key(function(d) { return d["occ_title"]; })
	.rollup(function(v) {
	    return v.reduce(function(s,d) {
		if (!+d.tot_emp) { return s; } return s + +d.tot_emp; },0); })
	.entries(jobData)
	.sort(function(a,b) { return d3.descending(+a.values[0].value, +b.values[0].value); })
    
    var barSvg = d3.select(divId).append("svg")
	.attr("width", bWidth)
	.attr("height", bHeight)
	.style("vertical-align", "bottom")
    
    var y = d3.scaleBand().padding(0.1).range([0,bHeight]).domain(allJobs.map(function(d) { return d.values[0].key; }));
    var x = d3.scaleLinear().range([0,bWidth-midX]).domain([0,d3.max(allJobs, function(d) { return d.values[0].value; })]);
    
    var bars = barSvg.selectAll(".bar").data(allJobs)
	.enter().append("g")
	.attr("transform",
	      function(d) { return "translate(0," + y(d.values[0].key) + ")";})
	.attr("class", "bar")
    
    function jobMouseEnter() {
	// TODO: add code here
	var key=d3.select(this).datum().key;

	//console.log(key.substring(0,2));

	key=key.substring(0,2);

	bars.selectAll("rect")
 	.classed("highlight", function(d) { return d.key != d3.select(this).datum().key; })
	.on("mouseover", jobMouseEnter)

    
 	bars.select("rect[id='"+key+"']")
 	.classed("highlight", function(d) { return d.key == d3.select(this).datum().key; })
	.on("mouseover", jobMouseEnter)

    	createLineChart(jobData,key+"-0000");

	 var rankings = getStateRankings(jobData, key+"-0000");
    var color = d3.scaleSequential(d3.interpolateViridis).domain([22,0]);
    
    svg.append("g")
	.selectAll("path")
	.data(usMap.features)
	.enter().append("path")
	.attr("d", path)
	.attr("fill",
	      function(d) { return color(rankings[d.properties.name]); })
	.attr("class", "state-boundary")
	.classed("highlight", false);



    }
    
   // console.log(allJobs);

    createLineChart(jobData,"15-0000");

    bars.append("rect")
	.attr("x", midX)
	.attr("y", 0)
	.attr("width", function(d) { return x(d.values[0].value); })
	.attr("height", y.bandwidth())
	.attr("id",function(d){ return d.key.substring(0,2);})
	.classed("highlight", function(d) { return d.key == '15-0000'; })
	.on("mouseover", jobMouseEnter)

    bars.append("text")
    	.attr("x", midX - 4)
    	.attr("y", 12)
    	.style("text-anchor", "end")
    	.text(function(d) { var label = d.values[0].key.slice(0,-12);
			    if (label.length > 33) {
				label = label.slice(0,30) + "...";
			    }
			    return label; });

//getjobData(jobData,'15-0000');

}

function getjobData(jobData,occCode)
{

var nested_data = d3.nest()
.key(function(d) { return d.occ_code; })
.key(function(d) { return d.year; })
.rollup(function(d) {  
	//console.log(d);
var value=d
		.reduce(function(acc, val) {
				if(!isNaN(acc) && !isNaN(val.tot_emp))
		  				return parseInt(acc) + parseInt(val.tot_emp);
		  		else
		  				return 0;
				}, 0);
					return value; })
.entries(jobData);

//console.log(nested_data);

nested_data=nested_data
	.filter(function(d,i){
  				return d['key']==occCode;
						})
/*console.log(
	);*/


return nested_data;

}

function createLineChart(jobData,occCode)
{

var dataForOccCOde=getjobData(jobData,occCode);

//console.log(dataForOccCOde);

var barW = 150,
    barH = 100,
    barMargin = {top: 20, bottom: 120, left: 100, right: 20},
    barX = d3.scaleBand().padding(0.1),
    barY = d3.scaleLinear(),
    barXAxis = null;

d3.select("#lineChart").remove();

var canvas1 = d3.select("#brushed").
					append("svg")
					.attr("id","lineChart")
					.attr("width", barW+barMargin.left+barMargin.right)
					.attr("height", barH+barMargin.top+barMargin.bottom)
					.append("g")
					.attr("transform",
	      			"translate(" + barMargin.left + "," + barMargin.top + ")")



//console.log(d3.max(dataForOccCOde));

var data1=[];

//console.log(dataForOccCOde);
d3.max(dataForOccCOde)['values'].forEach( function(element, index) {
	// statements
		data1.push(element['value']);

});

/*console.log(data1);
console.log(d3.max(data1));*/


barX=d3.scaleLinear().domain([2012,2016])
				.range([0,barW]);
/*
	barX.range([0,barW])
	.domain([2012,2013,2014,2015,2016])*/;

	var min;
	if(d3.min(data1)>100000)
		min=d3.min(data1)-100000;
	else
		min=d3.min(data1);

    barY.range([barH,0])
	.domain([min,d3.max(data1)]);



    barXAxis = d3.axisBottom(barX);

    canvas1.append("g")
	.attr("transform", "translate(0," + barH +")")
	.attr("class", "x axis")
	.call(barXAxis.ticks(5))

    var barYAxis = d3.axisLeft(barY);

    canvas1.append("g")
	.attr("class", "y axis")
	.call(barYAxis.ticks(3).tickFormat(d3.formatPrefix(".0",1e3)))



/*var xaxisScale1 = d3.scaleLinear()
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
*/
			var line = d3.line()
			.x(function(d,i) { 

					var year;

					if(i==0)
						year=2012;
					if(i==1)
						year=2013;
					if(i==2)
						year=2014;
					if(i==3)
						year=2015;
					if(i==4)
						year=2016;
	//			console.log(barX(year));
				return barX(year);})
			.y(function(d,i) { 
	//				console.log(barY(d))
				return barY(d);

			});
//			console.log(line);

	canvas1.append("path")
	   .data([data1])
	   
         .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("d", line);


     canvas1.append("g")
	.attr("transform", "translate(-50," + (barH/2) + ") rotate(-90)")
	.append("text")
	.style("text-anchor", "middle")
	.text("Total no of Employees")

    canvas1.append("text")
	.attr("x", barW/2)
	.attr("y", barH + 75)
	.text("Year")

/*      canvas1.append("text")
		.data(refugees)
		.attr("transform", "translate(520,"+(findMax(value))+")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", colors(i))
		.text(value);*/
}

function processData(errors, usMap, jobsData) {
   // console.log("Errors", errors)
    createBars("#bars", jobsData, 2012, "15-0000");
   updateBars("#bars", jobsData, 2016);

	
    createBrushedVis("#brushed", usMap, jobsData, 2016);    
}

d3.queue()
    // use these two files
    .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a4/us-states.json")
    .defer(d3.csv, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a4/occupations.csv")
    // or these HTTPS versions
    //.defer(d3.json, "https://cdn.rawgit.com/dakoop/69d42ee809c9e7985a2ff7ac77720656/raw/6707c376cfcd68a71f59f60c3f4569277f20b7cf/us-states.json")
    //.defer(d3.csv, "https://cdn.rawgit.com/dakoop/69d42ee809c9e7985a2ff7ac77720656/raw/6707c376cfcd68a71f59f60c3f4569277f20b7cf/occupations.csv")
    .await(processData);
