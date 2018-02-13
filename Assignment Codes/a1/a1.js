
/*To get the refugee count per year (Part 3.A)*/ 
function getTotals(refugees)
{

var sum = refugees.map(function(obj) { 
  
   return obj["Africa"]+obj["Asia"]+obj["Europe"]+obj["Former Soviet Union"]+obj["Kosovo"]+obj["Latin America/Caribbean"]+obj["Near East/South Asia"];
});

document.getElementById("getTotalsValue").innerHTML=sum;
document.getElementById("getTotalsValue").display='block';
return sum;
}

/*To get the year map for Appending Ids to the bars (Part 3.B)*/ 
function getYears(refugees)
{

var years = refugees.map(function(obj) { 
  
   return obj["Year"];
});



return years;
}


/* Helper function to append name, attrs to the appendTo for svg elements*/ 
function makeElt(name, attrs, appendTo)
{
	
    var element = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs === undefined) attrs = {};
    for (var key in attrs) {
        element.setAttributeNS(null, key, attrs[key]);
    }
    
         document.getElementById(appendTo).appendChild(element);
    
    return element;
}


/* Helper function to append name, attrs to the appendTo for svg text*/ 
function makeInnerEltText(name, attrs, appendTo,text,value)
{

	
    var element = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs === undefined) attrs = {};
    for (var key in attrs) {
        element.setAttribute( key, attrs[key]);
    }
    
    var id=name+''+text;
    
    document.getElementById(appendTo).appendChild(element);
    document.getElementById(id).innerHTML = value;
    return element;

	
   
}

/* Helper function to make y axis value for the bar (3.B)*/ 
function makeaxis(name, attrs, appendTo,text,value)
{

	var element = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs === undefined) attrs = {};
    for (var key in attrs) {
        element.setAttribute( key, attrs[key]);
    }
   
    var id=name+'axis'+text;

    document.getElementById(appendTo).appendChild(element);
    document.getElementById(id).innerHTML = value;
    return element;

	
   
}

/* To create the bar (3.B)*/ 
function createBarChart()
{

createDynamicLabel();

var sum=getTotals(refugees);
var years=getYears(refugees);	
var height=400;

var obj = {
		    width: 600,
		    height: 400,
		    id:'svg'
    
		  };

var svg=makeElt('svg',obj,'barchart');

var obj2 = {
		    transform:"translate(70,0)",
		    id:'g'
   		   };

var g=makeElt('g',obj2,'svg');

var obj6 = {
			x1: 0,
			y1:0,
			x2:0,
			y2:350,
			'stroke-width': 2,
			'stroke': 'black',
	    	};

var rect=makeElt('line',obj6,'g');

/*For number of values to be shown in y-axis*/
for (var i = 1; i <= 14; i++) {

var y=25*i;
var axisvalue=650*(350-y);
var obj4 = {
			x:-50,
			y: 25*i,
			fill:'yellow',
			stroke:'black',
			'stroke-width': 1,
			'id':'textaxis'+i
			};

var newtxt=makeaxis('text',obj4,'g',i,axisvalue);	
}



sum.forEach(function(value,i)
	{

	var id=years[i];
	var rectanglewidth=12;
	var rectangleheight=value/650;

	var translatevalue='translate('+(12.5*i)+','+(height-50-rectangleheight)+')';
	var obj3 = {
				width: rectanglewidth,
			    height: rectangleheight,
			    fill:'red',
			    stroke:'black',
			    'stroke-width': 2,
			    transform:translatevalue,
			    id:id,
			    class:"rect"
		    	};

	var rect=makeElt('rect',obj3,'g');

	});

var obj5 = {
 			   transform:"translate(70,0)",
    		   id:'g1'
    		};

var g=makeElt('g',obj5,'svg');

years.forEach(function(value,i)
	{
	var obj4 = {
			   	x:12.5*(i+1),
			    y: 380,
			    fill:'yellow',
			    stroke:'black',
			    'stroke-width': 1,
			    'id':'text'+i,
			    'font-size':"12",
			    'transform':"rotate(-90,"+12.5*(i+1)+",380)"
	   			};

	var rect=makeInnerEltText('text',obj4,'g1',i,value);

	});	


		

}

/*Dynamic Input field and labels for the Barchart*/
function createDynamicLabel()
{
var newdiv = document.createElement("div");
newdiv.setAttribute("id","newdiv");

var heading = document.createElement("h2");
heading.setAttribute("id","heading");

var label = document.createElement("label");
label.setAttribute("id","inputlabel");

var input = document.createElement("input");
input.setAttribute("type","text");
input.setAttribute("id","inputtext");
input.setAttribute("placeholder","Enter the year (1975-2016)");
input.setAttribute("oninput","highlightYear(this.value)");
input.setAttribute("onchange"," highlightYear(this.value)");


document.getElementById("barchart").appendChild(newdiv);
document.getElementById("newdiv").appendChild(heading);
document.getElementById("newdiv").appendChild(label);
document.getElementById("newdiv").appendChild(input);


document.getElementById("heading").innerHTML='Barchart';
document.getElementById("inputlabel").innerHTML='Input the Year:';
}

/*Highlighting the bars when entered the year (Part 3.C)*/ 
function highlightYear(value)
{
	
	if(document.getElementById(value)!=null)
	{
		document.getElementById(value).setAttribute("fill","green");
		
	
	}
	else
	{
		var updateAll=document.getElementsByClassName("rect");
		
		for (var i = 0; i < updateAll.length; i++)
		{
			updateAll[i].setAttribute("fill","red")
		}
		
	}
		
	
}

