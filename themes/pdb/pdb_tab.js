var pdb_theme_hmmer_dashboard = function() {
  "use strict";

  var pdb_theme = function (div,uuid) {

    //sunburst
	  var hmmer_hits_viewer = hmmer_vis.hits_view();
    var hmmer_sunburst = hmmer_vis.sunburst2();
    var hmmer_domain_architectures_view = hmmer_vis.domain_architectures_view();
	var hmmer_pdb_viewer = hmmer_vis.pdb_viewer();
	var hmmer_pdb_table = hmmer_vis.data_table();
	
	var results_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/";
    // start the spinners
    start_spinner();
    var hmmer_top_hits_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/"+uuid+"/pdb/";
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
		  // d3.json("../../data/pdb.json", function(error, data) {
			  // d3.json("../../data/pdb.json", function(error, data) {
		  getJSON(hmmer_top_hits_url, function(data) {

			// PDB
	        if (typeof data.pdb !== 'undefined'){
				// plot the top hit
				var pdb_best_hit;
				var hit2show = 0;
				// ok determine the matches that overlap
				
				for (var seq_objects_index = 0; seq_objects_index < data.found_hits.length; ++seq_objects_index) {
					var curr_hit = data.found_hits[seq_objects_index];
					// if(curr_hit.acc != 'FYN_CHICK'){
						// continue;
					// }
					var seq_matches = curr_hit.domains.map(function(domain){return [domain.iali,domain.jali]})
					var pdb_mappings = curr_hit.pdb_matches.map(function(domain){return domain})
					for (var seq_match_index = 0; seq_match_index < seq_matches.length; ++seq_match_index) {
						var curr_match = seq_matches[seq_match_index];
						var overlap_detected = 0;
						curr_match['no_overlaps'] = 0;
						for (var pdb_match in pdb_mappings) {
							var curr_pdb_match = pdb_mappings[pdb_match];
							var match_from = curr_match[0], pdb_to = curr_pdb_match.mapping.uniprot.end, match_to = curr_match[1], pdb_from = curr_pdb_match.mapping.uniprot.start;
							// let's only show x pdb matches
							if(curr_match['no_overlaps'] >=4){
								curr_pdb_match['hide'] = true;
								continue;
							}
							// hit overlaps completely
							if(match_from <= pdb_from){
								if(match_to >= pdb_from){
									overlap_detected=1;
									curr_pdb_match['plot_level'] = curr_match['no_overlaps'] ? curr_match['no_overlaps'] : 0;
									curr_match['no_overlaps'] += 1;
								}
							}
							else{
								if(match_from <= pdb_to){
									curr_pdb_match['plot_level'] = curr_match['no_overlaps'] ? curr_match['no_overlaps'] : 0;
									curr_match['no_overlaps'] += 1;
									overlap_detected=1;
								}
							}
							if(overlap_detected && !hit2show){
								hmmer_pdb_viewer(document.getElementById("pdb_div"), curr_pdb_match.id, curr_pdb_match.chain, [{'start':pdb_from,'end': pdb_to}]);
								pdb_best_hit = curr_pdb_match.id+"_"+curr_pdb_match.chain;
								hit2show = 1;
							}
						}
					// if(overlap_detected){
					// 	current_domain.query_color = color[unique_hit];
					// }
					}
				 // hmmer_pdb_viewer(document.getElementById("pdb_div"), best_hit_id, pdb_positions, pdb_mappings);
			 }
				// data table
				hmmer_pdb_table("pdb_hits_table", [data.found_hits]);
				// highlight pdb entry
				// d3.select("#"+pdb_best_hit+"").attr('class','pdb_hit_description small selected');
	        }
			else{
				d3.select("#pdb_spinner").attr('visibility','hidden');
				d3.select("#pdb_text").html("There was no pdb hit in your search result");
			}
		  }, function(status) {
		    alert('Something went wrong.');
		  });


  };


	// function overlap (a, b){
//   		return (a.x < b.x < a.x2() and a.y < b.y < a.y2()) or (a.x < b.x2() < a.x2() and a.y < b.y2() < a.y2());
// 	}

  function start_spinner(){
    var spinners = ['top_hits_spinner', 'taxonomy_view_spinner', 'domain_architecture_spinner', 'pdb_spinner'];
    for(var spinner_id of spinners){
      d3.select("#"+spinner_id).style("visibility", "visible");
    }
  }

  return pdb_theme;
};
