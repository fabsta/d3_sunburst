
hmmer_vis.domain_architectures_view = function() {
	"use strict";
	var chart, svg, axisScale, xAxis,yAxis,xAxisGroup,yAxisGroup;
	var margin = {top: 0, right: 20, bottom: 10, left: 85},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	var y = d3.scale.ordinal().rangeRoundBands([0, height], .3);
	var x = d3.scale.linear().rangeRound([0, width]);
	var conf = {
		'no_hits' : 10,
		'row_height' : 80,
		'query_offset' : 20,
		'width' : undefined,
		'height' : undefined,
		'query_line_offset' : 8.2,
		'hit_offset' : 9,
		'hit_height' : 4,
		'query_seq_height': 4,
		'longest_hit' : 0,
		'hit_legend_top' :6,
		'hit_legend_bottom' : 21,

		// global svg settings
		'div_width' : 300
	};
	var color = d3.scale.category20c();


	// The cbak returned
	var domain_architectures_view = function(div, data) {

		// number of hits
		conf.all_hits = data;
		conf.no_hits = conf.all_hits ? conf.all_hits.length : 1;
		conf.height = conf.no_hits * conf.row_height;

		// determine longest hit
		conf.longest_hit = d3.max(data, function(d) {
			var test;
			return d.length;
		});
		conf.width = conf.longest_hit;

		axisScale = d3.scale.linear()
		.domain([0, conf.width])
		.range([0, conf.div_width]);


		var ul = d3.select(div).append("ul").attr("class", "top_hits");

		// var li = ul.selectAll("li")
// 		.data(conf.all_hits)
// 		.enter()
// 		.append("li")
// 		.append('div').attr('class', 'container-fluid')
// 		.append('div').attr('class', 'row');
//
//
// 		// define the three columns
// 		var left_blocks = li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2 domain_info')
// 		.append("span")
// 		.attr("class", "block").html(function(d){
// 			return d.dom_count+"<br>sequences";
// 		});
//
// 		// left_blocks.append("span")
// 		// .attr("class", "small").html(function(d){ return d.species; });
// 		// middle
// 		var middle_div = li.append('div').attr('class', 'col-xs-12 col-md-10 col-lg-10 domain_middle_container')
//
//
//
//
// 		var middle_upper_div = middle_div.append("div").attr('class','row clearfix').append("div").attr('class','col-md-12 column')
// 		var middle_lower_div = middle_div.append("div").attr('class','row clearfix').append("div").attr('class','col-md-12 column')
//
// 		var dom_arch_ids  = new Array();
//
//
//
//
// 		var example_text = middle_upper_div.append("text")
// 		.attr("class", "hit_legend")
// 		.attr("x", function(d,i) { return 50; })
// 		// .attr('y', function(d,i, j){
// 		// 	// dom_arch_string = d
// 		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
// 		// })
// 		.text(function(d){return "with domain architecture , example:"});
//
// 		var example_text = middle_lower_div.append("div").attr('id', function(d,i){
// 			dom_arch_ids.push("dom_arch_graphic_"+i);
// 			return "dom_arch_graphic_"+i;
// 		})
// 		for (var id of dom_arch_ids) {
// 		   console.log(id);
// 		// add pfam graphics here
// 			var chart = new PfamGraphic("#"+id, example_sequence);
// 			// var chart = new PfamGraphic();
// 			chart.render();
// 			var new_width = $("#"+id).parent().width();
// 			new_width = 450;
// 			 chart.resize( new_width, 200 );
// 	 	}
		
		
		var li = ul.selectAll("li")
		.data(conf.all_hits)
		.enter()
		.append("li")
		
		var li_link = li.append('a').attr('class', 'left archshow');
		var li_link_span = li_link.append("span").attr('class', 'block')
		var li_link_span_inner = li_link_span.append("span").attr('class', 'smaller')
		li_link_span.html(function(d){
			return d.dom_count+"<br>sequences";
		})
		var li_link_show_all = li_link.append("span").attr('class', 'show').text("Show All")
		
		
		var li_right = li.append('p').attr('class', 'right');

		var li_text = li.append('p').html(function(d){
			
		return 'with domain architecture: <strong>'+d.arch+'</strong>, <i>example:</i><a class="ext" href="http://www.uniprot.org/uniprot/F7FU48_MONDO">F7FU48_MONDO</a>'
		});
		var dom_arch_ids  = new Array();
		var dom_data = new Array();
		var svg_div = li.append("div").attr('class','domGraphics').attr('id', function(d,i){
			dom_data.push(d);
			dom_arch_ids.push(i);
			return "dom_"+i;
		})
		for (var id of dom_arch_ids) {
				   console.log(id);
				   var domain_data = dom_data[id]
				// add pfam graphics here
					var chart = new PfamGraphic("#dom_"+id, domain_data);
					// var chart = new PfamGraphic();
					chart.render();
					var new_width = $("#dom_"+id).parent().width();
					new_width = 450;
					 chart.resize( new_width );
			 	}
		
//
//
// 		var domain_example_svg = middle_div.append("div").attr('class','query_div')
// 		.append('svg')
// 		.attr('height', 20)
// 		.attr('width', "100%")
// 		.attr("transform", function(d){return "translate(30,30)"})
// 		.append("g");
//
// 		set_colors(domain_example_svg);
//
//
// 		domain_example_svg.append("rect")
// 		// y.rangeBand())
// 		.attr("class", "hit_bar")
// 		.attr("x", 0)
// 		.attr("y", 5)
// 		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
// 		.attr("width", function(d) { return axisScale(d.length); })
// 		.attr("height", 4.5)
// 		.attr('r', 0)
// 		.attr('ry', 0)
// 		.attr('rx', 0)
// 		.attr('stroke','none')
// 		.attr('opacity',1)
// 		.attr('fill-opacity',1)
// 		.style("fill", function(d) { return "url(#line_gradient)"; })
//
//
// 		domain_example_svg.append("rect")
// 		// y.rangeBand())
// 		.attr("class", "hit_position")
// 		.attr("x", function(d){return d.hits[0].qstart})
// 		.attr("y", 18)
// 		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
// 		.attr("width", function(d) {
// 			var qstart =  d.hits[0].qstart;
// 			var qend =  d.hits[0].qend;
// 			return axisScale(qend - qstart);
// 		})
// 		.attr("height", 2.5)
// 		.attr('r', 0)
// 		.attr('ry', 0)
// 		.attr('rx', 0)
// 		.attr('stroke','none')
// 		.attr('opacity',1)
// 		.attr('fill-opacity',1)
// 		.style("fill", function(d) { return "black"; })
//
//
//
// 		var target_matches = domain_example_svg.selectAll("g")
// 		.data(function(d) { return d.regions? d.regions : ""; })
// 		.enter();
//
// 		// target_matches.append("rect")
// // 		// y.rangeBand())
// // 		.attr("class", "hit_bar")
// // 		.attr("x", 0)
// // 		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
// // 		.attr("width", function(d) { return axisScale(d.length); })
// // 		.attr("height", 4.5)
// // 		.attr('r', 0)
// // 		.attr('ry', 0)
// // 		.attr('rx', 0)
// // 		.attr('stroke','none')
// // 		.attr('opacity',1)
// // 		.attr('fill-opacity',1)
// // 		.style("fill", function(d) { return "url(#line_gradient)"; })
//
//
// 		target_matches.append('path')
// 		.attr('d', function(d,i){
// 			return draw_domain(axisScale(d.end-d.start), 15);
// 		})
// 		.attr('stroke', function(d){return d.color})
// 		// .attr('fill', 'rgba(0,0,0,0)')
// 		// .attr('stroke-dasharray', '5,5')
// 		.attr('fill', function(d){
// 			return "url(#domain_gradient"+Math.floor((Math.random() * 4) + 1)+")"
// 		})
// 		.attr("transform", function(d,i,j){
// 			var x_coord = axisScale(d.start);
// 			var y_coord = 0;
// 			// x_coord = 20;
// 			return "translate("+x_coord+","+y_coord+")"	;
// 		})


		//evalue
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) {return -30;})
		// .attr('y', function(d,i, j){return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;})
		// .text("Query");

		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) {return -80;})
		// .attr('y', function(d,i, j){return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;})
		// .text(function(d){return d.acc});
		//
		// hits.append("text")
		// .attr("class", "hit_number")
		// .attr("x", function(d,i) {return -80;})
		// .attr('y', function(d,i, j){return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;})
		// .text(function(d,i){return "Hit: "+parseInt(i+1);});


		//
		// // seq length target
		// target_matches.append("rect")
		// .attr("class", "count_rect")
		// .attr("width", 55)
		// .attr("height", 25)
		// .attr('stroke','#000')
		// .attr('stroke-width','0.5')
		// .attr('fill-opacity',0)
		// .attr("x", function(d,i) { return -70; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top - 10;
		// })


		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return -48 })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
		// })
		// .html(function(d){return d.dom_count});
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return -62 })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top+10;
		// })
		// .html(function(d){return "sequences"});
		//


		// // seq length target
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return axisScale(d.length)+2; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;
		// })
		// .text(function(d){return d.length});
		//
		// // query seq length
		// var dom_arch_string, dom_acc;
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return 50; })
		// .attr('y', function(d,i, j){
		// 	// dom_arch_string = d
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
		// })
		// .text(function(d){return "with domain architecture , example:"});

		// //evalue
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return axisScale(conf.longest_hit)+conf.hit_legend_bottom; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
		// })
		// .text(function(d){return d.evalue});







		d3.selectAll(".axis path")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges")

		d3.selectAll(".axis line")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges")


		return domain_architectures_view;
	};



	var add_annotation_line	 = function(d){
		var curr_data = d;
		if(d.regions){
			d3.select(this).selectAll(".annotation_text").data(d.regions).enter()
			//.append("rect")
			.append("text")
			.attr("x", function(d) { return 35; })
			.attr("y", function(d) { return 4; })
		}
	};
	// hmmer_vis.dispatch.on('update', function(args){
	// 	    //do something here
	// 		console.log("I was told to  "+args.message);
	// 		// pie_chart.redraw(args.count);
	//})


	domain_architectures_view.redraw = function(new_data) {
		// update axis
		// we don't really need that as the query doesnt change
		var y_domain = ["Query"];
		for (var i = 1; i <= new_data.length; i++) {
			y_domain.push("Hit "+i)
		}
		// y_domain.push([example_data.map(function(d,i){ return "Hit "+(i+1); })])
		y.domain(y_domain);

		// y.domain(example_data.map(function(d,i){ return "Hit "+(i+1); }));
		// console.log(conf.row_height * example_data.length);
		y.rangeRoundBands([0,conf.row_height * new_data.length])

		d3.select("#y_axis").call(yAxis);



		var vakken = svg.selectAll(".bar").data(new_data, keyFunction);
		vakken.transition().duration(2000);

		var vakken_enter = vakken
		.enter().append("g")
		.attr("class", "bar")
		// .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

		var bars = vakken_enter.selectAll("rect")
		.data(function(d) { return d.regions; });

		bars.transition(function(d){console.log("transitioning ")}).duration(2000).attr("x", 0).style("fill", "yellow");

		var bars_enter = bars.enter().append("g").attr("class", "subbar");

		bars_enter.append("rect")
		.attr("height", conf.hit_height)
		// y.rangeBand())
		.attr("x", function(d) { return axisScale(d.aliStart); })
		.attr('y', function(d,i, j){
			// console.log(d.name+" y = "+(j+1)*20+" i: "+i+ " j: "+j)
			return (i+1)*conf.row_height + conf.hit_offset;
			// return (i)*conf.row_height  + conf.hit_offset;
			// return (i)*conf.row_height + 5;
		})
		.attr("width", function(d) { return axisScale(d.aliEnd - d.aliStart); })
		.style("fill", function(d) { return "green";//color(d.name);
	});



	// bars.append("text")
	// .attr("x", function(d) { return -20; })
	// .attr("y", function(d, i){ return (i+1)*20})
	// .attr("dy", "0.5em")
	// .attr("dx", "0.5em")
	// .style("font" ,"10px sans-serif")
	// .style("text-anchor", "begin")
	// .text(function(d, i) { return "Hit "+i });


	vakken.exit(function(d){
		console.log("removing d: "+d.name);

	}).remove();
	bars.exit().remove();

	return hits_view;
}
//Generate some nice data.
function _exampleData() {
	var test_array = [];
	for (var letter in {'present':0,'complete':0, 'incomplete':0}) {
		test_array.push({'label':letter, 'value': Math.random()*30})
	}
	return test_array;
}


