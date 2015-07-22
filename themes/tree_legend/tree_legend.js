var hmmer_theme_tree_legend = function() {
  "use strict";

  var hmmer_theme = function (div,uuid) {

    //sunburst
    // var hmmer_elem = hmmer_vis.sunburst()
    // var hmmer_cloud = hmmer_vis.word_cloud();
	
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
  var hmmer_top_hits_url = "http://wwwdev.ebi.ac.uk/Tools/hmmer/results/"+uuid+"/dashboard/";
  // d3.json("../../data/dist_tree.json", function(error, data) {
  getJSON(hmmer_top_hits_url, function(data) {
	
    var hmmer_tree_legend = hmmer_vis.tree_legend();
    // hmmer_tree_legend(document.getElementById("legend"), JSON.parse(data.distTree));
    hmmer_tree_legend(document.getElementById("legend"), JSON.parse(data.fullTree));
	})
  };

  return hmmer_theme;
};
