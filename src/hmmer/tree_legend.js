
hmmer_vis.tree_legend = function() {
  "use strict";
  var chart;
  var global_dict = {},global_count_dict = {};
  
  var conf = {
	  tree_type : 'full',
	  // image_folder: "../../data/images/",
	  image_folder: "http://wwwdev.ebi.ac.uk/Tools/hmmer/static/images/animal_images/",
	  // image_folder: "http://www.ebi.ac.uk/web_guidelines/images/icons/EBI-Species/svg/"
}
  var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  },
  width = 960 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;
  var pie = d3.layout.pie().sort(null);
  var arc = d3.svg.arc().outerRadius(function(d) { console.log(d); return radius; });
	


	var kingdom_colors = {'Bacteria' : '#900',
						  'Eubacteria (bacteria)' : '#900',
						  'Eukaryota' :'#f3c800',
						  'Metazoa' :'#f3c800',
						  'Animals' :'#f3c800',
						  'Fungi' :'#f3c800',
						  'Archaea': '#009dcc',
						   'Virus' : '#ff0000',
					      'Unclassified': '#999',
					      'All': '#FFF',
  						  'oth': '#333'};

  var model_organisms = {
    // "Homo sapiens": conf.image_folder+"Homo-sapiens.svg",
 //    "Mus musculus": conf.image_folder+"Mus-musculus.svg",
 //    "Rattus norvegicus": conf.image_folder+"Rattus_nor.svg",
 //    "Gallus gallus": conf.image_folder+"Gallus-gallus.svg",
 //    "Drosophila melanogaster": conf.image_folder+"Drosophila-melanogaster.svg",
 //    "Dictyostelium discoideum": conf.image_folder+"Dictyostelium-discoideum.svg",
 //    "Danio rerio": conf.image_folder+"Danio-rerio.svg",
 //    "Caenorhabditis elegans": conf.image_folder+"Caenorhabditis-elegans.svg",
 //    "Arabidopsis thaliana": conf.image_folder+"Arabidopsis-thaliana.svg",
 //    "Saccharomyces cerevisiae": conf.image_folder+"Saccharomyces-cerevisiae.svg",
 //    "Schizosaccharomyces pombe": conf.image_folder+"Schizosaccharomyces-pombe.svg",
 //    "Yersinia pestis": conf.image_folder+"Yersinia-pestis.svg",
 // 	"Escherichia coli": conf.image_folder+"Escherichia_coli.svg",
    "Homo sapiens": conf.image_folder+"man.svg",
    "Mus musculus": conf.image_folder+"mouse.svg",
    "Rattus norvegicus": conf.image_folder+"rat.svg",
    "Gallus gallus": conf.image_folder+"chicken.svg",
    "Drosophila melanogaster": conf.image_folder+"fly.svg",
    "Dictyostelium discoideum": conf.image_folder+"fungus.svg",
    "Danio rerio": conf.image_folder+"zebrafish.svg",
    "Caenorhabditis elegans": conf.image_folder+"worm.svg",
    "Arabidopsis thaliana": conf.image_folder+"plant.svg",
    "Saccharomyces cerevisiae": conf.image_folder+"yeast.svg",
    "Schizosaccharomyces pombe": conf.image_folder+"yeast.svg",
    "Yersinia pestis": conf.image_folder+"Escherichia_coli.svg",
    "Escherichia coli": conf.image_folder+"Escherichia_coli.svg",
	  
	  

  };



  // var root = {"name":"all","children":[{"name":"Eukaryota"},{"name":"Yersinia pestis","children":[{"name":"Dictyostelium discoideum"},{"name":"Opisthokonta"},{"name":"Arabidopsis thaliana","children":[{"name":"Bilateria"},{"name":"Ascomycota","children":[{"name":"Saccharomyces cerevisiae"},{"name":"Schizosaccharomyces pombe","children":[{"name":"Euteleostomi"},{"name":"Ecdysozoa","children":[{"name":"Drosophila melanogaster"},{"name":"Caenorhabditis elegans","children":[{"name":"Amniota"},{"name":"Danio rerio","children":[{"name":"Euarchontoglires"},{"name":"Gallus gallus","children":[{"name":"Mus musculus"},{"name":"Homo sapiens"}]}]}]}]}]}]}]}]}]}
