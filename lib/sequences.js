// Dimensions of sunburst.
 var width = 400;
 var height = 400;
 var radius = Math.min(width, height) / 2;
// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

var model_organisms = {
  "Homosapiens" : 1,
  "Musmusculus" : 1,
  "Gallusgallus" : 1,
  "Drosophilamelanogaster" : 1,
}
// Mapping of step names to colors.
//var colors = {
  // "home": "#5687d1",
  // "product": "#7b615c",
  // "search": "#de783b",
  // "account": "#6ab975",
  // "other": "#a173d1",
  // "end": "#bbbbbb",
 // "Metazoa": "#5687d1",
 // "Eukaryota": "#7b615c",
 // "Vertebrata": "#de783b",
 
//};
// make `colors` an ordinal scale
var colors = d3.scale.category20c();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .append("g")
    .classed("inner", true);

var partition = d3.layout.partition()
    //.sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
//d3.text("data/visit-sequences.csv", function(text) {
 // d3.text("data/hmmer_6000.csv", function(text) {
 //   var csv = d3.csv.parseRows(text);
 //   var json = buildHierarchy(csv);
 //   createVisualization(json);
 // });

d3.json("data/flare.json", function(text) {
// d3.json("data/taxon.json", function(text) {
  // var csv = d3.csv.parseRows(text);
  // var json = buildHierarchy(csv);
  createVisualization(text);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
        return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });


// var slices = vis.selectAll(".form-container")
//         .data(nodes)
//         .enter()
//         .append("g")
//         .classed('form-container', true);

// slices.append("path")
//         .attr("d", arc)
//         .attr("id",function(d,i){return d.name+""+i;})
//         // .style("fill", function(d) { return colors(d.name);})
//         .style("fill", function(d) { 
//           // color = color((d.children ? d.name : d.parent.name))
//           return colors((d.children ? d.name : d.parent.name)); 
//         })
//         .style("opacity", function(d) {
//           op_value = Math.random() ;
//           return op_value;
//        })
//         //.on("click",animate)        
//         .attr("class","form")
//         .on("click", click)
//         .each(stash)
//         .append("svg:title")
//         .text(function(d) { return Math.round(d[0]*100)/100 +" , "+ Math.round(d[1]*100)/100; });


  
  var path = vis.datum(json).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      // .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { 
        return colors((d.children ? d.name : d.parent.name)); 
      })
      // .style("opacity", 1)
      //.on("click", click)
      // .on("mouseover", mouseover)
      .on("click", click)
      .each(stash);
      // .append("svg:title")
      //   .text(function(d) { return Math.round(d[0]*100)/100 +" , "+ Math.round(d[1]*100)/100; });


      d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
          ? function() { return 1; }
          : function(d) { return d.size; };

        path
          .data(partition.value(value).nodes)
          .transition()
          .duration(1000)
          .attrTween("d", arcTweenData);
      });

      function getAngle(d) {
        var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
        return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
    }

    function click(d) {
    node = d;
    var arczoomvalue = arcTweenZoom(d) 
    path.transition()
      .duration(1000)
      .attrTween("d", arcTweenZoom(d));
  }
    // slices.append("text")
    //     .classed('label', true)
    //     .style("font-size", "10px")
    // .attr("x", function(d) { return d[1]; })
    //     .attr("text-anchor", "middle")
    // .attr("transform", function(d) { 
    //         return "translate(" + arc.centroid(d) + ")" + 
    //                "rotate("    + getAngle(d) +     ")"; })
    // .attr("dx", "6") // margin
    // .attr("dy", ".35em") // vertical-align
    // .text(function(d){
    //   return model_organisms[d.name]? d.name : ""
    //   return d.name
    // })
    //     .attr("pointer-events","none");

  // var innerG = d3.selectAll("g.inner");
  // d3.selectAll("path").on("click", function (d, i) {
  //   var newAngle = - (d.x + d.dx / 2);

  //   innerG
  //     .transition()
  //       .duration(300)
  //       .attr("transform", "rotate(" + (180 / Math.PI * newAngle) + ")");

  //   path
  //     .classed("selected", function (x) { return d.name == x.name; });
    
  // });

  //function click(d) {
  //    path.transition()
  //      .duration(750)
  //      .attrTween("d", arcTween(d));
  //}

  var uniqueNames = (function(a) {
        var output = [];
        a.forEach(function(d) {
            if (output.indexOf(d.name) === -1) {
                output.push(d.name);
            }
        });
        return output;
    })(nodes);
  // set domain of colors scale based on data
  colors.domain(uniqueNames);
  
  // make sure this is done after setting the domain
  drawLegend();
  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  // totalSize = slices.node().__data__.value;
  totalSize = path.node().__data__.value;
 };

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
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




// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage")
      .text(percentageString);

  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
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
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors(d.name); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      // .attr("height", colors.domain().length * (li.h + li.s))
      .attr("height", 80)
      ;

  var g = legend.selectAll("g")
      .data(colors.domain())
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return colors(d); });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
