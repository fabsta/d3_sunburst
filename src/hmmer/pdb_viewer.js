
hmmer_vis.pdb_viewer = function() {
	"use strict";
	var chart;

	// The cbak returned
	var pdb_viewer = function(div, pdb_id) {
   	 // var viewer = pv.Viewer(div_id,
   	 //                               { quality : 'medium', width: 'auto', height : 'auto',
   	 //                                 antialias : true, outline : true});
								
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
	 
	 // function loadMethylTransferase() {
	   // asynchronously load the PDB file for the dengue methyl transferase
	   // from the server and display it in the viewer.
		 
	   
	   pv.io.fetchPdb('https://rawgit.com/fabsta/d3_sunburst/master/data/1fup.pdb', function(structure) {
	   //pv.io.fetchPdb('../../data/1fup.pdb', function(structure) {
	       // display the protein as cartoon, coloring the secondary structure
	       // elements in a rainbow gradient.
	       viewer.cartoon('protein', structure, { color : color.ssSuccession() });
	       // there are two ligands in the structure, the co-factor S-adenosyl
	       // homocysteine and the inhibitor ribavirin-5' triphosphate. They have
	       // the three-letter codes SAH and RVP, respectively. Let's display them
	       // with balls and sticks.
	       // var ligands = structure.select({ rnames : ['SAH', 'RVP'] });
	       // viewer.ballsAndSticks('ligands', ligands);
	       viewer.centerOn(structure);
	   });
	 // }

	 // load the methyl transferase once the DOM has finished loading. That's
	 // the earliest point the WebGL context is available.
	 // document.addEventListener('DOMContentLoaded',
	 // loadMethylTransferase
 	// );
	 
		
		return chart;
	};
	

	return pdb_viewer;
};
