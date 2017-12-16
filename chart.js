

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

