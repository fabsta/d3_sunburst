

hmmer_vis.sunburst2 = function() {
	"use strict";
	var svg, nodes, color_index = {}, tree_legend,tooltip, images, i=0;
	var conf = {
		width: 680,
		height: 350,
		tree_type : '',
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
		legend_li : {w: 85, h: 10, s: 3, r: 3},
		image_folder: "../../data/images/",
		total_hit_number: 0,
		node_stats : {},
		tree_legend : {},
	};
	
	
	var kingdom_colors = {'Bacteria' : '#900',
						  // 'Eukaryota' : '#666600', 
						  'Eukaryota' :'#999900',
						  // 'Eukaryota' :'#f3c800',
						  'Archaea': '#009dcc',
						   'Virus' : '#ff0000',
					      'Unclassified': '#999',
							'oth': '#333'
	}
var kingdom_colors_legend = [{'taxon': 'Bacteria','color' : '#900'},
					  // 'Eukaryota' : '#666600', 
					  // {'taxon': 'Eukaryota','color' :'#999900'},
						{'taxon':'Eukaryota','color' :'#f3c800'},
					  {'taxon': 'Archeae','color': '#009dcc'},
					   {'taxon': 'Virus','color' : '#ff0000'},
				      {'taxon': 'Unclassified','color': '#999'},
						{'taxon': 'oth','color': '#333'}
					]


	var count = 0;
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
		'homo sapiens':3,
		'mus musculus':3,
		'Saccharomyces cerevisiae' : 3,
		'viruses' : 1,
		'bacteria' : 1,
		'eukaryota' : 1,
		'archaea' : 1,
		'all' : 0,

		// "Mus musculus": 1,
		// "Gallus gallus": 1,
		// "Drosophila melanogaster": 1
	};

	// keeping a copy of the current data
	var curr = {
		tree : undefined,
		data : undefined,
		nodes : undefined,
		path: undefined,
		partition : undefined
	};
	
	var base = {
		tree : undefined,
		data : undefined,
		nodes : undefined,
		path: undefined,
		partition : undefined
	};

	// The cbak returned
	var sunburst2 = function(div, data, tree_type) {
		svg = d3.select(div).append("svg")
		.attr("width", conf.width)
		.attr("height", conf.height)
		.append("svg:g")
		.attr("id", "container")
		// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.append("g")
		.attr("transform", "translate(" + conf.width / 3 + "," + (conf.height / 2 ) + ")");


		curr.partition = d3.layout.partition()
		.sort(null)
		.value(function(d) {
			return d.hit_number;
		});

		tooltip = d3.select(div)
		.append("div")
		.attr("class", "tooltip")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("opacity", 0);

		// Keep track of the node that is currently being displayed as the root.
		var node;
			curr.data = data;
			sunburst2.data(data);
			// curr.tree_type = "full_tree";
			sunburst2.tree_type(tree_type);
			sunburst2.update();
			// we don't use breadcrumbs anymore, have our own lineage view now
			initializeBreadcrumbTrail();
	};


	sunburst2.update = function(){
		// clean json
		process_json(curr.data);
		// tell the tree to update
		hmmer_vis.dispatch.update_tree_legend({"message": "please update",
		'tree_legend_data' : conf.tree_legend})
		//enter selection
		// curr.nodes = cluster.nodes(curr.data);
		curr.predefined_nodes = curr.partition.nodes(curr.data)
		.filter(function(d) {
			return predefined_views.hasOwnProperty(d.short.toLowerCase())
		});

		var partition = d3.layout.partition()
		.sort(null)
		.value(function(d) {
			return d.count? d.count[0] : d.hit_number;
		});

		var arc = d3.svg.arc()
		.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, conf.x(d.x))); })
		.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, conf.x(d.x + d.dx))); })
		.innerRadius(function(d) { return Math.max(0, conf.y(d.y)); })
		.outerRadius(function(d) { return Math.max(0, conf.y(d.y + d.dy)); });
		var path;
		var color = d3.scale.category20c();




		// d3.json('../../data/dist.json',
		// function (err, json) {
		// curr.tree_type("dist_tree");
		// process_json(json);
		curr.path = svg.selectAll("path")
		.data(partition.nodes(curr.data), function(d){ return d.short});

		curr.enter_selection = curr.path.enter();
		curr.enter_selection.append("path")
		.attr("d", arc)
		.attr("id", function(d){ return "id_"+d.short.replace(' ','');})
		.style("fill", function(d) { 
			if(d.fill){
				// console.log("current is: "+d.fill);
				var new_color = d3.rgb(d.fill).brighter(.2 * d.depth);
				// console.log("new is "+new_color);
				return new_color;
			}
			else{
				if(d.parent){
					var parent_color = d.parent.color;
					var brighter_color = d3.rgb(parent_color).brighter(.2 * d.depth);
					d.fill = brighter_color;
					return brighter_color;
				}
				else{return "white"}
			}
		})
		// .on("click", click)
		.on("click", _magnify)
		
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.each(function(d) {
			this.x0 = d.x;
			this.dx0 = d.dx;
		});


		curr.enter_selection
		.append("text")
		.attr("text-anchor", "middle")
		.text(function(d){return d.depth == 0 ? 'Mouse over' : '';})





		d3.selectAll("input").on("change", function change() {
			console.log("let's show the full tree now");

			var value = this.value;
			var files = ['../../data/ecoli_dist.json','../../data/dist.json'];
			var to_use = count++ %2 == 0? files[0]: files[1];

			d3.json(to_use,
				function (err, resp) {
					curr.data = resp;
					// if(value === "dist_tree")
					sunburst2.tree_type(value);
					curr.tree_type = 'dist_tree';
					process_json(resp,"white");
					// curr.tree_type = 'dist_tree';
					if(value === "full_tree"){
						partition.children(function(d, depth) {
							return depth < 4 ? d._children : null; })
						}
						var partitioned_nodes = partition.nodes(resp);
						var new_path = svg.selectAll("path").data(partition.nodes(resp),function(d){ return d.short});

						// curr.enter_selection.data(partition.nodes(resp),function(d){ return d.short})
						new_path.transition()
						.duration(750).ease("cubic-in-out")
						.attrTween("d", arcTweenUpdate);


						new_path.enter().append("path")
						.attr("d", arc)
						// .each(function(d){  console.log(d)})
						.style("fill", function(d) { return d.fill; })
						.on("click", click)
						.on("mouseover", mouseover)
						.on("mousemove", mousemove)
						.each(function(d) {
							this.x0 = d.x;
							this.dx0 = d.dx;
						});


						new_path.exit().remove();

						hmmer_vis.dispatch.update_tree_legend({"message": "please update",
						'tree_legend_data' : conf.tree_legend})

					});
					hmmer_vis.dispatch.update_tree_legend({"message": "please update",
					'tree_legend_data' : conf.tree_legend})


				});


				var uniqueNames = (function(a) {
					var output = [];
					a.forEach(function(d) {
						if (output.indexOf(d.short) === -1) {
							output.push(d.short);
						}
					});
					return output;
				})(curr.predefined_nodes);

				// d3.select("#no_curr_hits").text(conf.total_hit_number);
