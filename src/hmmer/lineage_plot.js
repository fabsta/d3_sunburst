
hmmer_vis.lineage_plot = function() {
  "use strict";
  var chart;
  var svg;
  var curr = {};
  // The cbak returned
  var lineage_plot = function(div) {
    var test_texts = ["all"];

    // svg = d3.select(div).append('svg').selectAll("g").data(test_texts, function(d){return d;});
    // var lineage_paths = svg.enter().append("svg:g").attr("class", "lineage_group")
    // .attr("transform", "translate(10,10)");


    svg = d3.select(div).append('svg').attr("transform", "translate(20,20)");
    curr.lineage_paths = svg.selectAll("path").data(test_texts, function(d){
        console.log("indexing by d= "+d)
      return d;});
    var lineage_paths_enter = curr.lineage_paths.enter();


    lineage_paths_enter.append('path')
    .attr('d', function(e,i){
      return draw_lineage_line(i);
    })
    .attr('stroke', '#000')
    .attr('fill', 'none')
    .attr("transform", "translate(20,20)")
    // .attr({
    //   d: 'M20,0L0,0L0,20,L40,20',
    //   stroke: '#000',
    //   fill:'none'
    // })


    var texts = lineage_paths_enter
    .append("text")
    .attr("x", function(d,i) { return (i+1)*12; })
    .attr("y", function(d,i) { return i*12 + 4; })
    .text( function (d) { return d; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "red")
    .attr("transform", "translate(20,20)");


    // chart =

    return lineage_plot;
  };


  hmmer_vis.dispatch.on('update', function(args){
    //do something here
    console.log("I was told to  "+args.message);
    pie_chart.redraw(args.count);
  })


  lineage_plot.redraw = function(new_data) {

    var new_lineages = svg.selectAll("path").data(new_data);
    var new_texts = svg.selectAll("text").data(new_data);
    new_lineages.transition()
    .duration(750).ease("cubic-in-out")
    .attr('d', function(e,i){
      return draw_lineage_line(i);
    })
    .attr("transform", "translate(20,20)")


    var new_lin = new_lineages.enter().append("path")
    .attr('d', function(e,i){
      console.log("entering appending "+e);
      return draw_lineage_line(i);
    })
    .attr('stroke', '#000')
    .attr('fill', 'none')
    .attr("transform", "translate(20,20)");

    var new_text = new_texts.enter()
    .append("text")
    .attr("x", function(d,i) { return (i+1)*12; })
    .attr("y", function(d,i) { return i*12 + 4; })
    .text( function (d) { return d; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "red")
    .attr("transform", "translate(20,20)");

    new_texts.exit().remove();

    new_lineages.exit(function(d){
      console.log("removing "+d);
    }).remove(function(d){
      console.log("removing "+d);
    });

    return lineage_plot;
  }



  hmmer_vis.dispatch.on('update_lineage_plot', function(args){
    // 	    //do something here
    var arr = [];
    if (typeof args !== 'undefined' && typeof args.sequenceArray !== 'undefined'){
      console.log("found some in update_tree_legend "+args.sequenceArray);
      for (var i = 0; i < args.sequenceArray.length; i++){
        var level = args.sequenceArray[i];
        arr.push(level.short+" ("+level.hit_number+")");
      };
      // var new_object = [{'key': "all", "values":arr}];
      lineage_plot.redraw(arr);
    }
  })

  function draw_lineage_line (i){
    var offset = 10;
    var start = "M"+(i+1)*offset+","+i*offset;
    var start_back = "L"+i*offset+","+i*offset;
    var back_down = "L"+i*offset+","+(i+1)*offset;
    var down_right = "L"+(i+2)*offset+","+(i+1)*offset;

    var full_path = start+""+start_back+""+back_down+""+down_right;
    // var path = "M"+i*1",

    return full_path;

  }


  lineage_plot.start_timer = function(){
    setInterval(function () {
      console.log("updating");
      lineage_plot.redraw(['all','Metazoa','Vertebrates','Homo sapiens', 'Pan troglodytes']);
    }, 1500);
  }

  return lineage_plot;
};
