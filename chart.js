

function moveProgressBar(progress, ticker, offset, time){
	progress.transition()
		.duration(time)
		.ease(d3.easeLinear)
		.attr('fill', function(){
			return 'gray';
		})
		.attr('width', function(){
			return offset;
		});
		
	ticker.transition()
		.duration(time)
		.ease(d3.easeLinear)
		.attr('x1', function(){
			return offset;
		})
		.attr('x2', function(){
			return offset;
		})
}

function format(num) { 
	var h = Math.floor( num / 3600 ); 
	var m = Math.floor((num - h * 3600) / 60 ); 
	var s = num - (h * 3600 + m * 60); 
	return ( m < 10 ? "0" + m : m ) + ":" + ( s < 10 ? "0" + s : s ); 
}

function drawArea(indicator, data, key, audio=null){
	var svg = d3.selectAll(indicator)
	var dict_data = {}
	for(var i=0; i<data.length; i++){
		dict_data[data[i].time] = data[i].count
	}
	
	try {
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}
	catch(err) {
		return null
	}
    
	
	var xDomain = d3.scaleLinear()
		.rangeRound([0, width]);

	var yDomain = d3.scaleLinear()
		.rangeRound([height, 0]);

	var xScale = xDomain.domain([0, parseInt(audio.duration)]);
	var yScale = yDomain.domain([0, d3.max(data, function(d) { return d.count; })]);
	
	var area = d3.area()
		.curve(d3.curveCardinal)
		.x(function(d) {  return xScale(d.time); })
		.y1(function(d) { return yScale(d.count); });

	// define the line
	var valueline = d3.line()
		.curve(d3.curveCardinal)
		.x(function(d) { return xScale(d.time); })
		.y(function(d) { return yScale(d.count); });


	area.y0(yScale(0));

	// set the gradient
	svg.append("linearGradient")				
		.attr("id", "area-gradient")			
		.attr("gradientUnits", "userSpaceOnUse")	
		.attr("x1", 0).attr("y1", yScale(0))			
		.attr("x2", 0).attr("y2", -10)
		.selectAll("stop")						
		.data([								
		  {offset: "0%", color: "#ff6000"},		
		  {offset: "100%", color: "#ffd134"}	
		])					
		.enter().append("stop")			
		.attr("offset", function(d) { return d.offset; })	
		.attr("stop-color", function(d) { return d.color; })

	

	/*svg.append('rect')
		.attr('class', 'bg-rect')
		.attr('x', 49)
		.attr('y', 120)
		.attr('fill', 'white')
		.attr('height', 15)
		.attr('width', function(){
			return segmentWidth * states.length;
		});*/


	/*progress.transition()
		.duration(10000)
		.attr('width', function(){
			var index = states.indexOf(currentState);
			return (index + 1) * segmentWidth;
		});*/
		
	// moveProgressBar(progress, focus.select('#focusLineX'+key), xScale(100), 3000)
	//moveProgressBar(progress, focus.select('#focusLineX'+key), xScale(200), 3000)
	//moveProgressBar(progress, focus.select('#focusLineX'+key), xScale(300), 3000)
	
	return [progress, focus.select('#focusLineX'+key), xScale, xDomain]
}

// The new data variable.
var data = [
  {letter: 1, frequency: .08167},
  {letter: 2, frequency: .01492},
  {letter: 3, frequency: .02780},
  {letter: 4, frequency: .04253},
  {letter: 5, frequency: .12702},
  {letter: 6, frequency: .02288},
];

function processData(allText) {

	var record_num = 3; // or however many elements there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	
	res = {}
	for(i=1; i<allTextLines.length; i++){
		if(allTextLines == "") continue;
		tokens = allTextLines[i].split('\t')
		
		if(res[tokens[1]] == undefined)
			res[tokens[1]] = []
		x = parseInt(tokens[0])
		y = parseFloat(tokens[2])
		if(isNaN(x)) x = 0
		if(isNaN(y)) y = 0
		res[tokens[1]].push({"time": x, "count": y})
	}
	return res
}