//d3.select("#no_curr_hits").style("visibility", "");

				// set domain of colors scale based on data
				// conf.color.domain(uniqueNames);

				// make sure this is done after setting the domain
				drawLegend(kingdom_colors_legend);

			}


			sunburst2.tree_type = function(tree_type){
				if (!arguments.length) {
					return curr.tree_type;
				}
				curr.tree_type = tree_type;
				return sunburst2;
			}

			sunburst2.data = function (d) {
				if (!arguments.length) {
					return base.data;
				}

				// The original data is stored as the base and curr data
				base.data = d;
				curr.data = d;

				// Set up a new tree based on the data
				// var newtree = tnt.tree.node(base.data);

				// tree.root(newtree);

				//Events if data is changed the root is served as response
				//tnt.trigger("tree:data:change", base.data);

				return sunburst2;
			};

			function process_json(d,parent_color) {
				if (typeof d == "object") {
					if(curr.tree_type !== "dist_tree"){
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
						d.long = d.short;
					}
					else{
						d.hit_number = d.count ? d.count[0]  :0;
					}

					d.value = d.hit_number; // important for magnify function
					if(d.short == "All"){
						conf.total_hit_number = d.hit_number;
						conf.totalSize = d.hit_number;
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

					if(parent_color){
						d.fill = parent_color;
					}
					else{
						if(d.hit_number > 0){
							d.fill = fill(d);
							parent_color = d.fill;
						}
						else{
							d.fill = "grey";
							parent_color = d.fill;
						}
						//d.fill = d.hit_number > 0 ? fill(d): "grey";
						color_index[d.short.toLowerCase()] = d.fill;
					}
					// setting data for

					// check if we can extract some numbers
					if(predefined_views.hasOwnProperty(d.short.toLowerCase())){
						// predefined_views[d.short]
						conf.tree_legend[d.short.toLowerCase()] = {};
						conf.tree_legend[d.short.toLowerCase()]['hit_number'] = d.hit_number;
						conf.tree_legend[d.short.toLowerCase()]['fill'] = d.fill;
						conf.node_stats[d.short.toLowerCase()] = d.hit_number;
					}

					if(d.children){
						for (var child of d.children){
							process_json(child, parent_color);
						}
					}
				}
			}

			function _magnify(node) {
				if (parent = node.parent) {
					var parent,
					x = parent.x,
					k = .8;
					parent.children.forEach(function(sibling) {
						x += _reposition(sibling, x, sibling === node
							? parent.dx * k / node.value
							: parent.dx * (1 - k) / (parent.value - node.value));
						});
					} else {
						_reposition(node, 0, node.dx / node.value);
					}


					// Recursively reposition the node at position x with scale k.
					function _reposition(node, x, k) {
						node.x = x;
						if (node.children && (n = node.children.length)) {
							var i = -1, n;
							while (++i < n) x += _reposition(node.children[i], x, k);
						}
						return node.dx = node.value * k;
					}

					sunburst2.update()


			}




				// Interpolate the arcs in data space.
				// Interpolate the scales!
				function arcTween(d) {
					var xd = d3.interpolate(conf.x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(conf.y.domain(), [d.y, 1]),
					yr = d3.interpolate(conf.y.range(), [d.y ? 20 : 0, conf.radius]);
					return function(d, i) {
						return i
						? function(t) { return conf.arc(d); }
						: function(t) { conf.x.domain(xd(t)); conf.y.domain(yd(t)).range(yr(t)); return conf.arc(d); };
					};
				}


				// function arcTween(a) {
				// 	var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
				// 	return function(t) {
				// 		var b = i(t);
				// 		a.x0 = b.x;
				// 		a.dx0 = b.dx;
				// 		return conf.arc(b);
				// 	};
				// }
				function arcTweenUpdate(a) {
					var i = d3.interpolate({x: this.x0, dx: this.dx0}, a);
					return function(t) {
						var b = i(t);
						if(this){
							this.x0 = b.x;
							this.dx0 = b.dx;
						}
						return conf.arc(b);
					};
				}
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


					if(curr.tree_type !== 'dist_tree'){
						hmmer_vis.dispatch.update_histogram({"message": "please update",
						'hits_distribution' : d.hits_distribution,
						'count' : d.count})
					}



					// test to highlight hit
					d3.select("#id_Homosapiens").style('opacity', 0);


					d3.selectAll("#distribution_name").text(d.short);

					//histogram.redraw();
					// wordcloud.redraw();
					// if(d.count){
					// 			  piechart.redraw(d.count);
					// }
					d3.select("#percentage").text(percentageString);
					d3.select("#explanation").style("visibility", "");




					d3.select("#no_curr_hits").text("Current level: "+d.short+" ("+d.hit_number+")");
					d3.select("#no_curr_hits").style("visibility", "");


					var sequenceArray = getAncestors(d);

					hmmer_vis.dispatch.update_lineage_plot({"message": "please update",
					'sequenceArray' : sequenceArray})

					updateBreadcrumbs(sequenceArray, percentageString);

					// Fade all the segments.
					d3.select("#chart").selectAll("path").style("opacity", conf.opacity.full_fadeout);

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
					if(curr.tree_type == 'dist_tree'){
						return d.count.reduce(function(pv, cv) { return pv + cv; }, 0);
					}
					else{
						return d.size;
					}

				}
				function mousemove(d) {
					tooltip
					.style("top", (d3.event.pageY)+"px")
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
					var x = conf.x, y = conf.y, radius = conf.radius, arc = conf.arc;
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
						// var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
						var xd = d3.interpolate(x.domain(), [curr.data.x, curr.data.x + curr.data.dx]);
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
					if(p.parent == 0 || typeof p.parent ==='undefined'){
						if(kingdom_colors.hasOwnProperty(p.long)){
						   	d.color = kingdom_colors[p.long]
							return d.color;
						}
					}
					return '';
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
				sunburst2.node_name = function(node) {
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
					// mouse click
					function click(d) {
						var arczoomvalue = arcTweenZoom(d)
						curr.path.transition()
						.duration(1000)
						.attrTween("d", arcTweenZoom(d));

						d3.select("#view_scores").
						style("visibility", "");

						// console.log("ok, we are searching the table now");
						if(d.children){
							hmmer_vis.dispatch.search_tableRange({'search_term' : d.short});
						}
						else{
							hmmer_vis.dispatch.search_tableSpecies({'search_term' : d.short});
						}

					}

					function drawLegend(kingdom_colors) {

						// Dimensions of legend item: width, height, spacing, radius of rounded rect.
						var li = conf.legend_li;
						// make sure to remove old legend first


						d3.select("#legend").html("<ul class='first'> \
							<li class='bact'><span>Bacteria</span></li>\
							<li class='euk'><span>Eukaryota</span></li>\
							<li class='arc'><span>Archaea</span></li>\
							<li class='vir'><span>Viruses</span></li>\
							<li class='unc'><span>Unclassified sequences</span></li>\
							<li class='oth'><span>Other</span></li>\
						</ul>");

						// d3.select("#legend svg").remove();
						return;
						var no_levels = conf.color.domain().length;
						

						var legend = d3.select("#legend").append("svg:svg")
						.attr("width", li.w * kingdom_colors.length)
						// .attr("height", colors.domain().length * (li.h + li.s))
						.attr("height", li.h);

						var g = legend.selectAll("g")
						.data(kingdom_colors)
						.enter().append("svg:g")
						.attr("transform", function(d, i) {
							return "translate(" + i * li.w + ",0)";
							// return "translate(" + i * (li.h + li.s) + ","+predefined_views[d.toLowerCase()]*55+"";
						});

						g.append("svg:rect")
						.attr("rx", li.r)
						.attr("ry", li.r)
						.attr("width", li.h)
						.attr("height", li.h)
						.style("fill", function(d) {
							var test = d.color;
							var test = d.taxon;
							return d.color;
						});

						g.append("svg:text")
						.attr("x", 40)
						.attr("y", li.h / 2)
						.attr("dy", "0.35em")
						.attr("text-anchor", "middle")
						.text(function(d) {
							var test;
							return d.taxon; 
						});
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
					
					function LightenDarkenColor(col, amt) {
  
					    var usePound = false;
  
					    if (col[0] == "#") {
					        col = col.slice(1);
					        usePound = true;
					    }
 
					    var num = parseInt(col,16);
 
					    var r = (num >> 16) + amt;
 
					    if (r > 255) r = 255;
					    else if  (r < 0) r = 0;
 
					    var b = ((num >> 8) & 0x00FF) + amt;
 
					    if (b > 255) b = 255;
					    else if  (b < 0) b = 0;
 
					    var g = (num & 0x0000FF) + amt;
 
					    if (g > 255) g = 255;
					    else if (g < 0) g = 0;
 
					    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
					}
					

					return sunburst2;
				};
