    
function init_code_hierarchy_plot(element_id,data)
{
    var plot = document.getElementById(element_id);
    while (plot.hasChildNodes())
    {
        plot.removeChild(plot.firstChild);
    }

    var width = plot.offsetWidth;
    var height = width;
    var x_margin = 40;
    var radius = width/7;
    var y_margin = 40;
    var name_index = 0;
    var count_index = 1;
    var children_index = 3;
	
   
    var max_depth=3;
    
    var data_slices = [];
    var max_level = 4;
    var color = d3.scale.category20c();

    var svg = d3.select("#"+element_id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");
      
    function process_data(data,level,start_deg,stop_deg)
    {
        var name = data[0];
        var total = data[1];
        var children = data[3];
        var current_deg = start_deg;
		var parent = '';

        if (level > max_level)
        {
            return;
        }
        if (start_deg == stop_deg)
        {
            return;
        }
		
		
        data_slices.push([start_deg,stop_deg,name,level,data[1],data[2]]);
		
        for (var key in children)
        {
            child = children[key];
            
			var inc_deg = (stop_deg-start_deg)/total*child[count_index];
            var child_start_deg = current_deg;
            
			current_deg+=inc_deg;
            
			var child_stop_deg = current_deg;
            var span_deg = child_stop_deg-child_start_deg;
            
			process_data(child,level+1,child_start_deg,child_stop_deg);
        }
    }
    
    process_data(data,0,0,360./180.0*Math.PI);

    var ref = data_slices[0];
    var next_ref = ref;
    var last_refs = [];

    var thickness = width/2.0/(max_level+2)*1.1;
        
    var arc = d3.svg.arc()
    .startAngle(function(d) { if(d[3]==0){return d[0];}return d[0]+0.01; })
    .endAngle(function(d) { if(d[3]==0){return d[1];}return d[1]-0.01; })
    .innerRadius(function(d) { return 1.1*d[3]*thickness; })
    .outerRadius(function(d) { return (1.1*d[3]+1)*thickness; });    
    
    var slices = svg.selectAll(".form-container")
        .data(function(d) { return data_slices; })
        .enter()
        .append("g")
        .classed('form-container', true);
		
    slices.append("path")
        .attr("d", arc)
        .attr("id",function(d,i){return d[2]+""+i;})
        .style("fill", function(d) { return color(d[2]);})
        .on("click",animate)        
        .attr("class","form")
        .append("svg:title")
        .text(function(d) { return Math.round(d[0]*100)/100 +" , "+ Math.round(d[1]*100)/100; });

    function getAngle(d) {
        var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
        return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
    }
    
    slices.append("text")
        .classed('label', true)
        .style("font-size", "10px")
		.attr("x", function(d) { return d[1]; })
        .attr("text-anchor", "middle")
		.attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")" + 
                   "rotate("    + getAngle(d) +     ")"; })
		.attr("dx", "6") // margin
		.attr("dy", ".35em") // vertical-align
		.text(function(d){return d[2]})
        .attr("pointer-events","none");

    function get_start_angle(d,ref)
    {
        if (ref)
        {
            var ref_span = ref[1]-ref[0];
            return (d[0]-ref[0])/ref_span*Math.PI*2.0
        }
        else
        {
            return d[0];
        }
    }
    
    function get_stop_angle(d,ref)
    {
        if (ref)
        {
            var ref_span = ref[1]-ref[0];
            return (d[1]-ref[0])/ref_span*Math.PI*2.0
        }
        else
        {
            return d[0];
        }
    }
    
    function get_level(d,ref)
    {
        if (ref)
        {
            return d[3]-ref[3];
        }
        else
        {
            return d[3];
        }
    }
    
    function change_ref(data_point, reference_point) {
        return [
            get_start_angle(data_point, reference_point),
            get_stop_angle (data_point, reference_point),
            data_point[2],
            get_level      (data_point, reference_point)
        ];
    }
    
    function rebaseTween(new_ref)
    {
        return function(d)
        {
            var level = d3.interpolate(get_level(d,ref),get_level(d,new_ref));
            var start_deg = d3.interpolate(get_start_angle(d,ref),get_start_angle(d,new_ref));
            var stop_deg = d3.interpolate(get_stop_angle(d,ref),get_stop_angle(d,new_ref));
            var opacity = d3.interpolate(100,0);
            return function(t)
            {
                return arc([start_deg(t),stop_deg(t),d[2],level(t)]);
            }
        }
    }
    
    var animating = false;
    
    function animate(d) 
	{
		d3.select(this).classed('active',true).classed('hovered',false); 
        if (animating)
        {
            return;
        }
        animating = true;
        var revert = false;
        var new_ref;
        if (d == ref && last_refs.length > 0)
        {
            revert = true;
            last_ref = last_refs.pop();
        }
        if (revert)
        {
            d = last_ref;
            new_ref = ref;
            svg.selectAll(".form-container")
            .filter(
                function (b)
                {
                    if (b[0] >= last_ref[0] && b[1] <= last_ref[1]  && b[3] >= last_ref[3])
                    {
                        return true;
                    }
                    return false;
                }
            )
            .transition().duration(1000).style("opacity","1").attr("pointer-events","all");
        }
        else
        {
            new_ref = d;
            svg.selectAll(".form-container")
            .filter(
                function (b)
                {
                    if (b[0] < d[0] || b[1] > d[1] || b[3] < d[3])
                    {
                        return true;
                    }
                    return false;
                }
            )
            .transition().duration(1000).style("opacity","0").attr("pointer-events","none");
        }
        svg.selectAll(".form")
        .filter(
            function (b)
            {
                if (b[0] >= new_ref[0] && b[1] <= new_ref[1] && b[3] >= new_ref[3])
                {
                    return true;
                }
                return false;
            }
        )
        .transition().duration(1000).attrTween("d",rebaseTween(d));
        
        svg.selectAll('.label')
        .filter(
            function (b)
            {
                return b[0] >= new_ref[0] && b[1] <= new_ref[1] && b[3] >= new_ref[3];
            }
        ).transition().duration(1000)
         .attr("transform", function(b) {
             var b_prime = change_ref(b, d);
             return "translate(" + arc.centroid(b_prime) + ")" + 
                    "rotate("    + getAngle(b_prime) +     ")"; 
         })
                     
        setTimeout(function(){
            animating = false;
            if (! revert)
            {
                last_refs.push(ref);
                ref = d;
            }
            else
            {
                ref = d;
            }
            },1000);
    };  

}
code_hierarchy_data = [
    "[everything]", 
    417060, 
    11601, 
    {
        "docs": [
            "docs", 
            14126, 
            374, 
            {
                "conf-py": [
                    "conf.py", 
                    8906, 
                    270, 
                    {}
                ], 
                "flaskdocext-py": [
                    "flaskdocext.py", 
                    345, 
                    17, 
                    {}
                ], 
                "flaskext-py": [
                    "flaskext.py", 
                    4875, 
                    87, 
                    {}
                ]
            }
        ], 
        "examples": [
            "examples", 
            21071, 
            677, 
            {
                "blueprintexample": [
                    "blueprintexample", 
                    1551, 
                    63, 
                    {
                        "blueprintexample-py": [
                            "blueprintexample.py", 
                            282, 
                            11, 
                            {}
                        ], 
                        "blueprintexample_test-py": [
                            "blueprintexample_test.py", 
                            867, 
                            37, 
                            {}
                        ], 
                        "simple_page": [
                            "simple_page", 
                            402, 
                            15, 
                            {
                                "__init__-py": [
                                    "__init__.py", 
                                    0, 
                                    1, 
                                    {}
                                ], 
                                "simple_page-py": [
                                    "simple_page.py", 
                                    402, 
                                    14, 
                                    {}
                                ]
                            }
                        ]
                    }
                ], 
                "flaskr": [
                    "flaskr", 
                    5142, 
                    178, 
                    {
                        "flaskr-py": [
                            "flaskr.py", 
                            2795, 
                            102, 
                            {}
                        ], 
                        "flaskr_tests-py": [
                            "flaskr_tests.py", 
                            2347, 
                            76, 
                            {}
                        ]
                    }
                ], 
                "jqueryexample": [
                    "jqueryexample", 
                    659, 
                    30, 
                    {
                        "jqueryexample-py": [
                            "jqueryexample.py", 
                            659, 
                            30, 
                            {}
                        ]
                    }
                ], 
                "minitwit": [
                    "minitwit", 
                    13719, 
                    406, 
                    {
                        "minitwit-py": [
                            "minitwit.py", 
                            8481, 
                            256, 
                            {}
                        ], 
                        "minitwit_tests-py": [
                            "minitwit_tests.py", 
                            5238, 
                            150, 
                            {}
                        ]
                    }
                ]
            }
        ], 
        "flask": [
            "flask", 
            348269, 
            9494, 
            {
                "__init__-py": [
                    "__init__.py", 
                    1584, 
                    50, 
                    {}
                ], 
                "app-py": [
                    "app.py", 
                    74800, 
                    1785, 
                    {}
                ], 
                "blueprints-py": [
                    "blueprints.py", 
                    15269, 
                    374, 
                    {}
                ], 
                "config-py": [
                    "config.py", 
                    6150, 
                    169, 
                    {}
                ], 
                "ctx-py": [
                    "ctx.py", 
                    11112, 
                    304, 
                    {}
                ], 
                "debughelpers-py": [
                    "debughelpers.py", 
                    3458, 
                    86, 
                    {}
                ], 
                "exceptions-py": [
                    "exceptions.py", 
                    1454, 
                    49, 
                    {}
                ], 
                "ext": [
                    "ext", 
                    842, 
                    30, 
                    {
                        "__init__-py": [
                            "__init__.py", 
                            842, 
                            30, 
                            {}
                        ]
                    }
                ], 
                "exthook-py": [
                    "exthook.py", 
                    5055, 
                    120, 
                    {}
                ], 
                "globals-py": [
                    "globals.py", 
                    1137, 
                    45, 
                    {}
                ], 
                "helpers-py": [
                    "helpers.py", 
                    32910, 
                    830, 
                    {}
                ], 
                "json-py": [
                    "json.py", 
                    5591, 
                    168, 
                    {}
                ], 
                "logging-py": [
                    "logging.py", 
                    1398, 
                    46, 
                    {}
                ], 
                "module-py": [
                    "module.py", 
                    1363, 
                    43, 
                    {}
                ], 
                "session-py": [
                    "session.py", 
                    462, 
                    20, 
                    {}
                ], 
                "sessions-py": [
                    "sessions.py", 
                    12023, 
                    306, 
                    {}
                ], 
                "signals-py": [
                    "signals.py", 
                    1973, 
                    53, 
                    {}
                ], 
                "templating-py": [
                    "templating.py", 
                    4666, 
                    143, 
                    {}
                ], 
                "testing-py": [
                    "testing.py", 
                    4958, 
                    123, 
                    {}
                ], 
                "testsuite": [
                    "testsuite", 
                    150926, 
                    4452, 
                    {
                        "__init__-py": [
                            "__init__.py", 
                            6376, 
                            225, 
                            {}
                        ], 
                        "appctx-py": [
                            "appctx.py", 
                            3124, 
                            103, 
                            {}
                        ], 
                        "basic-py": [
                            "basic.py", 
                            43316, 
                            1241, 
                            {}
                        ], 
                        "blueprints-py": [
                            "blueprints.py", 
                            27369, 
                            767, 
                            {}
                        ], 
                        "config-py": [
                            "config.py", 
                            11816, 
                            301, 
                            {}
                        ], 
                        "deprecations-py": [
                            "deprecations.py", 
                            1074, 
                            42, 
                            {}
                        ], 
                        "examples-py": [
                            "examples.py", 
                            942, 
                            39, 
                            {}
                        ], 
                        "ext-py": [
                            "ext.py", 
                            4720, 
                            124, 
                            {}
                        ], 
                        "helpers-py": [
                            "helpers.py", 
                            19337, 
                            512, 
                            {}
                        ], 
                        "regression-py": [
                            "regression.py", 
                            3221, 
                            118, 
                            {}
                        ], 
                        "signals-py": [
                            "signals.py", 
                            3082, 
                            104, 
                            {}
                        ], 
                        "subclassing-py": [
                            "subclassing.py", 
                            1205, 
                            47, 
                            {}
                        ], 
                        "templating-py": [
                            "templating.py", 
                            10738, 
                            293, 
                            {}
                        ], 
                        "test_apps": [
                            "test_apps", 
                            2129, 
                            122, 
                            {
                                "blueprintapp": [
                                    "blueprintapp", 
                                    766, 
                                    34, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            200, 
                                            8, 
                                            {}
                                        ], 
                                        "apps": [
                                            "apps", 
                                            566, 
                                            26, 
                                            {
                                                "__init__-py": [
                                                    "__init__.py", 
                                                    0, 
                                                    1, 
                                                    {}
                                                ], 
                                                "admin": [
                                                    "admin", 
                                                    362, 
                                                    16, 
                                                    {
                                                        "__init__-py": [
                                                            "__init__.py", 
                                                            362, 
                                                            16, 
                                                            {}
                                                        ]
                                                    }
                                                ], 
                                                "frontend": [
                                                    "frontend", 
                                                    204, 
                                                    9, 
                                                    {
                                                        "__init__-py": [
                                                            "__init__.py", 
                                                            204, 
                                                            9, 
                                                            {}
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ], 
                                "config_module_app-py": [
                                    "config_module_app.py", 
                                    101, 
                                    5, 
                                    {}
                                ], 
                                "config_package_app": [
                                    "config_package_app", 
                                    101, 
                                    5, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            101, 
                                            5, 
                                            {}
                                        ]
                                    }
                                ], 
                                "flask_broken": [
                                    "flask_broken", 
                                    48, 
                                    4, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            48, 
                                            3, 
                                            {}
                                        ], 
                                        "b-py": [
                                            "b.py", 
                                            0, 
                                            1, 
                                            {}
                                        ]
                                    }
                                ], 
                                "flask_newext_package": [
                                    "flask_newext_package", 
                                    61, 
                                    5, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            26, 
                                            2, 
                                            {}
                                        ], 
                                        "submodule-py": [
                                            "submodule.py", 
                                            35, 
                                            3, 
                                            {}
                                        ]
                                    }
                                ], 
                                "flask_newext_simple-py": [
                                    "flask_newext_simple.py", 
                                    25, 
                                    2, 
                                    {}
                                ], 
                                "flaskext": [
                                    "flaskext", 
                                    86, 
                                    8, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            0, 
                                            1, 
                                            {}
                                        ], 
                                        "oldext_package": [
                                            "oldext_package", 
                                            61, 
                                            5, 
                                            {
                                                "__init__-py": [
                                                    "__init__.py", 
                                                    26, 
                                                    2, 
                                                    {}
                                                ], 
                                                "submodule-py": [
                                                    "submodule.py", 
                                                    35, 
                                                    3, 
                                                    {}
                                                ]
                                            }
                                        ], 
                                        "oldext_simple-py": [
                                            "oldext_simple.py", 
                                            25, 
                                            2, 
                                            {}
                                        ]
                                    }
                                ], 
                                "importerror-py": [
                                    "importerror.py", 
                                    46, 
                                    3, 
                                    {}
                                ], 
                                "lib": [
                                    "lib", 
                                    84, 
                                    8, 
                                    {
                                        "python2-5": [
                                            "python2.5", 
                                            84, 
                                            8, 
                                            {
                                                "site-packages": [
                                                    "site-packages", 
                                                    84, 
                                                    8, 
                                                    {
                                                        "site_app-py": [
                                                            "site_app.py", 
                                                            42, 
                                                            4, 
                                                            {}
                                                        ], 
                                                        "site_package": [
                                                            "site_package", 
                                                            42, 
                                                            4, 
                                                            {
                                                                "__init__-py": [
                                                                    "__init__.py", 
                                                                    42, 
                                                                    4, 
                                                                    {}
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ], 
                                "main_app-py": [
                                    "main_app.py", 
                                    90, 
                                    5, 
                                    {}
                                ], 
                                "moduleapp": [
                                    "moduleapp", 
                                    605, 
                                    34, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            188, 
                                            8, 
                                            {}
                                        ], 
                                        "apps": [
                                            "apps", 
                                            417, 
                                            26, 
                                            {
                                                "__init__-py": [
                                                    "__init__.py", 
                                                    0, 
                                                    1, 
                                                    {}
                                                ], 
                                                "admin": [
                                                    "admin", 
                                                    259, 
                                                    15, 
                                                    {
                                                        "__init__-py": [
                                                            "__init__.py", 
                                                            259, 
                                                            15, 
                                                            {}
                                                        ]
                                                    }
                                                ], 
                                                "frontend": [
                                                    "frontend", 
                                                    158, 
                                                    10, 
                                                    {
                                                        "__init__-py": [
                                                            "__init__.py", 
                                                            158, 
                                                            10, 
                                                            {}
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ], 
                                "path": [
                                    "path", 
                                    42, 
                                    4, 
                                    {
                                        "installed_package": [
                                            "installed_package", 
                                            42, 
                                            4, 
                                            {
                                                "__init__-py": [
                                                    "__init__.py", 
                                                    42, 
                                                    4, 
                                                    {}
                                                ]
                                            }
                                        ]
                                    }
                                ], 
                                "subdomaintestmodule": [
                                    "subdomaintestmodule", 
                                    74, 
                                    5, 
                                    {
                                        "__init__-py": [
                                            "__init__.py", 
                                            74, 
                                            5, 
                                            {}
                                        ]
                                    }
                                ]
                            }
                        ], 
                        "testing-py": [
                            "testing.py", 
                            7385, 
                            244, 
                            {}
                        ], 
                        "views-py": [
                            "views.py", 
                            5092, 
                            170, 
                            {}
                        ]
                    }
                ], 
                "views-py": [
                    "views.py", 
                    5610, 
                    151, 
                    {}
                ], 
                "wrappers-py": [
                    "wrappers.py", 
                    5528, 
                    147, 
                    {}
                ]
            }
        ], 
        "run-tests-py": [
            "run-tests.py", 
            140, 
            6, 
            {}
        ], 
        "scripts": [
            "scripts", 
            30380, 
            937, 
            {
                "flask-07-upgrade-py": [
                    "flask-07-upgrade.py", 
                    10777, 
                    300, 
                    {}
                ], 
                "flaskext_compat-py": [
                    "flaskext_compat.py", 
                    5023, 
                    126, 
                    {}
                ], 
                "flaskext_test-py": [
                    "flaskext_test.py", 
                    9665, 
                    312, 
                    {}
                ], 
                "make-release-py": [
                    "make-release.py", 
                    4029, 
                    152, 
                    {}
                ], 
                "testproj": [
                    "testproj", 
                    886, 
                    47, 
                    {
                        "test-py": [
                            "test.py", 
                            886, 
                            47, 
                            {}
                        ]
                    }
                ]
            }
        ], 
        "setup-py": [
            "setup.py", 
            3074, 
            113, 
            {}
        ]
    }
];
    
function init_plots()
{
    init_code_hierarchy_plot("code_hierarchy",code_hierarchy_data);
};



 init_plots();

