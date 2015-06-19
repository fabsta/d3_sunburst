
hmmer_vis.hits_graphic = function() {
	"use strict";
	var chart;

    var conf = {};

	// The cbak returned
	var hits_graphic = function(div) {
		var sequence = "HKLNFLNLSDFLERJLERJLACMALSCMASLDKJASKLDJOERIEWPKAMSCMLAJ";

		var chart = new PfamGraphic('#domGraph', example_sequence);
		// var chart = new PfamGraphic();
		chart.render();
        var new_width = $('#domGraph').parent().width();
         chart.resize( new_width );

    return hits_graphic;
	};


	// hmmer_vis.dispatch.on('update', function(args){
// 	    //do something here
// 		console.log("I was told to  "+args.message);
// 		// pie_chart.redraw(args.count);
//})


    hits_graphic.redraw = function(pie_data) {
			return hits_graphic;
    }
	//Generate some nice data.
	function _exampleData() {
		var test_array = [];
	 	for (var letter in {'present':0,'complete':0, 'incomplete':0}) {
		   test_array.push({'label':letter, 'value': Math.random()*30})
	 	}
		return test_array;
	}
	var example_sequence = {
    "length": 3460,
    "regions": [
        {
            "modelStart": "1",
            "modelEnd": "195",
            "endStyle": "curved",
            "end": 2699,
            "display": true,
            "startStyle": "curved",
            "color": "#98cc32",
            "aliEnd": 2699,
            "modelLength": 195,
            "text": "BRCA-2_helical",
            "href": "http://pfam.xfam.org/family/PF09169.5",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "3.5e-101",
                "_uniq": 1,
                "description": "BRCA2, helical",
                "bitscore": 325.350524902344,
                "end": "2699",
                "accession": "PF09169.5",
                "database": "pfam",
                "aliEnd": 2699,
                "identifier": "BRCA-2_helical",
                "type": "Domain",
                "aliStart": 2511,
                "start": "2511"
            },
            "aliStart": 2511,
            "clan": null,
            "start": 2511
        },
        {
            "modelStart": "1",
            "modelEnd": "35",
            "endStyle": "curved",
            "end": 1038,
            "display": true,
            "startStyle": "curved",
            "color": "#371e7a",
            "aliEnd": 1038,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "3.0e-15",
                "_uniq": 2,
                "description": "BRCA2 repeat",
                "bitscore": 44.0078163146973,
                "end": "1038",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 1038,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 1004,
                "start": "1004"
            },
            "aliStart": 1004,
            "clan": null,
            "start": 1004
        },
        {
            "modelStart": "1",
            "modelEnd": "35",
            "endStyle": "curved",
            "end": 1253,
            "display": true,
            "startStyle": "curved",
            "color": "#371e7a",
            "aliEnd": 1253,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "2.0e-09",
                "_uniq": 3,
                "description": "BRCA2 repeat",
                "bitscore": 25.367561340332,
                "end": "1253",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 1253,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 1219,
                "start": "1219"
            },
            "aliStart": 1219,
            "clan": null,
            "start": 1219
        },
        {
            "modelStart": "7",
            "modelEnd": "34",
            "endStyle": "jagged",
            "end": 1463,
            "display": true,
            "startStyle": "jagged",
            "color": "#371e7a",
            "aliEnd": 1462,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "3.6e-13",
                "_uniq": 4,
                "description": "BRCA2 repeat",
                "bitscore": 37.3688583374023,
                "end": "1463",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 1462,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 1435,
                "start": "1432"
            },
            "aliStart": 1435,
            "clan": null,
            "start": 1432
        },
        {
            "modelStart": "3",
            "modelEnd": "34",
            "endStyle": "jagged",
            "end": 1566,
            "display": true,
            "startStyle": "jagged",
            "color": "#371e7a",
            "aliEnd": 1565,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "6.5e-15",
                "_uniq": 5,
                "description": "BRCA2 repeat",
                "bitscore": 42.9266929626465,
                "end": "1566",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 1565,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 1534,
                "start": "1532"
            },
            "aliStart": 1534,
            "clan": null,
            "start": 1532
        },
        {
            "modelStart": "1",
            "modelEnd": "34",
            "endStyle": "jagged",
            "end": 1710,
            "display": true,
            "startStyle": "curved",
            "color": "#371e7a",
            "aliEnd": 1710,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "9.4e-18",
                "_uniq": 6,
                "description": "BRCA2 repeat",
                "bitscore": 52.0054969787598,
                "end": "1710",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 1710,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 1677,
                "start": "1677"
            },
            "aliStart": 1677,
            "clan": null,
            "start": 1677
        },
        {
            "modelStart": "3",
            "modelEnd": "35",
            "endStyle": "curved",
            "end": 2043,
            "display": true,
            "startStyle": "jagged",
            "color": "#371e7a",
            "aliEnd": 2043,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "3.5e-16",
                "_uniq": 7,
                "description": "BRCA2 repeat",
                "bitscore": 47.0057029724121,
                "end": "2043",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 2043,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 2011,
                "start": "2010"
            },
            "aliStart": 2011,
            "clan": null,
            "start": 2010
        },
        {
            "modelStart": "2",
            "modelEnd": "34",
            "endStyle": "jagged",
            "end": 2112,
            "display": true,
            "startStyle": "jagged",
            "color": "#371e7a",
            "aliEnd": 2111,
            "modelLength": 35,
            "text": "BRCA2",
            "href": "http://pfam.xfam.org/family/PF00634.13",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "3.7e-16",
                "_uniq": 8,
                "description": "BRCA2 repeat",
                "bitscore": 46.8995971679688,
                "end": "2112",
                "accession": "PF00634.13",
                "database": "pfam",
                "aliEnd": 2111,
                "identifier": "BRCA2",
                "type": "Family",
                "aliStart": 2079,
                "start": "2078"
            },
            "aliStart": 2079,
            "clan": null,
            "start": 2078
        },
        {
            "modelStart": "1",
            "modelEnd": "143",
            "endStyle": "curved",
            "end": 3222,
            "display": true,
            "startStyle": "curved",
            "color": "#32adcc",
            "aliEnd": 3222,
            "modelLength": 143,
            "text": "BRCA-2_OB3",
            "href": "http://pfam.xfam.org/family/PF09104.5",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "9.9e-70",
                "_uniq": 9,
                "description": "BRCA2, oligonucleotide/oligosaccharide-binding, domain 3",
                "bitscore": 221.59977722168,
                "end": "3222",
                "accession": "PF09104.5",
                "database": "pfam",
                "aliEnd": 3222,
                "identifier": "BRCA-2_OB3",
                "type": "Domain",
                "aliStart": 3084,
                "start": "3084"
            },
            "aliStart": 3084,
            "clan": null,
            "start": 3084
        },
        {
            "modelStart": "1",
            "modelEnd": "117",
            "endStyle": "jagged",
            "end": 2832,
            "display": true,
            "startStyle": "curved",
            "color": "#cc8432",
            "aliEnd": 2831,
            "modelLength": 118,
            "text": "BRCA-2_OB1",
            "href": "http://pfam.xfam.org/family/PF09103.5",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "6.4e-45",
                "_uniq": 10,
                "description": "BRCA2, oligonucleotide/oligosaccharide-binding, domain 1",
                "bitscore": 140.40397644043,
                "end": "2832",
                "accession": "PF09103.5",
                "database": "pfam",
                "aliEnd": 2831,
                "identifier": "BRCA-2_OB1",
                "type": "Domain",
                "aliStart": 2702,
                "start": "2702"
            },
            "aliStart": 2702,
            "clan": null,
            "start": 2702
        },
        {
            "modelStart": "1",
            "modelEnd": "42",
            "endStyle": "curved",
            "end": 2904,
            "display": true,
            "startStyle": "curved",
            "color": "#333333",
            "aliEnd": 2904,
            "modelLength": 42,
            "text": "Tower",
            "href": "http://pfam.xfam.org/family/PF09121.5",
            "type": "pfama",
            "metadata": {
                "scoreName": "e-value",
                "score": "1.0e-25",
                "_uniq": 11,
                "description": "Tower",
                "bitscore": 78.1909103393555,
                "end": "2904",
                "accession": "PF09121.5",
                "database": "pfam",
                "aliEnd": 2904,
                "identifier": "Tower",
                "type": "Domain",
                "aliStart": 2863,
                "start": "2863"
            },
            "aliStart": 2863,
            "clan": null,
            "start": 2863
        }
    ],
    "arch": "76218951764462",
    "title": "Pfam",
    "markups": [],
    "motifs": []
};


	return hits_graphic;
};