var keyFunction = function(d) {
	// console.log("key is "+d.name);
	return d.arch;
};


function set_colors(svg){
	var gradient = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "line_gradient")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "1.8369701987210297e-16").attr("y1", "0").attr("x2", "0").attr("y2", "1").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
	gradient.append("svg:stop").attr('offset', '0%').attr('stop-color',"#999999").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient.append("svg:stop").attr('offset', '40%').attr('stop-color',"#eeeeee").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient.append("svg:stop").attr('offset', '60%').attr('stop-color',"#cccccc").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient.append("svg:stop").attr('offset', '100%').attr('stop-color',"#999999").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")


	var gradient2 = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "domain_gradient")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.123233995736766e-17").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
	gradient2.append("svg:stop").attr('offset', '0%').attr('stop-color',"#ffffff").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient2.append("svg:stop").attr('offset', '50%').attr('stop-color',"#a3287a").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient2.append("svg:stop").attr('offset', '70%').attr('stop-color',"#a3287a").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient2.append("svg:stop").attr('offset', '100%').attr('stop-color',"#ffffff").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")







	var gradient3 = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "domain_gradient2")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");

	gradient3.append("svg:stop").attr('offset', '0%').attr('stop-color',"#0099CC").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient3.append("svg:stop").attr('offset', '50%').attr('stop-color',"#7a1e74").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient3.append("svg:stop").attr('offset', '70%').attr('stop-color',"#7a1e74").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")
	gradient3.append("svg:stop").attr('offset', '100%').attr('stop-color',"#0099CC").style("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)")





	var gradient4 = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "domain_gradient3")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
	gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#CCF2CC");
	gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
	gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
	gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

	var gradient5 = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "domain_gradient4")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
	gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#14101f");
	gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
	gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
	gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

	var gradient6 = svg.append("svg:defs").append("svg:linearGradient")
	.attr("id", "domain_gradient5")
	.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
	gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#623e32");
	gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
	gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
	gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

}