var root = {"name": "All","display" : "All",
  "children" : [
     {"name": "Eukaryota","display" : "Eukaryota", "children" :[
			{"name": "Metazoa","display" : "Animals","children" :[
				{"name": "Homo sapiens","display" : "Human"},
				{"name": "Mus musculus","display" : "Mouse"},
				{"name": "Rattus norvegicus","display" : "Rat"},
				{"name": "Gallus gallus","display" : "Chicken"},
				{"name": "Danio rerio","display" : "Zebrafish"},
				{"name": "Caenorhabditis elegans","display" : "Worm"},
				{"name": "Drosophila melanogaster","display" : "Fly"},
			]},
		    {"name": "Fungi","display" : "Fungi","children" :[
		     	{"name": "Schizosaccharomyces pombe","display" : "Fission yeast"},
		     	{"name": "Saccharomyces cerevisiae","display" : "Baker's yeast"},
		    ]},
         	{"name": "Dictyostelium discoideum","display" : "Amoeba"},
     ]},
     {"name": "Bacteria","display" : "Bacteria","children" : [
	     {"name": "Escherichia coli","display" : "Escherichia coli"},
	     {"name": "Yersinia pestis","display" : "Yersinia pestis"}
     ]},
     // {"name": "Other","display" : "Other","children" : [
		 {"name": "Virus","display" : "Virus", 'type':'inner'},
		 {"name": "Archaea","display" : "Archaea", 'type':'inner'},
		 // {"name": "oth","display" : "Other", 'type':'inner'}
     // ]},
     ]
}
 //  var root = {"name": "all","display" : "All","hit_number": 600, "fill": "grey",
//   "children" : [
//     {"name": "bacteria", "display" : "Bacteria","hit_number": 300, "fill": "grey"},
//     {"name": "virus", "display" : "Virus","hit_number": 300, "fill": "grey"},
//     {"name": "archaea","display" : "Archaea","hit_number": 200, "fill": "grey"},
//     {"name": "eukaryota","display" : "Eukaryota","hit_number": 100, "fill": "grey",
//     "children" : [
//
//
//       {"name": "fungi","display" : "Fungi","hit_number": 50, "fill": "grey",
//       "children":[
//         {"name": "Saccharomyces cerevisiae","display" : "Yeast","hit_number": 30, "fill": "grey"}
//       ]},
//       {"name": "viridiplantae","display" : "Viridiplantae","hit_number": 50, "fill": "grey",
//       "children":[
//         {"name": "Arabidopsis thaliana","display" : "Thale cress","hit_number": 30, "fill": "grey"}
//       ]},
//       {"name": "metazoa","display" : "Animals","hit_number": 30, "fill": "grey",
//       "children" : [
//         {"name": "Homo sapiens","display" : "Human","hit_number": 2, "fill": "grey"},
//         {"name": "Mus musculus","display" : "Mouse","hit_number": 28, "fill": "grey"},
// 		{"name": "Caenorhabditis elegans","display" : "Worm","hit_number": 28, "fill": "grey"},
// 		{"name": "Gallus Gallus","display" : "Chicken","hit_number": 28, "fill": "grey"},
//
//
// 		  // Arthropoda
// 	      {"name": "Arthropoda","display" : "Arthropoda","hit_number": 50, "fill": "grey",
// 	      "children":[
// 	        {"name": "Drosophila melanogaster","display" : "Thale cress","hit_number": 30, "fill": "grey"}
// 	      ]},
//
//
//       ]
//     },
//
//   ]}
// ]
// };

var i = 0,
duration = 750,
rectW = 90,
rectH = 18, zm;

var tree = d3.layout.tree().nodeSize([20, 20]);
// var diagonal = d3.svg.diagonal()
// .projection(function (d) {
//   return [d.x + rectW / 2, d.y + rectH / 2];
// });

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });



// The cbak returned
var tree_legend = function(div,data, tree_type) {
	
	var div_width = d3.select(div).style('width').replace("px", "");
	var div_height = 340;
	
	conf.tree_type = tree_type?tree_type : conf.tree_type;
	
  chart = d3.select(div).append("svg").attr("width", div_width).attr("height", div_height)
  // .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", tree.redraw)).append("g")
  .append('g').attr("transform", "translate(" + 150 + "," + (div_height-120) + ")");

  // root.x0 = 0;
//root.y0 = div_height / 2;
  var updated_data = process_dist_tree_json(data);
  process_predefined_tree_json(root)
  update(root);
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


function update(source) {
// Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 60; });

  // Update the nodes…
  var node = chart.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  // .on("click", click);

  nodeEnter.append("circle")
  	  .attr("r", function(d){
  		  return d.hit_number ? 1e-6 : 1
  	  })
  	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });


	// var pie_charts = nodeEnter.selectAll("path")
