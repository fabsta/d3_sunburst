var hmmer_theme_hmmer_dashboard = function() {
  "use strict";

  var hmmer_theme = function (div) {

    //sunburst
    // var hmmer_elem = hmmer_vis.sunburst()
    // var hmmer_cloud = hmmer_vis.word_cloud();
    // var hmmer_histo = hmmer_vis.histogram();
    // var hmmer_tree_legend = hmmer_vis.tree_legend();
    var hmmer_hits_viewer = hmmer_vis.hits_view();
    var hmmer_sunburst = hmmer_vis.sunburst2();
    var hmmer_domain_architectures_view = hmmer_vis.domain_architectures_view();
    // var hmmer_pie_chart = hmmer_vis.pie_chart();
    // var hmmer_data_table = hmmer_vis.data_table();
    // var hmmer_lineage_plot = hmmer_vis.lineage_plot();

    // var hmmer_pdb_viewer = hmmer_vis.pdb_viewer();
    // hmmer_pdb_viewer(document.getElementById("chart"));

    // hmmer_sunburst(document.getElementById("chart"));

    // hmmer_tree_legend(document.getElementById("legend"));
    // hmmer_cloud(div);
    // hmmer_pie_chart(div);
    // hmmer_data_table(document.getElementById("testtable"));
    // hmmer_lineage_plot(document.getElementById("lineage_plot"));

    // start the spinners
    start_spinner();


    var hmmer_top_hits_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/484B2AFA-CBC2-11E4-B744-822AB8F19640/short/";
    var hmmer_domain_tree_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/484B2AFA-CBC2-11E4-B744-822AB8F19640/fail/";
    var hmmer_pfama_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer//annotation/pfama/9B22C480-CBD7-11E4-AADB-FCB7088B62CF";

var uuid = "9B22C480-CBD7-11E4-AADB-FCB7088B62CF";

  // d3.json(hmmer_pfama_url, function(error, data){
  //   // $.get("../../data/pfama.html", function (data) {
  //         document.getElementById('pfama_result').innerHTML = data;
  //
  //         var chart = new PfamGraphic('#domGraph', example_sequence);
  //         var pg = new PfamGraphic('#domGraph', data.sequence);
  //         pg.render();
  //         var new_width = $('#domGraph').parent().width();
  //         pg.resize( new_width );
  //
  //
  //         // $.loadPfamAnnotation(data.uuid);
  //     });
    // hits dashboard

    // d3.json("../../data/stats_brca2.json", function(error, data) {
      // d3.json("../../data/stats_ecoli.json", function(error, data) {
       d3.json("../../data/stats.json", function(error, data) {
        if (error) {
        return console.warn(error);
      }
      else{
        d3.select("#top_hits_spinner").style("visibility", "hidden");
        hmmer_hits_viewer(document.getElementById("hits_viewer"), data);

        // if (typeof data.distTree !== 'undefined'){
        //   console.log("Found distTree entry: ");
        //   hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.distTree), "dist_tree")
        //   d3.select("#taxonomy_view_spinner").style("visibility", "hidden");
        // }
        if (typeof data.fullTree !== 'undefined'){
          console.log("Found fullTree entry: ");
          hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.fullTree), "full_tree")
          d3.select("#taxonomy_view_spinner").style("visibility", "hidden");
        }



        if (typeof data.pdb !== 'undefined'){
          console.log("Found pdb entry: "+data.pdb);
          d3.select("#pdb_spinner").style("visibility", "hidden");
          d3.select("#pdb_div").text("Show pdb structure of "+data.pdb+" here");
        }
        if(typeof data.dom_architectures !== 'undefined'){
          console.log("Found dom_architectures entry: ");
          hmmer_domain_architectures_view(document.getElementById("domain_architectures_view"), data.dom_architectures);
          d3.select("#domain_architecture_spinner").style("visibility", "hidden");
        }
      }
    });


    // d3.json(hmmer_domain_tree_url, function(error, root) {
    // if (error) {
    //   return console.warn(error);
    // }
    // else{
    //   d3.select("#taxonomy_view_spinner").style("visibility", "hidden");
    //   d3.select("#domain_architecture_spinner").style("visibility", "hidden");
    //   // hmmer_hits_viewer(document.getElementById("hits_viewer"));
    // }
    // });

    // domain architectures
    // d3.json("../../data/dist.json", function(error, root) {
    // if (error) return console.warn(error);
    // hmmer_hits_viewer(document.getElementById("hits_viewer"));
    // });

    // pdb viewer
    // d3.json("../../data/dist.json", function(error, root) {
    // if (error) return console.warn(error);
    // hmmer_hits_viewer(document.getElementById("hits_viewer"));
    // });




  };


  function start_spinner(){
    var spinners = ['top_hits_spinner', 'taxonomy_view_spinner', 'domain_architecture_spinner', 'pdb_spinner'];
    for(var spinner_id of spinners){
      d3.select("#"+spinner_id).style("visibility", "visible");
    }
  }

  return hmmer_theme;
};
