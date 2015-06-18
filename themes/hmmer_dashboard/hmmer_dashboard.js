var hmmer_theme_hmmer_dashboard = function() {
  "use strict";

  var hmmer_theme = function (div,uuid) {

    //sunburst
	  var hmmer_hits_viewer = hmmer_vis.hits_view();
    var hmmer_sunburst = hmmer_vis.sunburst2();
    var hmmer_domain_architectures_view = hmmer_vis.domain_architectures_view();
	var hmmer_pdb_viewer = hmmer_vis.pdb_viewer();
    // start the spinners
    start_spinner();
    var hmmer_top_hits_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/"+uuid+"/dashboard/";
	// var hmmer_top_hits_url = "https://rawgit.com/fabsta/d3_sunburst/master/data/stats.json";
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

		  var getJSON = function(url, successHandler, errorHandler) {
		    var xhr = new XMLHttpRequest();
		    xhr.open('get', url, true);
		    xhr.responseType = 'json';
		    xhr.onload = function() {
		      var status = xhr.status;
		      if (status == 200) {
		        successHandler && successHandler(xhr.response);
		      } else {
		        errorHandler && errorHandler(status);
		      }
		    };
		    xhr.send();
		  };

		  getJSON(hmmer_top_hits_url, function(data) {
		  
			  d3.selectAll("#total_curr_hits").text(data.stats.nincluded>1000?1000:data.stats.nincluded);
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
			// load pdb viewer with pdb_id
		
		
			//hmmer_pdb_viewer("pdb_div", "1fup"data.pdb);
			hmmer_pdb_viewer("pdb_div", "1fup");
		  }, function(status) {
		    alert('Something went wrong.');
		  });


  };


  function start_spinner(){
    var spinners = ['top_hits_spinner', 'taxonomy_view_spinner', 'domain_architecture_spinner', 'pdb_spinner'];
    for(var spinner_id of spinners){
      d3.select("#"+spinner_id).style("visibility", "visible");
    }
  }

  return hmmer_theme;
};
