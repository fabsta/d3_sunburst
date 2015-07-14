
hmmer_vis.pdb_viewer = function() {
	"use strict";
	var chart;
 var show_pdb_entry = 1;							
 var options = {
   width: 400,
   height: 400,
   antialias: true,
   quality : 'medium'
 };
 var curr = {
	 'chain': undefined,
	 'pdb_id': undefined,
	 'div' : undefined,
 }
	// The cbak returned
	var pdb_viewer = function(div, pdb_id, chain,hit_positions) {
		 // insert the viewer under the Dom element with id 'gl'.
		options.width = d3.select("#pdb_div").style("width") / 2;
		options.height = d3.select("#pdb_div").style("height")>0 ? d3.select("#pdb_div").style("height") : (options.width * 0.7);
		 curr.chain = chain;
	 	curr.pdb_id = pdb_id;
		curr.div = div;	
	 	curr.viewer = pv.Viewer(div, options);
	 
	 // if(!show_pdb_entry){
		 // 		 div.innerHTML = "Sorry no pdb with overlapping matching region found.";
		 // 	 }
	 pdb_viewer.redraw(hit_positions);
		
		return chart;
	};
	

    pdb_viewer.update_drawing = function(hit_positions) {
		curr.chains = structure.chains().map(function(d){
			var chain = d['_H'];
			var current_chain = structure.select({chain: chain});
			if(curr.chain == chain){
				var current_viewer = curr.viewer.cartoon('current_chain', current_chain);
				// var selected = structure.select({rnumRange : [1001,1286]});
				hit_positions.map(function(range){
					// var selected = structure.select({rnumRange : range});
					var coordinates = [range.start,range.end];
					// var selected = structure.select({rnumRange : coordinates});
					// var selected = structure.select({rnumRange : [1,286]});
					var selected = structure.select({rnumRange : coordinates});
					current_viewer.colorBy(color.uniform('red'), selected);
				})
			}
			else{
				not_selected_chains.push(chain);
				curr.viewer.cartoon('other_chain', current_chain);
				curr.viewer.cartoon('other_chain', current_chain);
				curr.viewer.forEach(function(object) {
					if(object['_H'] == 'other_chain'){
						object.setOpacity(0.4);
					}
				});
			}
			return d['_H'];
		})
	}
	
    pdb_viewer.redraw = function(hit_positions) {
		var pdb_entry = curr.pdb_id;
	   	var pdb_url = "http://www.ebi.ac.uk/pdbe/entry-files/download/pdb"+pdb_entry+".ent"
		var not_selected_chains = [];
		d3.select("#pdb_spinner").attr('class','');
		d3.select("#pdb_loading_text").html("Loading pdb structure for "+pdb_entry+", chain "+curr.chain+"...");
		console.log("would get to fetch data from: "+pdb_url);
 	   	pv.io.fetchPdb(pdb_url, function(structure) {
 				// var structure = pv.io.pdb(data);
 				curr.chains = structure.chains().map(function(d){
 					var chain = d['_H'];
 					var current_chain = structure.select({chain: chain});
 					if(curr.chain == chain){
 						var current_viewer = curr.viewer.cartoon('current_chain', current_chain);
 						// var selected = structure.select({rnumRange : [1001,1286]});
						hit_positions.map(function(range){
 							// var selected = structure.select({rnumRange : range});
							var coordinates = [range.start,range.end];
 							// var selected = structure.select({rnumRange : coordinates});
	 						// var selected = structure.select({rnumRange : [1,286]});
							var selected = structure.select({rnumRange : coordinates});
 							current_viewer.colorBy(color.uniform('red'), selected);
 						})
						// curr.viewer.fitTo(allSelections);
 					}
 					else{
 						not_selected_chains.push(chain);
 						curr.viewer.cartoon('other_chain', current_chain);
 						curr.viewer.forEach(function(object) {
 							if(object['_H'] == 'other_chain'){
 								object.setOpacity(0.4);
 							}
 						});
 					}
 					return d['_H'];
 				})
 	     	   //viewer.centerOn(structure);
 			   curr.viewer.autoZoom()
			   // viewer.fitTo(allSelections);

			   // update text
 			   var html_text = "Pdb structure of the best hit was <a href='http://www.ebi.ac.uk/pdbe/entry/pdb/"+pdb_entry+"'>"+pdb_entry+"</a> (chain: "+curr.chain+").";
 			   html_text += (not_selected_chains.length)? "<br>The other "+not_selected_chains.length+" chain(s) ("+not_selected_chains.sort()+") are greyed out. " : "<br>The protein has no other chains. ";
 			   html_text += "The matching region on chain "+curr.chain+" is highlighted in red.";
 			   d3.select("#pdb_text").html(html_text);
			   //disable spinner
			   d3.select("#pdb_spinner").attr('class','hidden');
			   
			   // ok, now higlight the selected text
			   // d3.selectAll(".pdb_hit_description").attr('class','pdb_hit_description small');
			   // $("#"+curr.id+"_"+curr.chain+"").attr('class','pdb_hit_description small selected');
			    // d3.selectAll("#2br9_A").attr('class','pdb_hit_description small selected');
			   // jQuery('#2br9A').addClass('selected');
			   
 	   });
      return pdb_viewer;
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


	hmmer_vis.dispatch.on('update_pdb_viewer', function(args){
  // 	    //do something here
		if (typeof args !== 'undefined'){
			if(curr.pdb_id == args.pdb_id){
				if(curr.chain == args.chain){
					d3.select("#pdb_update_text").html("same pdb_id and chain, nothing updated");
				}
				else{
					d3.select("#pdb_update_text").html("same pdb_id, updating chain from "+curr.chain+" to "+args.chain+" ");
					d3.select("#pdb_update_text").html("different pdb_id, fetching new pdb entry");
					d3.select("#pdb_div").selectAll("*").remove();
					d3.select("#pdb_spinner").style("visibility",'');
					curr.pdb_id = args.pdb_id;
					curr.chain = args.chain;
					// var hit_positions = args.mapping.pdb;
					if(! Object.prototype.toString.call( args.pdb_region ) === '[object Array]' ) {
						args.pdb_region = [args.pdb_region];
					}
					pdb_viewer.redraw(args.pdb_region);
					curr.viewer = pv.Viewer(curr.div, options);
					d3.select("#pdb_spinner").style("visibility",'hidden');
				}
			}
			else{
				d3.select("#pdb_update_text").html("different pdb_id, fetching new pdb entry");
				d3.select("#pdb_div").selectAll("*").remove();
				d3.select("#pdb_spinner").style("visibility",'');
				// clear old
				curr.pdb_id = args.pdb_id;
				curr.chain = args.chain;
				// var hit_positions = args.mapping.pdb;
				if(! Object.prototype.toString.call( args.pdb_region ) === '[object Array]' ) {
					args.pdb_region = [args.pdb_region];
				}
				pdb_viewer.redraw(args.pdb_region);
				curr.viewer = pv.Viewer(curr.div, options);
				d3.select("#pdb_spinner").style("visibility",'hidden');
			}
		}
		else{
			d3.select("#pdb_update_text").html("Something went wrong, cannot update");
		}
  
	 return pdb_viewer;
});
	 return pdb_viewer;
};