function draw_domain (length, height, type){

	var offset = 10;
	var curve_overlap = 10 ;
	var start = "M0,0";
	var line_to_end = "L"+length+",0";
	var ragged_end  = 0;
	var ragged_offset = 3;
	var ragged_iterator = parseFloat(1/6);
	// straight line
	  // var end_down = "L"+length+","+height;
	//var end_down = "A30,50 0 0,1 100,100";
	  // var end_down = "S "+length*1.3+","+height/2+" "+length+","+height
	var curved_end_down =  "S "+(length+curve_overlap)+","+height/2+" "+length+","+height;
	var ragged_end_down = 	"L"+(length-ragged_offset)+","+(height*(ragged_iterator * 1)) +
	"L"+length+","+(height*(ragged_iterator * 2)) +
	"L"+(length-ragged_offset)+","+(height*(ragged_iterator * 3)) +
	"L"+length+","+(height*(ragged_iterator * 4)) +
	"L"+(length-ragged_offset)+","+(height*(ragged_iterator * 5)) +
	"L"+length+","+height
	
	var end_down = "L"+length+","+height;
	var end_down = ragged_end? curved_end_down: ragged_end_down;
	
	
	var line_to_start = "L0,"+height;
	// var start_up = "L0,0";
	var start_up = "S "+(-curve_overlap)+","+height/2+" 0,0";
	


	
	var full_path = start+""+line_to_end+""+end_down+""+line_to_start+""+start_up;
	// var path = "M"+i*1",
	// console.log("full path is "+full_path)
	return full_path;

}

