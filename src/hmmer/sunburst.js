

hmmer_vis.sunburst = function() {
	"use strict";
	var svg, nodes, color_index = {}, histogram, tooltip, piechart, images;
	var conf = {
		width: 680,
		height: 330,
		tree_type : 'dist_tree',
		// radius: Math.min(conf.width, conf.height) / 2,
		x: d3.scale.linear().range([0, 2 * Math.PI]),
		// y: d3.scale.sqrt().range([0, radius]),
		hue: d3.scale.category20c(),
		luminance: d3.scale.sqrt().domain([0, 1e6]).clamp(true).range([90, 20]),
		color: d3.scale.category20c(),
		totalSize: 0,
		// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
		breadcrumb_dim : { w: 75, h: 30, s: 3, t: 10},
		opacity : {full_fadeout: 0.3},
		legend_li : {w: 65, h: 10, s: 3, r: 3},
		image_folder: "../../data/images/",
		total_hit_number: 0,
		node_stats : {}
	};
	conf.radius = Math.min(conf.width, conf.height) / 2;
	conf.y = d3.scale.sqrt().range([0, conf.radius]);
	conf.arc = d3.svg.arc()
			.startAngle(function(d) {
				return Math.max(0, Math.min(2 * Math.PI, conf.x(d.x)));
			})
			.endAngle(function(d) {
				return Math.max(0, Math.min(2 * Math.PI, conf.x(d.x + d.dx)));
			})
			.innerRadius(function(d) {
				return Math.max(0, conf.y(d.y));
			})
			.outerRadius(function(d) {
				return Math.max(0, conf.y(d.y + d.dy));
			});
			
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
	var predefined_views = {
		'root': 1,
		'fungi': 2,
		'metazoa': 2,
		'vertebrata': 2,
		'viruses' : 1,
		'bacteria' : 1,
		'eukaryota' : 1,
		'archaea' : 1,
		'all' : 0,
		
		// "Mus musculus": 1,
		// "Gallus gallus": 1,
		// "Drosophila melanogaster": 1
	};


	// The cbak returned
	var sunburst = function(div, histogram_vis, piechart_vis) {
		histogram = histogram_vis;
		piechart = piechart_vis;
		
		svg = d3.select("#chart").append("svg")
			.attr("width", conf.width)
			.attr("height", conf.height)
			.append("svg:g")
			.attr("id", "container")
		// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		    .append("g")
			.attr("transform", "translate(" + conf.width / 2 + "," + (conf.height / 2 + 10) + ")");
		var partition = d3.layout.partition()
			.sort(null)
			.value(function(d) {
				return d.size;
			});
			
		tooltip = d3.select("#chart")
		    .append("div")
		    .attr("class", "tooltip")
		    .style("position", "absolute")
		    .style("z-index", "10")
		    .style("opacity", 0);
		
		

		// //Tooltip description
// 		var tooltip = d3.select("body")
// 			.append("div")
// 			.attr("id", "tooltip")
// 			.style("position", "absolute")
// 			.style("z-index", "10")
// 			.style("opacity", 0);
		// Keep track of the node that is currently being displayed as the root.
		var node;

		// d3.json("../../data/taxon.json", function(error, root) {
		 // d3.json("../../data/ecoli_dist.json", function(error, root) {
		 // d3.json("../../data/ecoli_full.json", function(error, root) {
		  d3.json("../../data/full.json", function(error, root) {
			node = root;
			if (error) return console.warn(error);
			// if(tree_type == 'full_tree'){
				var total_hit_number = 0;
				conf.tree_type = 'full_tree';
				if(conf.tree_type !== "dist_tree"){
					tag_value(node);
				}
				
				function tag_value(d) {
				    if (typeof d == "object") {
						d.children = d[0];
						d.taxid = d[1];
						d.short = d[2];
						d.left = d[3];
						d.right = d[4];
						d.hit_number = d[5];
						d.parent_node = d[6];
						d.hits_distribution = d[7];
						d.unknown = d[8];
						d.moreCount = d[9];
						d.value = d.hit_number; // important for magnify function
						if(d.short == "All"){
							conf.total_hit_number = d.hit_number;
						}
						d._children = d.children;
						d.sum = d.value;
						// d.key = key(d);
						// d.missing = Math.random()>0.5? 0:1;
						d.found = d.count? d.count[0]  :0;
						if (typeof d.missing === 'undefined') {
							d.missing = {}; 
						}	
						d.missing.complete = d.count? d.count[1] : 0;
						d.missing.incomplete = d.count? d.count[2] : 0;
					
						 d.fill = d.hit_number > 0 ? fill(d): "grey";
						color_index[d.short.toLowerCase()] = d.found > 1 ? d.fill: "grey";
						
						// check if we can extract some numbers
						if(predefined_views.hasOwnProperty(d.short.toLowerCase())){
								// predefined_views[d.short]
							conf.node_stats[d.short.toLowerCase()] = d.hit_number;
						}
						
						if(d.children){
							for (var child of d.children){
								tag_value(child);
							}
						}
				        
				    } else {
				        // Not an object, ignore
				    }
				}
				

			console.log("total of "+total_hit_number+" hits found");
			initializeBreadcrumbTrail();
			// drawLegend();
			// For efficiency, filter nodes to keep only those large enough to see.
	    	nodes = partition.nodes(node)
	        	.filter(function(d) {
					var test = d.short.toLowerCase();
					var test2 = predefined_views.hasOwnProperty(d.short.toLowerCase());
					// if(predefined_views.hasOwnProperty(d.short.toLowerCase()))
					 return predefined_views.hasOwnProperty(d.short.toLowerCase())
					// return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
				});


				svg.append("svg:circle").attr("r", conf.radius).style("opacity", 0);

			partition
				.value(function(d) {
					return 1;
					if(conf.tree_type == 'dist_tree'){
						// return d.size;
						var test = d.count.reduce(function(pv, cv) { return pv + cv; }, 0);
						return d.count.reduce(function(pv, cv) { return pv + cv; }, 0);
					}
					else{
						return d.hit_number;
					}
					// return d.get_node_size;
				})
				.nodes(root)
				// .forEach(function(d) {
// 					d._children = d.children;
// 					d.sum = d.value;
// 					// d.key = key(d);
// 					// d.missing = Math.random()>0.5? 0:1;
// 					d.found = d.count? d.count[0]  :0;
// 					if (typeof d.missing === 'undefined') {
// 						d.missing = {};
// 					}
// 					d.missing.complete = d.count? d.count[1] : 0;
// 					d.missing.incomplete = d.count? d.count[2] : 0;
//
// 					 d.fill = d.found > 0 ? fill(d): "grey";
// 					color_index[d.short.toLowerCase()] = d.found > 1 ? d.fill: "grey";
// 				});

			// // Now redefine the value function to use the previously-computed sum.
 			partition
			 .children(function(d, depth) { return depth < 4 ? d._children : null; })
// 			.value(function(d) {
// 				return d.sum;
// 			});


			var path_all = svg.datum(root).selectAll("path").data(partition.nodes);
			var pathEnter = path_all.enter().append("svg:g").attr("class", "path_group")
			
			// var path_base = svg.datum(root).selectAll("path")
//	.data(partition.nodes).enter()
			var path = pathEnter
				.append("path")
				.attr("d", conf.arc)
				.attr("id", function(d) {
					// if(predefined_views.hasOwnProperty(d.short)){
						var test_node = d.short.toLowerCase().replace(' ','')+"_node";
						return test_node;
					// }
				})
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
				.style("fill", function(d) {
					return d.fill;
				})
				.style("opacity", function(d) {
					if (d.parent && d.parent.score) {
						if (d.parent.score > 0.5) {
							return 1;
						} else {
							return 1;
						}
					}

				})

			// .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
				 .on("click", click)
				// .on("click", magnify)
				.each(stash);
				// .append("text")
// 				  .style("font-size",20)
// 				  .append("textPath")
// 				  .attr("textLength",function(d,i){
// 					  console.log("i is "+i);
// 					  return i;
// 					  return 90-i*5;
// 				  })
// 				  .attr("xlink:href",function(d,i){return "#s"+i;})
// 				  .attr("startOffset",function(d,i){return 3/20;})
// 				  .attr("dy","-1em")
// 				  .text(function(d){return d.short;})

			  // var thing = pathEnter.
  // 						filter(function(d) {
  // 						 					return predefined_views[d.short.toLowerCase()];
  // 						 })
  // 						.append("g")
  // 			    		.attr("id","thing")
  // 			    		.style("fill","navy")
  // 			    		.attr("class", "label");
  //
  // 			  var arcs = pathEnter.append("path")
  // 			   					.attr("fill","red")
  // 			   					.attr("id", function(d,i){return "s"+i;})
  // 			   					.attr("d",conf.arc);
  //
  // 			  thing.append("text")
  // 			    .style("font-size",10)
  // 			    .append("textPath")
  // 			    .attr("textLength",function(d,i){
  // 					return 90;
  // 				})
  // 			    .attr("xlink:href",function(d,i){return "#s"+i;})
  // 			    // .attr("startOffset",function(d,i){return 3/20;})
  // 			    // .attr("dy","-1em")
  // 			    .text(function(d){return d.short;})
				


			// add model organism images
			images = pathEnter.append("svg:image")
				   .attr("xlink:href", function(d){
					   var test = conf.arc.centroid(d);
					   return model_organisms[d.short];
				   })
				   .attr("transform", function(d) { 
								var c = conf.arc.centroid(d);
								// console.log("c0: "+c[0]+" "+c[1]+" "+c[2]+" "+c[3]);
								return "translate(" + c[0]*1.1 +"," + c[1]*1.1 + ")";
								 // rotate ("+c[1]+")";
						})
				    .attr("width", 20)
				   .attr("height", 20)
				   .style("opacity", function(d){
					   if(!d.count || d.count[0] < 1){
						   return 0.1;
					   }
					   else{
						   return 1;
					   }
				   });
						


			// Attach symbols
			//
			// switch tree layout
			d3.selectAll("input").on("change", function change() {
				console.log("let's show the full tree now");	
				
				var value = this.value === "count" ? function() {
						return 1;
					} : function(d) {
						return d.size;
					};

				path
					.data(partition.value(value).nodes)
					.transition()
					.duration(1000)
					.attrTween("d", arcTweenData);
			});
			// mouse click
			function click(d) {
				node = d;
				var arczoomvalue = arcTweenZoom(d)
				path.transition()
					.duration(1000)
					.attrTween("d", arcTweenZoom(d));

				d3.select("#view_scores").
				style("visibility", "");
			}
			
			// Distort the specified node to 80% of its parent.
			function magnify(node) {
			  if (parent = node.parent) {
			    var parent,
			        x = parent.x,
			        k = .8;
			    parent.children.forEach(function(sibling) {
			      x += reposition(sibling, x, sibling === node
			          ? parent.dx * k / node.value
			          : parent.dx * (1 - k) / (parent.value - node.value));
			    });
			  } else {
			    reposition(node, 0, node.dx / node.value);
			  }
			  

			  path.transition()
			      .duration(750)
			      .attrTween("d", arcTween);
				  
				images.transition()
			      .duration(750)  
				  .attr("transform", function(d) { 
							var c = conf.arc.centroid(d);
							// console.log("c0: "+c[0]+" "+c[1]+" "+c[2]+" "+c[3]);
							return "translate(" + c[0]*1.1 +"," + c[1]*1.1 + ")";
						})
			  // broadcast to widget that data should be filtered
						 // if(!node.children){
							 var model_o = ["Homo sapiens",
							 "Mus musculus","Sarcophilus harrisii","Takifugu rubripes"];
							 var species_name = model_o[Math.floor((Math.random() * 3) + 1)];
							 hmmer_vis.dispatch.search_table({'search_term' : species_name});	
						// } "Yersinia pestis": conf.im
			
						
			}
			// Interpolate the arcs in data space.
			function arcTween(a) {
			  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
			  return function(t) {
			    var b = i(t);
			    a.x0 = b.x;
			    a.dx0 = b.dx;
			    return conf.arc(b);
			  };
			}

			// Recursively reposition the node at position x with scale k.
			function reposition(node, x, k) {
			  node.x = x;
			  if (node.children && (n = node.children.length)) {
			    var i = -1, n;
			    while (++i < n) x += reposition(node.children[i], x, k);
			  }
			  return node.dx = node.value * k;
			}
			
			
			d3.select("#reset")
           		.on("click", function() {
					var root_node = d3.select("#root_node");
					var check = simulateClick(root_node[0][0]);
			});
			d3.select("#metazoa")
        		.on("click", function() {
					var metazoa_node = d3.select("#metazoa_node");
					var check = simulateClick(metazoa_node[0][0]);
			});
			d3.select("#fungi")
    			.on("click", function() {
					var metazoa_node = d3.select("#fungi_node");
					var check = simulateClick(metazoa_node[0][0]);
			});
			d3.select("#viruses")
    			.on("click", function() {
					var metazoa_node = d3.select("#viruses_node");
					var check = simulateClick(metazoa_node[0][0]);
			});
			d3.select("#eubacteria")
				.on("click", function() {
					var metazoa_node = d3.select("#eubacteria_node");
					var check = simulateClick(metazoa_node[0][0]);
				});
			d3.select("#show_model_orga")
				.on("click", function() {
					d3.selectAll(".model_orga_pin")
					.style("visibility", "");
				});
						
						
			// for (var tax_level of ["root",'Metazoa','Mammalia']){
// 				console.log("checking "+tax_level);
// 				d3.select("#"+tax_level)
//             		.on("click", function() {
// 					var level_node = d3.select("#"+tax_level+"_node");
// 					var elem = level_node[0][0];
// 					if(elem){
// 						var check = simulateClick(level_node[0][0]);
// 					}
//
// 				});
// 			}
			// make sure this is done after setting the domain
			// drawLegend();

		    var uniqueNames = (function(a) {
		          var output = [];
		          a.forEach(function(d) {
		              if (output.indexOf(d.short) === -1) {
		                  output.push(d.short);
		              }
		          });
		          return output;
		      })(nodes);
		    // set domain of colors scale based on data
		    conf.color.domain(uniqueNames);
  
		    // make sure this is done after setting the domain
		    drawLegend();

			d3.select("#container").on("mouseleave", mouseleave);
			conf.totalSize = path.node().__data__.value;
		});
	};


	function getAngle(d) {
			var arc = conf.arc;
	        var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
	        return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
	}
		
	function mouseover(d) {

		var percentage = (100 * d.value / conf.totalSize).toPrecision(3);
		var percentageString = percentage + "%";
		if (percentage < 0.1) {
			percentageString = "< 0.1%";
		}
		// tell the histogram to update
		// namespace.dispatch.histogram_update({"message": "please update",
// 										'count' : d.count})
//
		// hmmer_vis.dispatch.update({"message": "please update",
	// 	'hits_distribution' : d.hits_distribution,
	// 									'count' : d.count})
		hmmer_vis.dispatch.update_histogram({"message": "please update", 
		'hits_distribution' : d.hits_distribution,
										'count' : d.count})	
		
		
		
		  //histogram.redraw();
		// wordcloud.redraw();
		 // if(d.count){
		 // 			  piechart.redraw(d.count);
		 // }
		d3.select("#percentage").text(percentageString);
		d3.select("#explanation").style("visibility", "");
			
		d3.select("#no_curr_hits").text("Number of hits: "+d.hit_number+" ("+conf.total_hit_number+")");
		d3.select("#no_curr_hits").style("visibility", "");
		

		var sequenceArray = getAncestors(d);
		updateBreadcrumbs(sequenceArray, percentageString);

		// Fade all the segments.
		d3.selectAll("path")
			.style("opacity", conf.opacity.full_fadeout);

		// Then highlight only those that are an ancestor of the current segment.
		svg.selectAll("path")
			.filter(function(node) {
				return (sequenceArray.indexOf(node) >= 0);
			})
			.style("opacity", 1);

		tooltip.html(function() {
                var name = format_name(d);
                return name;
         });
         tooltip.transition()
              .duration(50)
              .style("opacity", 0.9);
		

		// tooltip.html(format_description(d));
// 		return tooltip.transition()
// 			.duration(50)
// 			.style("opacity", 0.9);
	}

	function get_node_size(d){
		if(conf.tree_type == 'dist_tree'){
			return d.count.reduce(function(pv, cv) { return pv + cv; }, 0);
		}
		else{
			return d.size;
		}
		
	}

 	function mousemove(d) {
		 tooltip
           .style("top", (d3.event.pageY-200)+"px")
           .style("left", (d3.event.pageX)+"px");
	}
	// Restore everything to full opacity when moving off the visualization.

	function mouseleave(d) {

		// Hide the breadcrumb trail
		d3.select("#trail").style("visibility", "hidden");

		// Deactivate all segments during transition.
		d3.selectAll("path").on("mouseover", null);

		// Transition each segment to full opacity and then reactivate it.
		d3.selectAll("path")
			.transition()
			.duration(500)
			.style("opacity", 1)
			.each("end", function() {
				d3.select(this).on("mouseover", mouseover);
			});

		d3.select("#explanation").style("visibility", "hidden");
		d3.select("#no_curr_hits").style("visibility", "hidden");
		
	   $('#testtable').DataTable()
	    .search( '' )
	    .columns().search( '' )
	    .draw();
		
		tooltip.style("opacity", 0);
		// return tooltip.style("opacity", 0);
	}

	// When zooming: interpolate the scales.
	function arcTweenZoom(d) {
	  var x = conf.x,y = conf.y, radius = conf.radius, arc = conf.arc,
		  xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	      yd = d3.interpolate(y.domain(), [d.y, 1]),
			yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
	  return function(d, i) {
	    return i
	        ? function(t) { return arc(d); }
	        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
	  };
	}
	// When switching data: interpolate the arcs in data space.
	function arcTweenData(a, i) {
		var x = conf.x,y = conf.y, radius = conf.radius, arc = conf.arc;
	  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  function tween(t) {
	    var b = oi(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  }
	  if (i == 0) {
	   // If we are on the first arc, adjust the x domain to match the root node
	   // at the current zoom level. (We only need to do this once.)
	    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
	    return function(t) {
	      x.domain(xd(t));
	      return tween(t);
	    };
	  } else {
	    return tween;
	  }
	}
	// Setup for switching data: stash the old values for transition.

	function stash(d) {
		d.x0 = d.x;
		d.dx0 = d.dx;
	}

	function fill(d) {
		var p = d;
		while (p.depth > 1) p = p.parent;
		var c = d3.lab(conf.hue(p.short));
		c.l = conf.luminance(d.hit_number);
		return c;
	}

// 		return tooltip
// 			.style("top", (d3.event.pageY - 10) + "px")
// 			.style("left", (d3.event.pageX + 10) + "px");
// 	}

	// Given a node in a partition layout, return an array of all of its ancestor
	// nodes, highest first, but excluding the root.


	sunburst.node_name = function(node) {
		return node.property('name');
    };

	function getAncestors(node) {
		var path = [];
		var current = node;
		while (current.parent) {
			path.unshift(current);
			current = current.parent;
		}
		return path;
	}

	function initializeBreadcrumbTrail() {
	  // Add the svg area.
	  var trail = d3.select("#sequence").append("svg:svg")
	      .attr("width", conf.width)
	      .attr("height", 50)
	      .attr("id", "trail");
	  // Add the label at the end, for the percentage.
	  trail.append("svg:text")
	    .attr("id", "endlabel")
	    .style("fill", "#000");
	}

	function simulateClick(elem /* Must be the element, not d3 selection */) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(
            "click", /* type */
            true, /* canBubble */
            true, /* cancelable */
            window, /* view */
            0, /* detail */
            0, /* screenX */
            0, /* screenY */
            0, /* clientX */
            0, /* clientY */
            false, /* ctrlKey */
            false, /* altKey */
            false, /* shiftKey */
            false, /* metaKey */
            0, /* button */
            null); /* relatedTarget */
        	elem.dispatchEvent(evt);
        // return check = true;
	}

	function format_name(d) {
	    var name = d.short;
	        return  '<b>' + name + '</b><br> (' + d.hit_number + ')';
	}

	function drawLegend() {

	    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
	    var li = conf.legend_li;

	    var legend = d3.select("#legend").append("svg:svg")
	        .attr("width", li.w * 3)
	        // .attr("height", colors.domain().length * (li.h + li.s))
	        .attr("height", 100)
	        ;

	    var g = legend.selectAll("g")
	        .data(conf.color.domain())
	        .enter().append("svg:g")
	        .attr("transform", function(d, i) {
	                return "translate("+predefined_views[d.toLowerCase()]*55+"," + i * (li.h + li.s) + ")";
	             });

	    g.append("svg:rect")
	        .attr("rx", li.r)
	        .attr("ry", li.r)
	        .attr("width", li.w)
	        .attr("height", li.h)
	        .style("fill", function(d) { 
				var test3 = d.fill;
				return color_index[d.toLowerCase()]; });

	    g.append("svg:text")
	        .attr("x", li.w / 2)
	        .attr("y", li.h / 2)
	        .attr("dy", "0.35em")
	        .attr("text-anchor", "middle")
	        .text(function(d) { 
				var test;
				return d+" ("+conf.node_stats[d.toLowerCase()]+")"; });
	}

	function toggleLegend() {
	    var legend = d3.select("#legend");
	    if (legend.style("visibility") == "hidden") {
	      legend.style("visibility", "");
	    } else {
	      legend.style("visibility", "hidden");
	    }
	  }

	// Generate a string that describes the points of a breadcrumb polygon.
	function breadcrumbPoints(d, i) {
	  var points = [];
	  points.push("0,0");
	  points.push(conf.breadcrumb_dim.w + ",0");
	  points.push(conf.breadcrumb_dim.w + conf.breadcrumb_dim.t + "," + (conf.breadcrumb_dim.h / 2));
	  points.push(conf.breadcrumb_dim.w + "," + conf.breadcrumb_dim.h);
	  points.push("0," + conf.breadcrumb_dim.h);
	  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
	    points.push(conf.breadcrumb_dim.t + "," + (conf.breadcrumb_dim.h / 2));
	  }
	  return points.join(" ");
	}

	// Update the breadcrumb trail to show the current sequence and percentage.
	function updateBreadcrumbs(nodeArray, percentageString) {

	  // Data join; key function combines name and depth (= position in sequence).
	  var g = d3.select("#trail")
	      .selectAll("g")
	      .data(nodeArray, function(d) { return d.short + d.depth; });

	  // Add breadcrumb and label for entering nodes.
	  var entering = g.enter().append("svg:g");

	  entering.append("svg:polygon")
	      .attr("points", breadcrumbPoints)
	      .style("fill", function(d) { return d.fill; });

	  entering.append("svg:text")
	      .attr("x", (conf.breadcrumb_dim.w + conf.breadcrumb_dim.t) / 2)
	      .attr("y", conf.breadcrumb_dim.h / 2)
	      .attr("dy", "0.35em")
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.short; });

	  // Set position for entering and updating nodes.
	  g.attr("transform", function(d, i) {
	    return "translate(" + i * (conf.breadcrumb_dim.w + conf.breadcrumb_dim.s) + ", 0)";
	  });

	  // Remove exiting nodes.
	  g.exit().remove();

	  // Now move and update the percentage at the end.
	  d3.select("#trail").select("#endlabel")
	      .attr("x", (nodeArray.length + 0.5) * (conf.breadcrumb_dim.w + conf.breadcrumb_dim.s))
	      .attr("y", conf.breadcrumb_dim.h / 2)
	      .attr("dy", "0.35em")
	      .attr("text-anchor", "middle")
	      .text(percentageString);

	  // Make the breadcrumb trail visible, if it's hidden.
	  d3.select("#trail")
	      .style("visibility", "");

	}

	return sunburst;
};
