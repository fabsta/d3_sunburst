
hmmer_vis.hits_view = function() {
	"use strict";

	// this widget can display both hmmer hits
	// as well as domain architecture hits

	var chart, svg, axisScale, xAxis,yAxis,xAxisGroup,yAxisGroup;
	var margin = {top: 0, right: 20, bottom: 10, left: 85},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	var y = d3.scale.ordinal().rangeRoundBands([0, height], .3);
	var x = d3.scale.linear().rangeRound([0, width]);
	var conf = {
		'no_hits' : 10,
		'row_height' : 35,
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
		'div_width' : 400
	};
	var color = d3.scale.category20c();



	// The cbak returned
	var hits_view = function(div, data) {

		// number of hits
		conf.all_hits = data.found_hits;
		conf.no_hits = conf.all_hits ? conf.all_hits.length : 1;
		conf.height = conf.no_hits * conf.row_height;

		// determine longest hit
		conf.longest_hit = d3.max(data.found_hits, function(d) { return d.hit_pos.target.len; });
		conf.query_length = d3.max(data.found_hits, function(d) { return d.hit_pos.query.len; });
		conf.width = conf.longest_hit > conf.query_length ? conf.longest_hit : conf.query_length;

		console.log("longest seq is "+conf.width);

		axisScale = d3.scale.linear()
		.domain([0, conf.width])
		.range([0, conf.div_width]);


		var ul = d3.select(div).append("ul").attr("class", "top_hits");

		var li = ul.selectAll("li")
        .data(conf.all_hits)
        .enter()
        .append("li")
				.append('div').attr('class', 'container-fluid')
				.append('div').attr('class', 'row');


// define the three columns
		var left_blocks = li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2 hit_info');

		// left_blocks.append("span")
		// .attr("class", "hit_count").html(function(d,i){ return "Hit: "+parseInt(i+1); });

		left_blocks
		.append("span")
		.attr("class", "gene_name").html(function(d){ return "<b>"+d.name+"</b>"; });

		left_blocks.append("span")
		.attr("class", "species_info").html(function(d){ return "<i>"+d.species+"</i>"; });

// middle
		var middle_div = li.append('div').attr('class', 'col-xs-12 col-md-8 col-lg-8 middle_container')

// right
		var rigth_blocks = li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2')
				.append("p").attr('class','right').append("span")
				.attr('class', 'hit_legend')
				.html(function(d){return d.evalue;});



		// the domains
		var query_seq_matches_svg = middle_div.append("div").attr('class','query_div')
		.append('svg')
		.attr('height', 20)
		// .attr('width', )
		.append("g")
		set_colors(query_seq_matches_svg);

		query_seq_matches_svg.append("rect")
		// y.rangeBand())
		.attr("class", "hit_bar")
		.attr("x", 0)
		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
		.attr("width", function(d) { return axisScale(d.hit_pos.target.len); })
		.attr("height", 4.5)
		.attr('r', 0)
		.attr('ry', 0)
		.attr('rx', 0)
		.attr('stroke','none')
		.attr('opacity',1)
		.attr('fill-opacity',1)
		.style("fill", function(d) { return "url(#line_gradient1)"; })


		// add length
		query_seq_matches_svg.append("text")
		.attr("class", "hit_legend")
		.attr("x", function(d,i) { return axisScale(d.hit_pos.target.len)+2; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;
		// })
		.text(function(d){return d.hit_pos.target.len});


		// bind the domains
		var query_seq_matches = query_seq_matches_svg.selectAll("g")
		.data(function(d) { return d.hit_pos.query.hits; })
		.enter();
		// // plot the hits
		query_seq_matches.append("rect")
		.attr("height", conf.hit_height)
		// y.rangeBand())
		.attr('ry', 2)
		.attr('rx', 2)
		.attr("x", function(d) { return axisScale(d.from) })
		// .attr('y', function(d,i, j){ return (j)*conf.row_height + conf.hit_offset })
		.attr("width", function(d) { return axisScale(d.to - d.from)  })
		.style("fill", function(d) { return color(d.count) });





		// the target seq
		var target_matches_svg = middle_div.append("div").attr('class','target_div')
		.append('svg')
		.attr('height', 20)
		.attr('width', '100%')
		.attr("transform", "translate(10,10)")
		.append('g')
		set_colors(target_matches_svg);

		target_matches_svg.append("rect")
		// y.rangeBand())
		.attr("class", "hit_bar")
		.attr("x", 0)
		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
		.attr("width", function(d) { return axisScale(d.hit_pos.target.len); })
		.attr("height", 4.5)
		.attr('r', 0)
		.attr('ry', 0)
		.attr('rx', 0)
		.attr('stroke','none')
		.attr('opacity',1)
		.attr('fill-opacity',1)
		.style("fill", function(d) { return "url(#line_gradient)"; })

		// add description
		target_matches_svg.append("text")
		.attr("class", "hit_description small")
		// .attr("x", function(d,i) { return axisScale(d.hit_pos.target.len)+2; })
		 .attr('y', 20)
		// function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;
		// })
		.text(function(d){return d.desc});



		var target_matches = target_matches_svg.selectAll("g")
		.data(function(d) { return d.domains })
		.enter();


		target_matches.append("rect")
		// y.rangeBand())
		.attr("class", "hit_match")
		.attr("x", function(d){ return  axisScale(d.ienv)})
		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
		.attr("width", function(d) { return axisScale(d.jenv-d.ienv); })
		.attr("height", 4.5)
		.attr('r', 0)
		.attr('ry', 0)
		.attr('rx', 0)
		.attr('stroke','none')
		.attr('opacity',1)
		.attr('fill-opacity',1)
		.style("fill", function(d) { return "url(#domain_gradient)"; })

		// target_matches.append('path')
		// .attr('d', function(d,i){ return draw_domain(axisScale(d.jenv-d.ienv), 20) })
		// .attr('stroke', '#000')
		// .attr('fill', 'rgba(0,0,0,0)')
		// .attr('stroke-dasharray', '5,5')
		// .attr("transform", function(d,i,j){
		// 	var x_coord = axisScale(d.ienv);
		// 	var y_coord = 0;
		// 	// x_coord = 20;
		// 	return "translate("+x_coord+","+y_coord+")"	;
		// })





		//  target_matches.append('path')
		// .attr('d', function(d,i){
		// 	// var line_path = "L0,0"+
		// 	return draw_domain(axisScale(d.jenv-d.ienv), 15);
		// })
		// .attr('stroke', '#000')
		// .attr('fill', 'rgba(0,0,0,0)')
		// .attr('stroke-dasharray', '5,5')
		// .attr('fill', function(d){
		// 	return "url(#domain_gradient)"
		// })
		// .attr("transform", function(d,i,j){
		// 	var x_coord = axisScale(d.ienv);
		// 	var y_coord = (j)*conf.row_height + conf.hit_offset + 10;
		// 	// x_coord = 20;
		// 	return "translate("+x_coord+","+y_coord+")"	;
		// })



		// var hits = hits.selectAll(".single_hit")
		// .data(conf.all_hits, keyFunction)
		// .enter().append("li")
		// .attr("class", "hit_container")
		//
		//
		// var target_matches = hits.selectAll("rect")
		// .data(function(d) { return d.domains; })
		// .enter();
		//
		// var query_seq_matches = hits.selectAll("rect")
		// .data(function(d) { return d.hit_pos.query.hits; })
		// .enter();
		//
		//
		// //evalue
		// hits.append("rect")
		// .attr("height", function(d){ return conf.row_height;})
		// .attr("width", function(d) { return conf.div_width+170; })
		// .style("opacity", function(d,i,j){ return 0.5;})
		// .style("fill", function(d,i,j){ return i%2==0 ? "#e6e6e6":"#FFFFFF";})
		// .attr("x", function(d,i) { return -100 })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset +conf.hit_legend_top - 13;
		// })
		//
		//
		//
		// hits.append("rect")
		// // y.rangeBand())
		// .attr("class", "hit_bar")
		// .attr("x", 0)
		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
		// .attr("width", function(d) { return axisScale(d.hit_pos.target.len); })
		// .attr("height", 4.5)
		// .attr('r', 0)
		// .attr('ry', 0)
		// .attr('rx', 0)
		// .attr('stroke','none')
		// .attr('opacity',1)
		// .attr('fill-opacity',1)
		// .style("fill", function(d) { return "url(#line_gradient)"; })
		//
		//
		//
		// //QUERY
		// // hits.append("text")
		// // .attr("class", "hit_legend")
		// // .attr("x", function(d,i) {return -30;})
		// // .attr('y', function(d,i, j){return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;})
		// // .text("Query");
		//
		//
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
		// // .text(function(d,i){return "Hit: "+parseInt(i+1);});
		// .text(function(d,i){return parseInt(i+1);});
		//
		//
		//
		// // seq length target
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return axisScale(d.hit_pos.target.len)+2; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;
		// })
		// .text(function(d){return d.hit_pos.target.len});
		// // query seq length
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return axisScale(d.hit_pos.query.len)+2; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
		// })
		// .text(function(d){return d.hit_pos.query.len});
		//
		//
		// //evalue
		// hits.append("text")
		// .attr("class", "hit_legend")
		// .attr("x", function(d,i) { return axisScale(conf.longest_hit)+conf.hit_legend_bottom; })
		// .attr('y', function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_top;
		// })
		// .text(function(d){return d.evalue});
		//
		//
		//
		//
		//
		//
		//
		// // plot the hits
		// query_seq_matches.append("rect")
		// .attr("height", conf.hit_height)
		// // y.rangeBand())
		// .attr('ry', 2)
		// .attr('rx', 2)
		// .attr("x", function(d) { return axisScale(d.from) })
		// .attr('y', function(d,i, j){ return (j)*conf.row_height + conf.hit_offset })
		// .attr("width", function(d) { return axisScale(d.to - d.from)  })
		// .style("fill", function(d) { return color(d.count) });
		//
		//
		//
		//
		// target_matches.append('path')
		// .attr('d', function(d,i){ return draw_domain(axisScale(d.jenv-d.ienv), 10) })
		// .attr('stroke', '#000')
		// .attr('fill', 'rgba(0,0,0,0)')
		// .attr('stroke-dasharray', '5,5')
		// .attr("transform", function(d,i,j){
		// 	var x_coord = axisScale(d.ienv);
		// 	var y_coord = (j)*conf.row_height + conf.hit_offset + 10;
		// 	// x_coord = 20;
		// 	return "translate("+x_coord+","+y_coord+")"	;
		// })



		// target_matches.append('path')
		// .attr('d', function(d,i){
		// 	var line_path = "L0,0"+
		// 	return draw_domain(axisScale(d.jenv-d.ienv), 15);
		// })
		// .attr('stroke', '#000')
		// .attr('fill', 'rgba(0,0,0,0)')
		// .attr('stroke-dasharray', '5,5')
		// // .attr('fill', function(d){
		// // 	return "url(#domain_gradient)"
		// // })
		// .attr("transform", function(d,i,j){
		// 	var x_coord = axisScale(d.ienv);
		// 	var y_coord = (j)*conf.row_height + conf.hit_offset + 10;
		// 	// x_coord = 20;
		// 	return "translate("+x_coord+","+y_coord+")"	;
		// })


		// // plot the hits pfam domains
		// target_matches.append("rect")
		// .attr("height", conf.hit_height)
		// // y.rangeBand())
		// .attr('ry', 2)
		// .attr('rx', 2)
		// .attr("x", function(d) {
		// 	var x_coord = Math.floor((conf.longest_hit - d.len) / 2)
		// 	return axisScale(x_coord + d.from); })
		// 	.attr('y', function(d,i, j){
		// 		var res = (j)*conf.row_height + conf.hit_offset;
		// 		console.log("hit "+j+": "+(j+1)*conf.row_height+" offset: "+conf.hit_offset+" total: "+res);
		// 		return (j)*conf.row_height + conf.hit_offset + 14; })
		// 		.attr("width", function(d) { return axisScale(d.to - d.from); })
		// 		.style("fill", function(d) { return color(d.count);
		// 		});



		// plot domains for query sequence
		// plot query sequence seperatetly

		// bars.append("text")
		// .attr("x", function(d) { return -20; })
		// .attr("y", function(d, i, j){ return (j+1)*20})
		// .attr("dy", "0.5em")
		// .attr("dx", "0.5em")
		// .style("font" ,"10px sans-serif")
		// .style("text-anchor", "begin")
		// .text(function(d, i, j) { return "Hit "+j });
		d3.selectAll(".axis path")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges")

		d3.selectAll(".axis line")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges")


		return hits_view;
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


	hits_view.redraw = function(new_data) {
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
	return d.name;
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
	var start = "M0,0";
	var line_to_end = "L"+length+",0";
	var end_down = "L"+length+","+height;
	var line_to_start = "L0,"+height;
	var start_up = "L0,0";


	var full_path = start+""+line_to_end+""+end_down+""+line_to_start+""+start_up;
	// var path = "M"+i*1",

	return full_path;

}

return hits_view;
};