var example_sequence2 = {
      "dom_count": 149,
      "length": "1023",
      "regions": [
        {
          "modelStart": "1",
          "modelEnd": "258",
          "endStyle": "jagged",
          "end": "453",
          "display": true,
          "startStyle": "curved",
          "color": "#2849a3",
          "aliEnd": "452",
          "modelLength": "259",
          "text": "Pkinase_Tyr",
          "href": "http:\/\/pfam.xfam.org\/family\/PF07714.12",
          "type": "pfama",
          "metadata": {
            "scoreName": "e-value",
            "score": "5.4e-99",
            "_uniq": 1,
            "description": "Protein tyrosine kinase",
            "bitscore": "319.7",
            "end": "453",
            "accession": "PF07714.12",
            "database": "pfam",
            "aliEnd": "452",
            "identifier": "Pkinase_Tyr",
            "type": "Domain",
            "aliStart": "201",
            "start": "201"
          },
          "aliStart": "201",
          "clan": "CL0016",
          "start": "201"
        },
        {
          "modelStart": "3",
          "modelEnd": "111",
          "endStyle": "curved",
          "end": "1023",
          "display": true,
          "startStyle": "jagged",
          "color": "#286aa3",
          "aliEnd": "1023",
          "modelLength": "111",
          "text": "F_actin_bind",
          "href": "http:\/\/pfam.xfam.org\/family\/PF08919.5",
          "type": "pfama",
          "metadata": {
            "scoreName": "e-value",
            "score": "8.5e-34",
            "_uniq": 3,
            "description": "F-actin binding",
            "bitscore": "105.0",
            "end": "1023",
            "accession": "PF08919.5",
            "database": "pfam",
            "aliEnd": "1023",
            "identifier": "F_actin_bind",
            "type": "Domain",
            "aliStart": "918",
            "start": "916"
          },
          "aliStart": "918",
          "clan": null,
          "start": "916"
        },
        {
          "modelStart": "1",
          "modelEnd": "77",
          "endStyle": "curved",
          "end": "161",
          "display": true,
          "startStyle": "curved",
          "color": "#a3287a",
          "aliEnd": "161",
          "modelLength": "77",
          "text": "SH2",
          "href": "http:\/\/pfam.xfam.org\/family\/PF00017.19",
          "type": "pfama",
          "metadata": {
            "scoreName": "e-value",
            "score": "1.2e-26",
            "_uniq": 4,
            "description": "SH2 domain",
            "bitscore": "81.8",
            "end": "161",
            "accession": "PF00017.19",
            "database": "pfam",
            "aliEnd": "161",
            "identifier": "SH2",
            "type": "Domain",
            "aliStart": "86",
            "start": "86"
          },
          "aliStart": "86",
          "clan": "CL0541",
          "start": "86"
        },
        {
          "modelStart": "1",
          "modelEnd": "48",
          "endStyle": "curved",
          "end": "72",
          "display": true,
          "startStyle": "curved",
          "color": "#cc5b32",
          "aliEnd": "72",
          "modelLength": "48",
          "text": "SH3_1",
          "href": "http:\/\/pfam.xfam.org\/family\/PF00018.23",
          "type": "pfama",
          "metadata": {
            "scoreName": "e-value",
            "score": "1.3e-15",
            "_uniq": 5,
            "description": "SH3 domain",
            "bitscore": "46.0",
            "end": "72",
            "accession": "PF00018.23",
            "database": "pfam",
            "aliEnd": "72",
            "identifier": "SH3_1",
            "type": "Domain",
            "aliStart": "26",
            "start": "26"
          },
          "aliStart": "26",
          "clan": "CL0010",
          "start": "26"
        }
      ],
      "arch": "233893809080366",
      "title": "Sequence Features",
	  "markups": [],
	  "motifs": []
    }


