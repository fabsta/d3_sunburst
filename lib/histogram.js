
    var test_data = stream_layers(3,128,.1).map(function(data, i) {
        return {
            key: 'Stream' + i,
            values: data
        };
    });



    // nv.addGraph({
    //     generate: function() {
    //         // var width = d3.select("#histogram").style("width") ,
    //         //     height = d3.select("#histogram").style("height");

    //         var chart = nv.models.multiBarChart()
    //             // .width(width)
    //             // .height(height)
    //             .showControls(false)
    //             .stacked(true);

    //         chart.dispatch.on('renderEnd', function(){
    //             console.log('Render Complete');
    //         });

    //         var svg = d3.select('#histogram svg').datum(test_data);
    //         console.log('calling chart');
    //         svg.transition().duration(0).call(chart);

    //         return chart;
    //     },
    //     callback: function(graph) {
    //         nv.utils.windowResize(function() {
    //             // var width = 300;
    //             // var height = 200;
    //             graph.width(width).height(height);

    //             d3.select('#histogram svg')
    //                 // .attr('width', width)
    //                 // .attr('height', height)
    //                 .transition().duration(0)
    //                 .call(graph);

    //         });
    //     }
    // });

// function redraw() {
//     new_data = test_data;
//     d3.select('#histogram svg')
//             .datum(new_data)
//             .transition().duration(500)
//             .call(chart);
// }

// setInterval(function () {
//         // var long = data[0].values;
//         // var next = new Date(long[long.length - 1].x);
//         // next.setDate(next.getDate() + 1)
//         // long.shift();
//         // long.push({x:next.getTime(), y:Math.random() * 100});
//          redraw();
//     }, 1500);


/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}
    var data = [{
        "key": "Long",
        "values": getData()
    }];

    var chart;

    nv.addGraph(function () {
        // chart = nv.models.lineChart();
        chart = nv.models.multiBarChart()
                        .showControls(false)
                        .stacked(true)
        // chart.xAxis
        //     .tickFormat(function (d) {
        //         return d3.time.format('%x')(new Date(d))
        //     });

        // chart.yAxis
        //     .tickFormat(d3.format(',.1%'));

        d3.select('#histogram svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });


    function redraw() {
        d3.select('#histogram svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);
    }

    function getData() {
        var arr = [];
        var theDate = new Date(2012, 01, 01, 0, 0, 0, 0);
        for (var x = 0; x < 30; x++) {
            arr.push({x: new Date(theDate.getTime()), y: Math.random() * 100});
            theDate.setDate(theDate.getDate() + 1);
        }
        return arr;


    }

    // setInterval(function () {
    //     var long = data[0].values;
    //     var next = new Date(long[long.length - 1].x);
    //     next.setDate(next.getDate() + 1)
    //     long.shift();
    //     long.push({x:next.getTime(), y:Math.random() * 100});
    //      redraw();
    // }, 1500);



