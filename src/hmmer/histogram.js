
hmmer_vis.histogram = function() {
	"use strict";
	var chart;

	// The cbak returned
	var histogram = function(div) {
		chart = nv.models.multiBarChart()
		//.transitionDuration(350)
		.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
		.rotateLabels(0)      //Angle to rotate x-axis labels.
		.showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		.groupSpacing(0.1)    //Distance between each group of bars.
		.stacked(true)
		.showXAxis(false);


		// chart.xAxis.tickFormat(d3.format(',f'));

		chart.yAxis.tickFormat(d3.format('f'));
		//chart.xAxis.rotateLabels(-45);
		d3.select('#histogram svg')
		.datum(_exampleData())
		.transition().duration(500)
		.call(chart);

		nv.utils.windowResize(chart.update);
		d3.selectAll(".nv-bar").on('click',
		function(){
			console.log("clicked");
		});

		return chart;
	};
	hmmer_vis.dispatch.on('update_histogram', function(args){
		// 	    //do something here
		var arr = [];
		if (typeof args !== 'undefined' && typeof args.hits_distribution !== 'undefined'){
			console.log("found some in histogram "+args.hits_distribution);
			for (var i = 0; i < args.hits_distribution.length; i++){
				arr.push({'x' : i , 'y' : args.hits_distribution[i]});
			};
			var new_object = [{'key': "all", "values":arr}];
			histogram.redraw(new_object);
		}
	})
	//

	histogram.redraw = function(hits_distribution) {
		var data = typeof hits_distribution !== 'undefined' ? hits_distribution : _exampleData();
		var example_data =_exampleData();
		console.log("redraw called");
		d3.select('#histogram svg')
		// chart
		.datum(data)
		.transition().duration(500)
		.call(chart);
		return histogram;
	}
	//Generate some nice data.
	function _exampleData() {
		var taxa = ['Eukaryota','Bacteria', 'Archaea', 'Viruses','unclassified', 'other'];

		var arr = [];
		for (var i = 0; i < 30; i++){
			arr.push(
					{key : 'all' , values : Math.floor((Math.random() * 50) + 1)}
					);
		}
		// return arr;
		 return stream_layers(6,10+Math.random()*30,.1).map(function(data, i) {
			return {
				key: taxa[i],
				values: data
			};
		});
	}


	function stream_layers(n, m, o) {
		if (arguments.length < 3) o = 0;
		function bump(a) {
			var x = 1 / (.1 + Math.random()),
			y = 2 * Math.random() - .5,
			z = 10 / (.1 + Math.random());
			for (var i = 0; i < m; i++) {
				var w = (i / m - y) * z;
				a[i] += x * Math.exp(-w * w);
			}
		}
		return d3.range(n).map(function() {
			var a = [], i;
			for (i = 0; i < m; i++) a[i] = o + o * Math.random();
			for (i = 0; i < 5; i++) bump(a);
			return a.map(stream_index);
		});
	}

	/* Another layer generator using gamma distributions. */
	function stream_waves(n, m) {
		return d3.range(n).map(function(i) {
			return d3.range(m).map(function(j) {
				var x = 20 * j / m - i / 3;
				return 2 * x * Math.exp(-.5 * x);
			}).map(stream_index);
		});
	}

	function stream_index(d, i) {
		return {x: i, y: Math.max(0, d)};
	}

	histogram.start_timer = function(){
		setInterval(function () {
			histogram.redraw();
		}, 1500);
	}

	return histogram;
};