var example_sequence = {
"length": 3460,
"regions": [
    {
        "modelStart": "1",
        "modelEnd": "195",
        "endStyle": "curved",
        "end": 2699,
        "display": true,
        "startStyle": "curved",
        "color": "#98cc32",
        "aliEnd": 2699,
        "modelLength": 195,
        "text": "BRCA-2_helical",
        "href": "http://pfam.xfam.org/family/PF09169.5",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "3.5e-101",
            "_uniq": 1,
            "description": "BRCA2, helical",
            "bitscore": 325.350524902344,
            "end": "2699",
            "accession": "PF09169.5",
            "database": "pfam",
            "aliEnd": 2699,
            "identifier": "BRCA-2_helical",
            "type": "Domain",
            "aliStart": 2511,
            "start": "2511"
        },
        "aliStart": 2511,
        "clan": null,
        "start": 2511
    },
    {
        "modelStart": "1",
        "modelEnd": "35",
        "endStyle": "curved",
        "end": 1038,
        "display": true,
        "startStyle": "curved",
        "color": "#371e7a",
        "aliEnd": 1038,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "3.0e-15",
            "_uniq": 2,
            "description": "BRCA2 repeat",
            "bitscore": 44.0078163146973,
            "end": "1038",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 1038,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 1004,
            "start": "1004"
        },
        "aliStart": 1004,
        "clan": null,
        "start": 1004
    },
    {
        "modelStart": "1",
        "modelEnd": "35",
        "endStyle": "curved",
        "end": 1253,
        "display": true,
        "startStyle": "curved",
        "color": "#371e7a",
        "aliEnd": 1253,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "2.0e-09",
            "_uniq": 3,
            "description": "BRCA2 repeat",
            "bitscore": 25.367561340332,
            "end": "1253",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 1253,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 1219,
            "start": "1219"
        },
        "aliStart": 1219,
        "clan": null,
        "start": 1219
    },
    {
        "modelStart": "7",
        "modelEnd": "34",
        "endStyle": "jagged",
        "end": 1463,
        "display": true,
        "startStyle": "jagged",
        "color": "#371e7a",
        "aliEnd": 1462,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "3.6e-13",
            "_uniq": 4,
            "description": "BRCA2 repeat",
            "bitscore": 37.3688583374023,
            "end": "1463",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 1462,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 1435,
            "start": "1432"
        },
        "aliStart": 1435,
        "clan": null,
        "start": 1432
    },
    {
        "modelStart": "3",
        "modelEnd": "34",
        "endStyle": "jagged",
        "end": 1566,
        "display": true,
        "startStyle": "jagged",
        "color": "#371e7a",
        "aliEnd": 1565,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "6.5e-15",
            "_uniq": 5,
            "description": "BRCA2 repeat",
            "bitscore": 42.9266929626465,
            "end": "1566",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 1565,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 1534,
            "start": "1532"
        },
        "aliStart": 1534,
        "clan": null,
        "start": 1532
    },
    {
        "modelStart": "1",
        "modelEnd": "34",
        "endStyle": "jagged",
        "end": 1710,
        "display": true,
        "startStyle": "curved",
        "color": "#371e7a",
        "aliEnd": 1710,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "9.4e-18",
            "_uniq": 6,
            "description": "BRCA2 repeat",
            "bitscore": 52.0054969787598,
            "end": "1710",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 1710,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 1677,
            "start": "1677"
        },
        "aliStart": 1677,
        "clan": null,
        "start": 1677
    },
    {
        "modelStart": "3",
        "modelEnd": "35",
        "endStyle": "curved",
        "end": 2043,
        "display": true,
        "startStyle": "jagged",
        "color": "#371e7a",
        "aliEnd": 2043,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "3.5e-16",
            "_uniq": 7,
            "description": "BRCA2 repeat",
            "bitscore": 47.0057029724121,
            "end": "2043",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 2043,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 2011,
            "start": "2010"
        },
        "aliStart": 2011,
        "clan": null,
        "start": 2010
    },
    {
        "modelStart": "2",
        "modelEnd": "34",
        "endStyle": "jagged",
        "end": 2112,
        "display": true,
        "startStyle": "jagged",
        "color": "#371e7a",
        "aliEnd": 2111,
        "modelLength": 35,
        "text": "BRCA2",
        "href": "http://pfam.xfam.org/family/PF00634.13",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "3.7e-16",
            "_uniq": 8,
            "description": "BRCA2 repeat",
            "bitscore": 46.8995971679688,
            "end": "2112",
            "accession": "PF00634.13",
            "database": "pfam",
            "aliEnd": 2111,
            "identifier": "BRCA2",
            "type": "Family",
            "aliStart": 2079,
            "start": "2078"
        },
        "aliStart": 2079,
        "clan": null,
        "start": 2078
    },
    {
        "modelStart": "1",
        "modelEnd": "143",
        "endStyle": "curved",
        "end": 3222,
        "display": true,
        "startStyle": "curved",
        "color": "#32adcc",
        "aliEnd": 3222,
        "modelLength": 143,
        "text": "BRCA-2_OB3",
        "href": "http://pfam.xfam.org/family/PF09104.5",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "9.9e-70",
            "_uniq": 9,
            "description": "BRCA2, oligonucleotide/oligosaccharide-binding, domain 3",
            "bitscore": 221.59977722168,
            "end": "3222",
            "accession": "PF09104.5",
            "database": "pfam",
            "aliEnd": 3222,
            "identifier": "BRCA-2_OB3",
            "type": "Domain",
            "aliStart": 3084,
            "start": "3084"
        },
        "aliStart": 3084,
        "clan": null,
        "start": 3084
    },
    {
        "modelStart": "1",
        "modelEnd": "117",
        "endStyle": "jagged",
        "end": 2832,
        "display": true,
        "startStyle": "curved",
        "color": "#cc8432",
        "aliEnd": 2831,
        "modelLength": 118,
        "text": "BRCA-2_OB1",
        "href": "http://pfam.xfam.org/family/PF09103.5",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "6.4e-45",
            "_uniq": 10,
            "description": "BRCA2, oligonucleotide/oligosaccharide-binding, domain 1",
            "bitscore": 140.40397644043,
            "end": "2832",
            "accession": "PF09103.5",
            "database": "pfam",
            "aliEnd": 2831,
            "identifier": "BRCA-2_OB1",
            "type": "Domain",
            "aliStart": 2702,
            "start": "2702"
        },
        "aliStart": 2702,
        "clan": null,
        "start": 2702
    },
    {
        "modelStart": "1",
        "modelEnd": "42",
        "endStyle": "curved",
        "end": 2904,
        "display": true,
        "startStyle": "curved",
        "color": "#333333",
        "aliEnd": 2904,
        "modelLength": 42,
        "text": "Tower",
        "href": "http://pfam.xfam.org/family/PF09121.5",
        "type": "pfama",
        "metadata": {
            "scoreName": "e-value",
            "score": "1.0e-25",
            "_uniq": 11,
            "description": "Tower",
            "bitscore": 78.1909103393555,
            "end": "2904",
            "accession": "PF09121.5",
            "database": "pfam",
            "aliEnd": 2904,
            "identifier": "Tower",
            "type": "Domain",
            "aliStart": 2863,
            "start": "2863"
        },
        "aliStart": 2863,
        "clan": null,
        "start": 2863
    }
],
"arch": "76218951764462",
"title": "Sequence Features",
"markups": [],
"motifs": []
};


return domain_architectures_view;
};
