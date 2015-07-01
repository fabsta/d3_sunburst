
hmmer_vis.pdb_viewer = function() {
	"use strict";
	var chart;

	// The cbak returned
	var pdb_viewer = function(div, pdb_id, hit_positions, mapping) {
   	 // var viewer = pv.Viewer(div_id,
   	 //                               { quality : 'medium', width: 'auto', height : 'auto',
   	 //                                 antialias : true, outline : true});
	 var show_pdb_entry = 0;							
	 var options = {
	   width: 400,
	   height: 400,
	   antialias: true,
	   quality : 'medium'
	 };
	 
	 // insert the viewer under the Dom element with id 'gl'.
	 var viewer = pv.Viewer(div, options);
	 var width = d3.select("#pdb_div").style("width") 
	 var height = d3.select("#pdb_div").style("height") 
	 
	 
	 // can we map?
	 if(typeof mapping.uniprot !== 'undefined'){
		 if(typeof mapping.uniprot.start !== 'undefined' && typeof mapping.uniprot.end !== 'undefined'){
			 if(mapping.uniprot.start > hit_positions[1] || mapping.uniprot.end  < hit_positions[0]){
				 console.log("unfortunately, there is no overlap");
				 show_pdb_entry = 0; 
				 div.innerHTML = "Sorry no pdb with overlapping matching region found.";
			 }
			 else{
			 	show_pdb_entry = 1; 
			 }
		 }
	 }	 
	 // function loadMethylTransferase() {
	   // asynchronously load the PDB file for the dengue methyl transferase
	   // from the server and display it in the viewer.
		 if(show_pdb_entry){	
		 var pdb_entry,chain_id;
		 (function(arr){
		   pdb_entry=arr[0]; 
		   chain_id=arr[1];
		 })(pdb_id.split("_"));
		 
		 
	 // PDB id is http://www.ebi.ac.uk/pdbe/api/pdb/entry/residue_listing/:pdbid/chain/:chainid	 
	    var pdb_url = "http://www.ebi.ac.uk/pdbe/entry-files/download/pdb"+pdb_entry+".ent"
	   //var pdb_url = "http://www.ebi.ac.uk/pdbe/entry-files/download/pdb117e.ent"
	   	var pdb_url = "http://www.ebi.ac.uk/pdbe/entry-files/download/pdb"+pdb_entry+".ent"
		var not_selected_chains = [];
		
	   console.log("would get to fetch data from: "+pdb_url);
	   pv.io.fetchPdb(pdb_url, function(structure) {
	   // pv.io.fetchPdb('../../data/1fup.pdb', function(structure) {
				// var structure = pv.io.pdb(data);
				var chains = structure.chains().map(function(d){
					var chain = d['_H'];
					var current_chain = structure.select({chain: chain});
					if(chain_id == chain){
						var current_viewer = viewer.cartoon('current_chain', current_chain);
						// var selected = structure.select({rnumRange : [1001,1286]});
						hit_positions.map(function(range){
							// var selected = structure.select({rnumRange : range});
							var selected = structure.select({rnumRange : [1-20]});
							current_viewer.colorBy(color.uniform('red'), selected);
						})
					}
					else{
						not_selected_chains.push(chain);
						viewer.cartoon('other_chain', current_chain);
						viewer.cartoon('other_chain', current_chain);
						viewer.forEach(function(object) {
							if(object['_H'] == 'other_chain'){
								object.setOpacity(0.4);
							}
						});
					}
					return d['_H'];
				})
	     	   //viewer.centerOn(structure);
			   viewer.autoZoom()
			   var html_text = "Pdb structure of the best hit was <a href='http://www.ebi.ac.uk/pdbe/entry/pdb/"+pdb_entry+"'>"+pdb_entry+"</a> (chain: "+chain_id+").";
			   html_text += (not_selected_chains.length)? "<br>The other "+not_selected_chains.length+" chain(s) ("+not_selected_chains.sort()+") are greyed out. " : "<br>The protein has no other chains. ";
			   html_text += "The matching region on chain "+chain_id+" is highlighted in red.";
			   d3.select("#pdb_text").html(html_text);
			   
	   });
	 }

	 // load the methyl transferase once the DOM has finished loading. That's
	 // the earliest point the WebGL context is available.
	 // document.addEventListener('DOMContentLoaded',
	 // loadMethylTransferase
 	// );
	 
		
		return chart;
	};
	function highlightFrom(start, stop) {
	  return new pv.color.ColorOp(function(atom, out, index) {
	    if (atom.index() > start && atom.index() < stop ) {
	      out[index+0] = 1.0; // R
	      out[index+1] = 0.0; // G
	      out[index+2] = 0.0; // B
	      out[index+3] = 1.0; // A
	    } else {
	      out[index+0] = 1.0;
	      out[index+1] = 1.0;
	      out[index+2] = 1.0;
	      out[index+3] = 0;
	    }
	  });
	}

	return pdb_viewer;
};
