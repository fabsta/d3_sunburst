

hmmer_vis.word_cloud = function() {
	"use strict";
	var chart;
	var fill = d3.scale.category20();
	var data_words = 		[
		{word:"Tyrosine-protein",weight:20},{word:"Uncharacterized",weight:10},{word:"ABL1",weight:25},
		{word:"non-receptor",weight:15},{word:"kinase",weight:30},{word:"protein",weight:12},{word:"(Fragment)",weight:8},
		{word:"C-abl oncogene 1",weight:18},{word:"isoform B",weight:22},{word:"tyrosine",weight:27}];
    
	// The cbak returned
	var word_cloud = function(div) {
        chart = d3.layout.cloud().size([200, 200])
      .words(data_words.map(function(d) {
        return {text: d.word, size: d.weight};
      }))
      .padding(5)
      // .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();




        return chart;
	};

    
    function draw(words) {
        d3.select("#word_cloud").append("svg")
          .attr("width", 300)
          .attr("height", 300)
        .append("g")
          .attr("transform", "translate(150,150)")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {

            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
	
	
    function drawUpdate(words){
     d3.layout.cloud().size([500, 500])
        .words(words)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .start();


        d3.select("#word_cloud svg")
        .selectAll("g")
          .attr("transform", "translate(150,150)")
        .selectAll("text")
          .data(words).enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })

          .attr("transform", function(d) {

            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });



    }
	
	//setInterval(function () {
	    //     var long = data[0].values;
	    //     var next = new Date(long[long.length - 1].x);
	    //     next.setDate(next.getDate() + 1)
	    //     long.shift();
	    //     long.push({x:next.getTime(), y:Math.random() * 100});
	    //      redraw();
	    // }, 1500);

	return word_cloud;
};
