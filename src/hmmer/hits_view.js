
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
		image_folder: "http://wwwdev.ebi.ac.uk/Tools/hmmer/static/images/animal_images/",

		// global svg settings
		'div_width' : 400
	};
	 // var color = d3.scale.category10();
	 var color = ['#990000','#f9ea6d','#009900','#000099','#aaaaaa'];
	 var add_header, best_pdb_hit;


 	var model_organisms = {
 		"Homo sapiens": conf.image_folder+"Homo-sapiens.svg",
 		"Mus musculus": conf.image_folder+"Mus-musculus.svg",
 		"Gallus gallus": conf.image_folder+"Gallus-gallus.svg",
 		"Drosophila melanogaster": conf.image_folder+"Drosophila-melanogaster.svg",
 		"Dictyostelium discoideum": conf.image_folder+"Dictyostelium-discoideum.svg",
 		"Danio rerio": conf.image_folder+"Danio-rerio.svg",
 		"Caenorhabditis elegans": conf.image_folder+"Caenorhabditis-elegans.svg",
 		"Arabidopsis thaliana": conf.image_folder+"Arabidopsis-thaliana.svg",
 		"Saccharomyces cerevisiae": conf.image_folder+"Saccharomyces-cerevisiae.svg",
 		"Schizosaccharomyces pombe": conf.image_folder+"Schizosaccharomyces-pombe.svg",
 		"Yersinia pestis": conf.image_folder+"Yersinia-pestis.svg",
 	};


	// The cbak returned
	var hits_view = function(div, found_hits,add_header,best_pdb_hit, query_architecture_id) {
		// to plot the colors correctly, we need to add a value to d.domains
		for (var index = 0; index < found_hits.length; ++index) {
			var current_hit = found_hits[index]
			var ndom = current_hit.ndom;
			var hits_colors = {};
			var unique_hit = 0;
			for (var domain_index = 0; domain_index < current_hit.domains.length; ++domain_index) {
				var current_domain = current_hit.domains[domain_index]
				current_domain.count = ndom-1;
				var changed = 0,overlap_detected=0;
				// set the colors
				//ok, if query overlaps with existing one --> no new color
				for (var uh in hits_colors) {
					var curr_from = current_domain.alihmmfrom, dict_to = hits_colors[uh]['to'], curr_to = current_domain.alihmmto, dict_from = hits_colors[uh]['from'];
					// hit overlaps completely
					if(curr_from <= dict_from){
						if(curr_to >= dict_from){
							overlap_detected=1;
						}
					}
					else{
						if(curr_from <= dict_to){
							overlap_detected=1;
						}
					}
				}
				if(overlap_detected){
					current_domain.query_color = color[unique_hit];
				}
				else{
					// add new color for unique hit
					current_domain.query_color = color[unique_hit++];
					var coordinates = {'from':current_domain.alihmmfrom, 'to': current_domain.alihmmto, 'color': current_domain.query_color};
					hits_colors[unique_hit] = coordinates; 				
				}
			}			
		}
		// number of hits
		conf.all_hits = found_hits;
		conf.no_hits = conf.all_hits ? conf.all_hits.length : 1;
		conf.height = conf.no_hits * conf.row_height;

		// determine longest hit
		conf.longest_hit = d3.max(found_hits, function(d,i) { return i>conf.no_hits ? 0:d.hit_pos.target.len; });
		conf.query_length = d3.max(found_hits, function(d,i) { return i>conf.no_hits ? 0:d.hit_pos.query.len; });
		conf.width = conf.longest_hit > conf.query_length ? conf.longest_hit : conf.query_length;

		console.log("longest seq is "+conf.width);
		axisScale = d3.scale.linear().domain([0, conf.width]).range([0, conf.div_width]);
		
		if(add_header){
		var ul = d3.select(div).append("ul").attr("class", "top_hits");

		// put the scale into an empty div
		// add an axis
		var header_li = ul.append("li")
				.append('div').attr('class', 'container-fluid')
				.append('div').attr('class', 'row');
		var left_header_div = header_li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2 ')
		var middle_header_div = header_li.append('div').attr('class', 'col-xs-12 col-md-8 col-lg-8 middle_container')
		var right_header_div = header_li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2')
	
		left_header_div
				.append("span")
				.attr("class", "hit_info").html(function(d){ return "<b>Gene name</b>"; });
		
		right_header_div.append("p").attr('class','score_info').append("span")
				.attr('class', 'hit_legend')
				.html(function(d){return "<b>Evalue</b><br><i>BitScore</i>"});
		
		// AXIS
		middle_header_div.append('svg').attr('height', 25).attr('width',conf.div_width-10)
				.append("g").attr("class","axis").attr("transform","translate(-30,20)")
		.call(d3.svg.axis()
        .scale(axisScale)
        .orient("top"));
		}

		var hits_ul = d3.select(div).append("ul").attr("class", "top_hits");

		var li = hits_ul.selectAll("li")
        .data(conf.all_hits)
        .enter()
        .append("li")
				.append('div').attr('class', 'container-fluid')
				.append('div').attr('class', 'row');
				
// define the three columns
		var left_blocks = li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2 hit_info');

		// left_blocks.append("div")
		// 		.attr("class", "species_info").html(function(d,i){
		// 			return "<b>"+(i+1)+".</b>";
		// 		});
		// add a table here
		var left_table = left_blocks.append('table')
		// tr for: number and accession
		var first_row = left_table.append('tr');
		var second_row = left_table.append('tr');
		//counter
		// tr for: number and accession
		first_row.append('td')
				  .attr("class",function(d){return " "+d.kg; })
		
		var second_colum = first_row.append('td')
		// second_colum.append('span').attr('class','table_hit').html(function(d,i){return "<b>"+(i+1)+"</b>"})
		second_colum.append('text').html(function(d,i){return "<b>"+d.name+"</b>"})
			  	 // .attr('class','class="col-md-2"')
				  // .attr("colspan", "2")
				  .html(function(d,i){
				  					 return "<b>"+d.name+"</b>";
				 // 					 // return "<b>"+(i+1)+". "+d.name+"</b>";
				  })
		//model orga
		second_row.append('td')
			    .append('svg').attr('height', 15).attr('width',15)
				.append("svg:image")
	   			.attr("xlink:href", function(d){
						if(d.species in model_organisms){
								return model_organisms[d.species];
						}
							
				})
						.attr("width", 15)
						.attr("class","sunburst_model_organism")
						.attr("height", 15);
		// .html(function(d){ return d.species; })
		// domain architecture
						// <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
		second_row.append('td')
				  .append('span')
				  .style("font-size","1.5em")
				  // .attr('aria-hidden','true')
				  .attr('class',function(d){
							return d.archindex == query_architecture_id? 'glyphicon glyphicon-ok-circle' : ''
				  })
				  .html(function(d){ return d.hasOwnProperty("is_best_pdb_hit")? " PDB" : ''; })
						// .html(function(d){
			// var return_value = query_architecture_id? "EXACT" : '     ';
			// return_value += d.hasOwnProperty("is_best_pdb_hit")? "PDB" : '     ';
			// return query_architecture_id? "same<br>DomArch" : ''})
		// PDB
		// second_row.append('td').html(function(d){ return d.hasOwnProperty("is_best_pdb_hit")? "PDB<br>hit" : ''; })
		// var left_block_svg = left_blocks.append('div').append('svg')
// 		.attr('height', function(d){
// 			return d.hasOwnProperty("is_best_pdb_hit") ? 15 : 0;
// 		}).attr('width',45).append('g')
// 		// .attr("transform","translate(3,20)")
//
// 		left_block_svg.append("rect")
// 	// y.rangeBand())
// 		.attr("class", "pdb_bar")
// 		.attr("x", 0)
// 		// .attr('y', function(d,i, j){ return (best_pdb_hit)*conf.row_height + conf.hit_offset + 15; })
// 		.attr("width", 45)
// 		.attr("height", 15)
// 		.attr('r', 0)
// 		.attr('ry', 0)
// 		.attr('rx', 0)
// 		.style('fill', 'red')
// 		.style('fill-opacity', 0.4)
//         .attr('stroke', 'black')
//
// 		// append pdb text
// 		left_block_svg.append("text")
// 		.attr("class", "hit_description small")
// 		 .attr('y', 10)
// 		.attr('x',5)
// 		.text("PDB hit");
//
// 		left_blocks.append("span")
// 		.attr("class", "species_info").html(function(d,i){
// 			return "<b>"+(i+1)+".</b>";
// 		});
//
// 		// left_blocks.append("span")
// 		// .attr("class", "hit_count").html(function(d,i){ return "Hit: "+parseInt(i+1); });
// 		left_blocks
// 		.append("div")
// 		.attr("class",function(d){
// 			return "hit_list "+d.kg;
// 		})
// 		.append("span")
// 		.attr("class", "hit_list_kg")
// 		.html(function(d){
// 				// var element<li class='bact'><span>Bacteria</span></li>\
//
// 			// var gene_name = "<span class="++"></span><b>"+d.name+"</b>";
// 			return "<b>"+d.name+"</b>";
// 		});
//

		

		//left_blocks.append("span")
		//.attr("class", "species_info").html(function(d){ 
		//	var full_species = d.species;
			
		//	return "<i>"+(d.species).substring(0,30)+"</i>"; });

// middle
		var middle_div = li.append('div').attr('class', 'col-xs-12 col-md-8 col-lg-8 middle_container')

// right
		 var rigth_blocks_div = li.append('div').attr('class', 'col-xs-4 col-md-2 col-lg-2  score_info')
	// 	// E-value
				rigth_blocks_div
				.append("span")
				.attr("class", "score_info").html(function(d){ return "<b>"+d.evalue+"</b><br>"; });

				rigth_blocks_div.append("span")
				.attr("class", "score_info").html(function(d){ return "<i>"+d.score+"</i>"; });



		// middle svg
		var middle_svg = middle_div.append("div").attr('class','middle_div')
				.append('svg')
				.attr('height', 40).attr('width',conf.div_width-10).append('g').attr("transform", "translate(0,5)");

				
		// the domains
		var query_seq_matches_svg = middle_svg
		.append("g")
		set_colors(query_seq_matches_svg);

		query_seq_matches_svg.append("rect")
		// y.rangeBand())
		.attr("class", "hit_bar")
		.attr("x", 0)
		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
		.attr("width", function(d) { return axisScale(d.hit_pos.query.len); })
		.attr("height", 4.5)
		.attr('r', 0)
		.attr('ry', 0)
		.attr('rx', 0)
		.attr('stroke','none')
		.attr('opacity',1)
		.attr('fill-opacity',1)
		.style("fill", function(d) { return "url(#line_gradient)"; })
		


		// the target seq
		var target_matches_svg = middle_svg
		.append('g').attr('class','');
		set_colors(target_matches_svg);

		var target_area = target_matches_svg.append('g').attr("transform", "translate(0,10)")
		
		target_area.append("rect")
		// y.rangeBand())
		.attr("class", "hit_bar")
		.attr("x", 0)
		.attr("y", 5)
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
//
		// add description
		target_area.append("text")
		.attr("class", "hit_description small")
		// .attr("x", function(d,i) { return axisScale(d.hit_pos.target.len)+2; })
		 .attr('y', 22)
		// function(d,i, j){
		// 	return (i)*conf.row_height + conf.hit_offset+conf.hit_legend_bottom;
		// })
		.text(function(d){return d.desc});


		


		var target_matches = target_matches_svg.append("g").attr("transform", "translate(0,4)").selectAll("g")
		.data(function(d) { return d.domains })
		.enter();



		target_matches.append('path')
	    .attr('d', function(d,i){
	      return draw_domain_hit(d,axisScale);
	    })
	     .attr('opacity', function(d){return d.oasc;})
		.attr('stroke', '#000')
		.attr('stroke-dasharray',"2,2")
	     .attr('fill', 'none')

		// now draw domain matches
		target_matches.append('rect')
		.attr("width", function(d) { return axisScale(d.jenv-d.ienv); })
		.attr("height", 4.5)
		.attr("x",function(d){return axisScale(d.ienv)})
		.attr("y",11)
		.attr('r', 0)
				.attr('ry', 0)
				.attr('rx', 0)
				.attr('stroke','none')
				.attr('opacity',1)
				.attr('fill-opacity',1)
				.style("fill", function(d) {
					// var test= d.count;
					return d.query_color });
					
			target_matches.append('rect')
			.attr("width", function(d) { return axisScale(d.alihmmto-d.alihmmfrom); })
			.attr("height", 4.5)
			.attr("x",function(d){return axisScale(d.alihmmfrom)})
			.attr("y",-4)
			.attr('r', 0)
					.attr('ry', 0)
					.attr('rx', 0)
					.attr('stroke','none')
					.attr('opacity',1)
					.attr('fill-opacity',1)
					.style("fill", function(d) {
						// var test= d.count;
						return d.query_color }); 			
// 		// y.rangeBand())
// 		.attr("class", "hit_match")
// 		.attr("x", function(d){ return  axisScale(d.ienv)})
// 		// .attr('y', function(d,i, j){ return (i)*conf.row_height + conf.hit_offset + 15; })
// 		.attr("width", function(d) { return axisScale(d.jenv-d.ienv); })
// 		.attr("height", 4.5)
// 		.attr('r', 0)
// 		.attr('ry', 0)
// 		.attr('rx', 0)
// 		.attr('stroke','none')
// 		.attr('opacity',1)
// 		.attr('fill-opacity',1)
// 		.style("fill", function(d) {
// 			var test= d.count;
// 			return color[d.count] });
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


function draw_domain_hit (d,axisScale){
  var offset = 5.5;


  // var start = "M"+axisScale(d.alihmmfrom)+",0"
  // var start_end = "L"+axisScale(d.alihmmto)+",0";
  // var down_end = "L"+axisScale(d.jenv)+","+2*offset;
  // var down_start = "L"+axisScale(d.ienv)+","+2*offset;
  // var up_start = "L"+axisScale(d.alihmmfrom)+",0";


  var start = "M"+axisScale(d.alihmmfrom)+",0"
  var start_end = "M"+axisScale(d.alihmmto)+",0";
  var down_end = "L"+axisScale(d.jenv)+","+2*offset;
  var down_start = "M"+axisScale(d.ienv)+","+2*offset;
  var up_start = "L"+axisScale(d.alihmmfrom)+",0";



  var full_path = start+""+start_end+""+down_end+""+down_start+""+up_start;
  // var path = "M"+i*1",

  return full_path;

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
