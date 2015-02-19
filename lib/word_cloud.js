var fill = d3.scale.category20();
  var data_words = [{word:"Hello",weight:20},{word:"World",weight:10},{word:"Normally",weight:25},{word:"You",weight:15},{word:"Want",weight:30},{word:"More",weight:12},{word:"Words",weight:8},{word:"But",weight:18},{word:"Who",weight:22},{word:"Cares",weight:27}];

d3.layout.cloud().size([200, 200])
      .words(data_words.map(function(d) {
        return {text: d.word, size: d.weight};
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

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

  // setInterval(function () { 
  //       var d_new = data_words;
  //       d_new.push({word:randomWord(),weight:randomWeight()});

  //        drawUpdate(d_new.map(function(d) {
  //       return {text: d.word, size: d.weight};
  //     }));
  //     }, 1500);

  function randomWord() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

          for( var i=0; i < 5; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
      }
      function randomWeight(){
        var r = Math.round(Math.random() * 100);
        return r;
      }