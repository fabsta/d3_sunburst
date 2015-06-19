
hmmer_vis.tree_legend = function() {
  "use strict";
  var chart;
  var conf = {
  image_folder: "../../data/images/",
}
  var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  },
  width = 960 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

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




  var root = {"name": "all","display" : "All","hit_number": 600, "fill": "grey",
  "children" : [
    {"name": "viruses", "display" : "Viruses","hit_number": 300, "fill": "grey"},
    {"name": "archaea","display" : "Archaea","hit_number": 200, "fill": "grey"},
    {"name": "eukaryota","display" : "Eukaryotes","hit_number": 100, "fill": "grey",
    "children" : [
      {"name": "fungi","display" : "Fungi","hit_number": 50, "fill": "grey",
      "children":[
        {"name": "Saccharomyces cerevisiae","display" : "Yeast","hit_number": 30, "fill": "grey"}
      ]},
      {"name": "metazoa","display" : "Animals","hit_number": 30, "fill": "grey",
      "children" : [
        {"name": "Homo sapiens","display" : "Human","hit_number": 2, "fill": "grey"},
        {"name": "Mus musculus","display" : "Mouse","hit_number": 28, "fill": "grey"},
      ]
    },

  ]}
]
};

var i = 0,
duration = 750,
rectW = 70,
rectH = 12, zm;

var tree = d3.layout.tree().nodeSize([70, 40]);
var diagonal = d3.svg.diagonal()
.projection(function (d) {
  return [d.x + rectW / 2, d.y + rectH / 2];
});



// The cbak returned
var tree_legend = function(div) {
  chart = d3.select(div).append("svg").attr("width", 400).attr("height", 120)
  .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", tree.redraw)).append("g")
  .attr("transform", "translate(" + 80 + "," + 0 + ")");

  root.x0 = 0;
  root.y0 = height / 2;
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
  nodes.forEach(function (d) {
    d.y = d.depth * 30;
  });

  // Update the nodes…
  var node = chart.selectAll("g.node")
  .data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + source.x0 + "," + source.y0 + ")";
  })
  // .on("click", click);

  nodeEnter
  .filter(function(d) {return d.children; }).append("rect")
  .attr("width", rectW)
  .attr("height", rectH)
  .attr("rx", 3)
  .attr("ry", 3)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .style("fill", function (d) {
    if(d.fill){
      return d.fill;
    }
    else{
      return d._children ? "lightsteelblue" : "#fff";
    }
  });

  nodeEnter.append("text")
  .attr("x", rectW / 2)
  .attr("y", rectH / 2)
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text(function (d) {
    return d.display+" ("+d.hit_number+")";
  });
  nodeEnter.append("text")
  .attr("x", rectW / 2)
  .attr("y", rectH / 2)
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text(function (d) {
    return d.display+" ("+d.hit_number+")";
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
       return "translate(10,10)";
    })
   .attr("width", 20)
  .attr("height", 20)
  .style("opacity", function(d){
    if(!d.hit_number || d.hit_number < 1){
      return 0.1;
    }
    else{
      return 1;
    }
  });





  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  nodeUpdate.select("rect")
  .attr("width", rectW)
  .attr("height", rectH)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .style("fill", function (d) {
    if(d.fill){
      return d.fill;
    }
    else{
      return d._children ? "lightsteelblue" : "#fff";
    }
  });

  nodeUpdate.select("text")
  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function (d) {
    return "translate(" + source.x + "," + source.y + ")";
  })
  .remove();

  nodeExit.select("rect")
  .attr("width", rectW)
  .attr("height", rectH)
  //.attr("width", bbox.getBBox().width)""
  //.attr("height", bbox.getBBox().height)
  .attr("stroke", "black")
  .attr("stroke-width", 1);

  nodeExit.select("text");

  // Update the links…
  var link = chart.selectAll("path.link")
  .data(links, function (d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("x", rectW / 2)
  .attr("y", rectH / 2)
  .attr("d", function (d) {
    var o = {
      x: source.x0,
      y: source.y0
    };
    return diagonal({
      source: o,
      target: o
    });
  });

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function (d) {
    var o = {
      x: source.x,
      y: source.y
    };
    return diagonal({
      source: o,
      target: o
    });
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
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



return tree_legend;
};
