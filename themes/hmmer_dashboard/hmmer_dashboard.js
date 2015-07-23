var hmmer_theme_hmmer_dashboard = function() {
  "use strict";

  var hmmer_theme = function (div,uuid) {

    //sunburst
	  var hmmer_hits_viewer = hmmer_vis.hits_view();
    var hmmer_sunburst = hmmer_vis.sunburst2();
    var hmmer_domain_architectures_view = hmmer_vis.domain_architectures_view();
	var hmmer_pdb_viewer = hmmer_vis.pdb_viewer();
	var results_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/";
    // start the spinners
    start_spinner();
    var hmmer_top_hits_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/"+uuid+"/dashboard/";
	// var hmmer_top_hits_url = "https://rawgit.com/fabsta/d3_sunburst/master/data/stats.json";
	var hmmer_domain_tree_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/484B2AFA-CBC2-11E4-B744-822AB8F19640/fail/";
    var hmmer_pfama_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer//annotation/pfama/9B22C480-CBD7-11E4-AADB-FCB7088B62CF";
	// var uuid = "9B22C480-CBD7-11E4-AADB-FCB7088B62CF";

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
			  // getJSON("../../data/good_examples/example.json", function(data) {
		  
		  	  // set curr hits
			  d3.selectAll("#total_curr_hits").text(data.stats.nincluded>1000?1000:data.stats.nincluded);
			  d3.selectAll("#total_dom_arch").text(data.stats.no_dom_architectures);
			  // set links
			  document.getElementById("uuid_link_score").href=results_url+""+uuid+"/score"; 
			  document.getElementById("uuid_link_domain").href=results_url+""+uuid+"/domain"; 
			  document.getElementById("uuid_link_taxonomy").href=results_url+""+uuid+"/taxonomy"; 
			  
			  
			  
			  
			  var query_architecture_id = data.query_arch_id;
			  // http://www.ebi.ac.uk/pdbe/entry/pdb/1jcn
			  
	        if (typeof data.found_hits !== 'undefined'){
				d3.select("#top_hits_spinner").remove();
				hmmer_hits_viewer(document.getElementById("hits_viewer"), data.found_hits,1,query_architecture_id);
			}
	        // if (typeof data.distTree !== 'undefined'){
	        //   console.log("Found distTree entry: ");
	        //   hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.distTree), "dist_tree")
	        //   d3.select("#taxonomy_view_spinner").style("visibility", "hidden");
	        // }
	        
	        // domain architecture
	        if(typeof data.dom_architectures !== 'undefined'){
				var new_dom_array = [];
				for (var domain_index = 0; domain_index < data.dom_architectures.length; ++domain_index) {
					var current_domain = data.dom_architectures[domain_index]
					if(current_domain['archindex'] == query_architecture_id){
						data.matching_da = [current_domain];
						delete data.dom_architectures[domain_index];
					}
					else{
						new_dom_array.push(current_domain);
					}
				}
				data.dom_architectures = new_dom_array;
	          console.log("Found dom_architectures entry: ");
			  if(data.matching_da){
	         	 hmmer_domain_architectures_view(document.getElementById("same_domain_architectures_view"), data.matching_da,query_architecture_id);
		  	  }
			  else{
			  	
			  }
	          d3.select("#domain_architecture_spinner").remove();
			  
			  hmmer_domain_architectures_view(document.getElementById("domain_architectures_view"), data.dom_architectures,query_architecture_id);
			  
	        }
			// // Tree
// 	        if (typeof data.fullTree !== 'undefined'){
// 	          console.log("Found fullTree entry: ");
// 	          // hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.fullTree),"full_tree", data.found_hits)
// 	          hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.distTree), "dist_tree",data.found_hits)
// 	          d3.select("#taxonomy_view_spinner").remove();
// 	        }
	        if (typeof data.distTree !== 'undefined'){
	          console.log("Found fullTree entry: ");
	          // hmmer_sunburst(document.getElementById("chart"), JSON.parse(data.fullTree),"full_tree", data.found_hits)
		      var hmmer_tree_legend = hmmer_vis.tree_legend();
		      hmmer_tree_legend(document.getElementById("chart"), JSON.parse(data.fullTree));
	          d3.select("#taxonomy_view_spinner").remove();
	        }
			
			
			// PDB
	        if (typeof data.pdb !== 'undefined'){
				var pdb_hits = data.pdb.hits
				var best_hit = pdb_hits[0]
				var pdb_positions = data.pdb.pos.domains.map(function(domain){return [domain.iali,domain.jali]})
	            console.log("Found pdb entry: "+best_hit);
				d3.select("#pdb_spinner").remove();
 	 		 	var pdb_entry,chain_id;
 	 		 	(function(arr){ pdb_entry=arr[0]; chain_id=arr[1]; })(best_hit.split("_"));
		        if (typeof data.pdb.best_hit !== 'undefined'){
				//can we also show the match
					hmmer_hits_viewer(document.getElementById("pdb_match_div"), [data.pdb.best_hit],0,query_architecture_id);
				}
				// hmmer_pdb_viewer(document.getElementById("pdb_div"), curr_pdb_match.id, curr_pdb_match.chain, [{'start':pdb_from,'end': pdb_to}]);
				
				hmmer_pdb_viewer(document.getElementById("pdb_div"), pdb_entry, chain_id,[{'start':pdb_positions[0],'end': pdb_positions[1]}]);
				
		       
	        }
			else{
				d3.select("#pdb_spinner").remove();
				d3.select("#pdb_text").html("There was no pdb hit in your search result");
			}
			
			var kingdom_colors_legend = [{'taxon': 'Bacteria','color' : '#900'},
					{'taxon':'Eukaryota','color' :'#f3c800'},
				  {'taxon': 'Archeae','color': '#009dcc'},
				   {'taxon': 'Virus','color' : '#ff0000'},
			      {'taxon': 'Unclassified','color': '#999'},
					{'taxon': 'oth','color': '#333'}
				]
			d3.select("#legend").html("<ul class='first'> \
				<li class='bact'><span>Bacteria</span></li>\
				<li class='euk'><span>Eukaryota</span></li>\
				<li class='arc'><span>Archaea</span></li>\
				<li class='vir'><span>Viruses</span></li>\
				<li class='unc'><span>Unclassified sequences</span></li>\
				<li class='oth'><span>Other</span></li>\
			</ul>");
			
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