// 	.data(function(d) {
// 		var test = d.value;
// 		return pie(d.value); });
//
// 	  pie_charts.enter().append("svg:path")
// 	  .attr("d", arc)
//   	.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });



  nodeEnter.append("text")
	  // .attr("x", function(d) { return d.children || d._children ? -13 : 30; })
	  .attr("dy", ".45em")
	  .style("opacity", function(d){
		return (!d.hit_number || d.hit_number < 1)? 0.2 : 1;
	  })
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })

	  .html(function(d) { return d.display+" ("+d.hit_number+")"; })
	  .style("fill-opacity", 1e-6)
	   .attr("transform", function(d) { return d.children || d._children ? "translate(20,-18)" : "translate(30,2)"; });;

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", function(d){
		  if(d.children){
			  return 10;
		  }
		  else{
			  return d.type? 10: 0;
		  }
	  })
	  .style("opacity", function (d) {
	  		return d.hit_number ? 1 : 0.2
	  	})
	  .style("fill", function(d) { 
		  if(d.fill){
		     return d.fill;
		  }
		  else{
			  return d._children ? "lightsteelblue" : "#fff"; 
	  	   }
	   });

	   nodeEnter
	     .filter(function(d) {return !d.children; })
	     .append("svg:image")
	     .attr("xlink:href", function(d){
	       var test = d.name;
	       console.log(model_organisms[d.name]);
	       return model_organisms[d.name];
	     })
	     .attr("transform", function(d) {
	          return "translate(0,-10)";
	       })
	      .attr("width", 20)
	     .attr("height", 20)
	     .style("opacity", function(d){
			 return (!d.hit_number || d.hit_number < 1)? 0.2 : 1;
	     });


  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);



  // Update the links…
  var link = chart.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  })
     .style("opacity", function(d){
		 return (!d.target.hit_number || d.target.hit_number < 1)? 0.4 : 1;
     });
  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });

//
//
//   // Compute the new tree layout.
//   var nodes = tree.nodes(source).reverse(),
//   links = tree.links(nodes);
//
//   // Normalize for fixed-depth.
//   nodes.forEach(function (d) {
//     d.y = d.depth * 25;
//   });
//
//   // Update the nodes…
//   var node = chart.selectAll("g.tree_node")
//   .data(nodes, function (d) {
//     return d.id || (d.id = ++i);
//   });
//
//   // Enter any new nodes at the parent's previous position.
//   var nodeEnter = node.enter().append("g")
//   .attr("class", "tree_node")
//   .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
//   // .attr("transform", function (d) {return "translate(" + source.x0 + "," + source.y0 + ")"; })
//   // .on("click", click);
//
//   nodeEnter
//   .filter(function(d) {return d.children || !d.children; }).append("rect")
//   .attr("width", rectW)
//   .attr("height", rectH)
//   .attr("rx", 3)
//   .attr("ry", 3)
//   .attr("stroke", "black")
//   .attr("stroke-width", 1)
//   .style("opacity", function (d) {
// 		return d.hit_number ? 1 : 0.2
// 	})
//   .style("fill", function (d) {
//     if(d.fill){
//       return d.fill;
//     }
//     else{
//       return d._children ? "lightsteelblue" : "#fff";
//     }
//   });
//
//   // nodeEnter.append("text")
// //   .attr("x", rectW / 2)
// //   .attr("y", rectH / 2)
// //   .attr("dy", ".35em")
// //   .attr("text-anchor", "middle")
// //   .text(function (d) {
// //     return d.display+" ("+d.hit_number+")";
// //   });
//   nodeEnter.append("text")
//   .attr("x", rectW / 2)
//   .attr("y", rectH / 2)
//   // .attr("dy", ".35em")
//   .attr("text-anchor", "middle")
//   .attr("transform", function(d) {
// 	      return !d.children?"translate(0,8)" :"translate(0,4)";
//   })
//   .text(function (d) {
//     return d.display+" ("+d.hit_number+")";
//   });
//
//
//   nodeEnter
//   .filter(function(d) {return !d.children; })
//   .append("svg:image")
//   .attr("xlink:href", function(d){
//     var test = d.name;
//     console.log(model_organisms[d.name]);
//     return model_organisms[d.name];
//   })
//   .attr("transform", function(d) {
//        return "translate(25,18)";
//     })
//    .attr("width", 20)
//   .attr("height", 20)
//   .style("opacity", function(d){
//     if(!d.hit_number || d.hit_number < 1){
//       return 0.2;
//     }
//     else{
//       return 1;
//     }
//   });
//
//
//
//
//
//   // Transition nodes to their new position.
//   var nodeUpdate = node.transition()
//   .duration(duration)
//   .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
//   // .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")";});
//
//   nodeUpdate.select("rect")
//   .attr("width", rectW)
//   .attr("height", rectH)
//   .attr("stroke", "black")
//   .attr("stroke-width", 1)
//   .style("fill", function (d) {
//     if(d.fill){
//       return d.fill;
//     }
//     else{
//       return d._children ? "lightsteelblue" : "#fff";
//     }
//   });
//
//   nodeUpdate.select("text")
//   .style("fill-opacity", 1);
//
//   // Transition exiting nodes to the parent's new position.
//   var nodeExit = node.exit().transition()
//   .duration(duration)
//   .attr("transform", function (d) {
//     return "translate(" + source.x + "," + source.y + ")";
//   })
//   .remove();
//
//   nodeExit.select("rect")
//   .attr("width", rectW)
//   .attr("height", rectH)
//   //.attr("width", bbox.getBBox().width)""
//   //.attr("height", bbox.getBBox().height)
//   .attr("stroke", "black")
//   .attr("stroke-width", 1);
//
//   nodeExit.select("text");
//
//   // Update the links…
//   var link = chart.selectAll("path.link")
//   .data(links, function (d) {
//     return d.target.id;
//   });
//
//   // Enter any new links at the parent's previous position.
//   link.enter().insert("path", "g")
//   .attr("class", "link")
//   .attr("x", rectW / 2)
//   .attr("y", rectH / 2)
//   .attr("d", function (d) {
//     var o = {
//       x: source.x0,
//       y: source.y0
//     };
//     return diagonal({
//       source: o,
//       target: o
//     });
//   });
//
//   // Transition links to their new position.
//   link.transition()
//   .duration(duration)
//   .attr("d", diagonal);
//
//   // Transition exiting nodes to the parent's new position.
//   link.exit().transition()
//   .duration(duration)
//   .attr("d", function (d) {
//     var o = {
//       x: source.x,
//       y: source.y
//     };
//     return diagonal({
//       source: o,
//       target: o
//     });
//   })
//   .remove();
//
//   // Stash the old positions for transition.
//   nodes.forEach(function (d) {
//     d.x0 = d.x;
//     d.y0 = d.y;
//   });
}
hmmer_vis.dispatch.on('update_tree_legend', function(args){
  //do something here
  console.log("I was told to  update the tree_legend with "+args.tree_legend_data);
  // pie_chart.redraw(args.count);
  // change the data
  //
  var tree_legend_data = args.tree_legend_data;


  update_data(root);
  function update_data(d) {
    if(tree_legend_data.hasOwnProperty(d.name)){
      d.hit_number = tree_legend_data[d.name]['hit_number'];
      d.fill = tree_legend_data[d.name]['fill'];
    }
    if(d.children){
      for (var child of d.children){
        update_data(child);
      }
    }
  }


  update(root);
})


function process_dist_tree_json(d) {
		
	if(conf.tree_type == 'full'){
		d.short = d[2];
		d.children = d[0];
		d.hit_number = d[5];
		global_dict[d.short] = d.hit_number ? d.hit_number  :0;
		global_count_dict[d.short] = d.hit_number;
	}
	else{
		global_dict[d.short] = d.count ? d.count[0]  :10;
		global_count_dict[d.short] = d.count;
	}
		if(d.children){
			for (var child of d.children){
				process_dist_tree_json(child);
			}
		}
}

function process_predefined_tree_json(d) {
		
	d.value = global_count_dict.hasOwnProperty(d.name) ? global_count_dict[d.name] : 0;
	d.hit_number = global_dict.hasOwnProperty(d.name) ? global_dict[d.name] : 0;
	d.fill = kingdom_colors.hasOwnProperty(d.name) ? kingdom_colors[d.name] : "grey";
		if(d.children){
			for (var child of d.children){
				process_predefined_tree_json(child);
			}
		}
}


return tree_legend;
};
