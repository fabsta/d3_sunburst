
hmmer_vis.pie_chart = function() {
	"use strict";
	var chart;
	
	// The cbak returned
	var pie_chart = function(div) {
	chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
		// .donut(true)
		// .growOnHover(true)
		.noData("There is no Data to display")
        .showLegend(false)
		;
		
	 chart.color(["green","grey","yellow"])
      d3.select("#pie_chart svg")
          .datum(_exampleData())
          .transition().duration(350)
          .call(chart);

    return pie_chart;
	};


	hmmer_vis.dispatch.on('update', function(args){
	    //do something here
		console.log("I was told to  "+args.message);
		pie_chart.redraw(args.count);
	})
	

    pie_chart.redraw = function(pie_data) {
		var new_data = [], i = 0;
		if(pie_data !== undefined){
			for (var letter in {'present':0,'complete':0, 'incomplete':0}) {
				new_data.push({'label':letter, 'value': pie_data[i++]})
			}
		}
		else{
			new_data = _exampleData();
		}
		// console.log("redraw called");
         d3.select('#pie_chart svg')
			// chart
            .datum(new_data)
            .transition().duration(500)
			.call(chart);
			// pie_chart.update();
			return pie_chart;	
    }
	//Generate some nice data.
	function _exampleData() {
		var test_array = [];
	 	for (var letter in {'present':0,'complete':0, 'incomplete':0}) {
		   test_array.push({'label':letter, 'value': Math.random()*30})
	 	}
		return test_array;
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

	pie_chart.start_timer = function(){
		setInterval(function () {
	          pie_chart.redraw([2,6,100]);
	     }, 1500);
	}

	return pie_chart;
};
