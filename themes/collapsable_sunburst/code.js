var width = 660,
    height = 600,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var hue = d3.scale.category20();

var luminance = d3.scale.sqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([90, 20]);

var color = d3.scale.category20c();
var model_organisms = {
  "Homos apiens" : 1,
  "Mus musculus" : 1,
  "Gallus gallus" : 1,
  "Drosophila melanogaster" : 1,
}
// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");




var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return d.size; });
    // .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

//Tooltip description
var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0);
// Keep track of the node that is currently being displayed as the root.
var node;

d3.json("../../data/taxon.json", function(error, root) {
  node = root;
  if (error) return console.warn(error);
  initializeBreadcrumbTrail();
  drawLegend();

  svg.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  partition
      .value(function(d) { return d.size; })
      .nodes(root)
      .forEach(function(d) {
        d._children = d.children;
        d.sum = d.value;
        // d.key = key(d);
        d.fill = fill(d);
        d.score = Math.random();
      });

  // Now redefine the value function to use the previously-computed sum.
  partition
      // .children(function(d, depth) { return depth < 2 ? d._children : null; })
      .value(function(d) { return d.sum; });



  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("d", arc)
      .attr("id", function(d){ 
         if (d.name.toLowerCase()==="root") { return "root_node"; }
         if (d.name.toLowerCase()==="metazoa") { return "metazoa_node"; }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .style("fill", function(d) { return d.fill; })
      .style("opacity", function(d){ 
        if(d.parent && d.parent.score){
            if(d.parent.score > 0.5){
              return 1;
            }
            else{
              return 1;
            }
          }
          
           })
      // .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .on("click", click)
      .each(stash);


      


      path.append("path")
      .filter(function(d){ return model_organisms[d.name]; })
      .attr("transform", function(d) { 
        return "translate(" + x(d.x) + "," + y(d.y) + ")"; 
      })
      .attr("d", d3.svg.symbol()
                  .size(200)
                  .type(function(d) { if
                    (d.value >= 9) { return "cross"; } else if
                    (d.value <= 9) { return "diamond";}
                  })
        );

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

  function click(d) {
    node = d;
    var arczoomvalue = arcTweenZoom(d) 
    path.transition()
      .duration(1000)
      .attrTween("d", arcTweenZoom(d));

      d3.select("#view_scores").
              style("visibility", "");
  }

  // make sure this is done after setting the domain
  drawLegend();
  
  d3.select("#container").on("mouseleave", mouseleave);
  totalSize = path.node().__data__.value;
});

d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

function fill(d) {
  var p = d;
  while (p.depth > 1) p = p.parent;
  var c = d3.lab(hue(p.name));
  c.l = luminance(d.sum);
  return c;
}

  d3.select("#metazoa")
           .on("click", function() {
            var metazoa_node = d3.select("#metazoa_node");
            var check = simulateClick(metazoa_node[0][0]);
            mouseover(metazoa_node[0][0]);
  });


  d3.select("#reset")
           .on("click", function() {
            var root_node = d3.select("#root_node");
            var check = simulateClick(root_node[0][0]);
  });

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
              return check = true;
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
      .style("opacity", 0.7);

  // Then highlight only those that are an ancestor of the current segment.
  svg.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);

  tooltip.html(format_description(d));
          return tooltip.transition()
            .duration(50)
            .style("opacity", 0.9);
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

  d3.select("#explanation")
      .style("visibility", "hidden");

  return tooltip.style("opacity", 0);
}

function mousemove (d) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
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
function format_description(d) {
  var description = d.name;
      return  '<b>' + d.name + '</b></br>'+ d.name + '<br> sequences: (' + d.value + ')';
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
