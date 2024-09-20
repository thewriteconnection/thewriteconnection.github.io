$(document).ready(() => {
    $('#sources-area').show();
    $("#lit-graph").hide();
    $("#public-graph").hide();
    $("#extra-info-lit").hide();
    $("#extra-info-com").hide();

    $("#main-btn").click(()=>{
        $("#main-btn").addClass('active');
        $("#lit-btn").removeClass('active');
        $("#public-btn").removeClass('active');

        $('#sources-area').show();
        $("#lit-graph").hide();
        $("#public-graph").hide();
        $("#extra-info-lit").hide();
        $("#extra-info-com").hide();
    })
    $("#lit-btn").click(()=>{
        $("#main-btn").removeClass('active');
        $("#lit-btn").addClass('active');
        $("#public-btn").removeClass('active');

        $('#sources-area').hide();
        $("#lit-graph").show();
        $("#public-graph").hide();
        $("#extra-info-lit").hide();
        $("#extra-info-com").hide();
    })
    $("#public-btn").click(()=>{
        $("#main-btn").removeClass('active');
        $("#lit-btn").removeClass('active');
        $("#public-btn").addClass('active');

        $('#sources-area').hide();
        $("#lit-graph").hide();
        $("#public-graph").show();
        $("#extra-info-lit").hide();
        $("#extra-info-com").hide();
    })
    makeLitGraph();
    makeToolGraphs();
})


// literature graph
async function makeLitGraph() {
    // var data = $.csv.toObjects('data/V4-cleaned-lit-review.csv'):
    var data = await getCSVData('data/v5-cleaned-lit-review.csv')
    let dy = 18, dx=15, pad = 25;

    var width = 1000, height = 2000, margin=5;
    var svg = d3.select("#lit-graph").append("svg")
                .attr("width", width+2*margin)
                .attr("height",height+2*margin)
                

    var g = svg.selectAll(null)
            .data(data)
            .enter().append('g');
    
    var names = g.append("text")
                .text(function(d) {return d.Name;})
                .attr("x", function(d,i) { d.x = 150; return d.x; } )
                .attr("y", function(d,i) { d.y = dy*i+100; return d.y; } )
                .attr("font-size",12)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("class", "hoverable")
                .on("click", (e,d) => {showLitDetail(e,d)});
    
    var years = g.append("text")
        .text(function(d) {return d.Year;})
        .attr("x", function(d,i) { d.x = 190; return d.x; } )
        .attr("y", function(d,i) { d.y = dy*i+100; return d.y; } )
        .attr("font-size",12)
        .attr("text-anchor", "end")
        .attr("fill", "black");
    
    let categories = [{"name":'Aspect', "x": [], "y":0}, 
        {"name":'Object', "x": [], "y":0}, 
        {"name":'Target', "x": [], "y":0}, 
        {"name":'Device', "x": [], "y":0}, 
        {"name":'Fidelity', "x": [], "y":0}, 
        {"name":'Complexity', "x": [], "y":0}, 
        {"name":'Evaluation', "x": [], "y":0}, 
        {"name":'Collab-HH', "x": [], "y":0}, 
        {"name":'Collab-HM', "x": [], "y":0}
    ]
    // color scheme
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, categories.length + 1));


    let keys = Object.keys(data[0]);
    keys = keys.map((key,i) => {
        if (!(key == 'Name' | key == 'Year' | 
                key == 'x' | key == 'y' | key == '' |
                key == 'title' | key == 'bibtex' | key == 'link' |
                key == 'abstract')) {
            var text_arr = key.split('+');
            let category = categories[Number(text_arr[0])-1];
            let label = category.name;
            return {"category_n": Number(text_arr[0]),"category_label": label,"key": text_arr[1], "label":key}
        }
    }).filter((e) => {return e !== undefined});
    
    const xScale = d3.scaleLinear()
    		     .domain([0, keys.length-1])
    			 .range([0, dy*keys.length]);

    const labels = svg.selectAll('label')
                        .data(keys)
                        .enter()
                            .append('text')
                            .text((d)=>d.key)
                            .classed('rotation', true)
                            .attr('fill', 'black')
                            .attr('transform', (d,i)=>{
                                let pos = xScale(i)+pad*(d.category_n-1);
                                categories[d.category_n-1].x.push(pos);
                                d.x = pos;
                                return 'translate( '+pos+' , '+380+'),'+ 'rotate(-60)';})
                            .attr('x', 360)
                            .attr('y', 30)
                            .attr("font-size",12)
                            .attr("text-anchor", "start");

    const category_labels = svg.selectAll('category')
                                .data(categories)
                                .enter()
                                    .append('text')
                                    .text((d)=>d.name)
                                    .classed('rotation', true)
                                    .attr('fill', 'black')
                                    .attr('x', (d,i) => {
                                        let displacement = d.x.reduce((partialSum, a) => partialSum + a, 0) / d.x.length;
                                        return 200 + displacement - dx;
                                    })
                                    .attr('y', 20)
                                    .attr("font-weight",700)
                                    .attr("font-size",12)
                                    .attr("text-anchor", "start");
    
    
    // draw the boxes and color them in                                
    keys.forEach((e,i) => {
        let x_pos = e.x;
        var rect = g.append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("rx", 3)
                    .attr("ry", 3)
                    .attr('x', (d) => {
                        return 200+x_pos
                    })
                    .attr('y',function(d,i) {
                        d.y = dy*i+90;
                        return d.y;
                    })
                    .attr("fill", (d) => {
                        if (d[e.label] == "TRUE") {
                            return color(e.category_label)
                        } else {
                            return "#DCDCDC"
                        }
                    });
    })
}

async function makeToolGraphs() {
    $("#sunburst-area").hide();
    
    $("#grid-btn").click(() => {
        $("#grid-btn").addClass("active");
        $("#sunburst-btn").removeClass("active");

        $("#grid-area").show();
        $("#sunburst-area").hide();
    });
    $("#sunburst-btn").click(() => {
        $("#grid-btn").removeClass("active");
        $("#sunburst-btn").addClass("active");

        $("#grid-area").hide();
        $("#sunburst-area").show();
    });

    // grid graph
    gridGraph();
    // zoomable sunburst
    zoomableSunburst();
}

async function gridGraph() {
    var data = await getCSVData('data/v1-cleaned-commercial-tools.csv')
    let dy = 18, dx=15, pad = 25;
    var width = 800, height = 2300, margin=5;
    var svg = d3.select("#grid-graph").append("svg")
                .attr("width", width+2*margin)
                .attr("height",height+2*margin)
    // color scheme
    const theme_color = d3.scaleOrdinal(["#e76f51","#e9c46a","#9362B5","#67ABC3"]);

    var g = svg.selectAll(null)
            .data(data)
            .enter().append('g');
    
    var names = g.append("text")
                .text(function(d) {return d.tool_name;})
                .attr("x", function(d,i) { d.x = 140; return d.x; } )
                .attr("y", function(d,i) { d.y = dy*i+100; return d.y; } )
                .attr("font-size",12)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("class", "hoverable")
                .on("click", (e,d) => {showToolDetail(e,d)});
    
    var years = g.append("text")
                .text(function(d) {return d.type;})
                .attr("x", function(d,i) { d.x = 190; return d.x; } )
                .attr("y", function(d,i) { d.y = dy*i+100; return d.y; } )
                .attr("font-size",10)
                .attr("font-weight", 600)
                .attr("text-anchor", "end")
                .attr("fill", (d) => {return theme_color(d.type)});
    
    let categories = [{"name":'Aspect', "x": [], "y":0}, 
        {"name":'Object', "x": [], "y":0}, 
        {"name":'Device', "x": [], "y":0}, 
        {"name":'Complexity', "x": [], "y":0}, 
        {"name":'Collab-HH', "x": [], "y":0}, 
        {"name":'Collab-HM', "x": [], "y":0}
    ]
    // color scheme
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, categories.length + 1));


    let keys = Object.keys(data[0]);
    keys = keys.map((key,i) => {
        if (!(key == 'tool_name' | key == 'type' | 
                key == 'x' | key == 'y' | key == '' |
                key == 'desc_manual' | key == 'num_mention' | key == 'link')) {
            var text_arr = key.split('+');
            let category = categories[Number(text_arr[0])-1];
            let label = category.name;
            return {"category_n": Number(text_arr[0]),"category_label": label,"key": text_arr[1], "label":key}
        }
    }).filter((e) => {return e !== undefined});
    
    const xScale = d3.scaleLinear()
    		     .domain([0, keys.length-1])
    			 .range([0, dy*keys.length]);

    const labels = svg.selectAll('label')
                        .data(keys)
                        .enter()
                            .append('text')
                            .text((d)=>d.key)
                            .classed('rotation', true)
                            .attr('fill', 'black')
                            .attr('transform', (d,i)=>{
                                let pos = xScale(i)+pad*(d.category_n-1);
                                categories[d.category_n-1].x.push(pos);
                                d.x = pos;
                                return 'translate( '+pos+' , '+380+'),'+ 'rotate(-60)';})
                            .attr('x', 360)
                            .attr('y', 30)
                            .attr("font-size",12)
                            .attr("text-anchor", "start");
    const category_labels = svg.selectAll('category')
                                .data(categories)
                                .enter()
                                    .append('text')
                                    .text((d)=>d.name)
                                    .classed('rotation', true)
                                    .attr('fill', 'black')
                                    .attr('x', (d,i) => {
                                        let displacement = d.x.reduce((partialSum, a) => partialSum + a, 0) / d.x.length;
                                        return 200 + displacement - dx;
                                    })
                                    .attr('y', 20)
                                    .attr("font-weight",700)
                                    .attr("font-size",12)
                                    .attr("text-anchor", "start");
    
    
    // draw the boxes and color them in                                
    keys.forEach((e,i) => {
        let x_pos = e.x;
        var rect = g.append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("rx", 3)
                    .attr("ry", 3)
                    .attr('x', (d) => {
                        return 200+x_pos
                    })
                    .attr('y',function(d,i) {
                        d.y = dy*i+90;
                        return d.y;
                    })
                    .attr("fill", (d) => {
                        if (d[e.label] == "TRUE") {
                            return color(e.category_label)
                        } else {
                            return "#DCDCDC"
                        }
                    });
    })
}

async function zoomableSunburst() {
    // code adapted from: https://observablehq.com/@d3/zoomable-sunburst
    // get data
    var data = await getJSONData('data/public_tools.json')
    
    // Specify the chart’s dimensions.
    const width = 1000;
    const height = width;
    const radius = width / 8;
        
    // color scheme
    const color = d3.scaleOrdinal(["#e76f51","#e9c46a","#9362B5","#67ABC3"]);


    // Compute the layout.
    const hierarchy = d3.hierarchy(data)
        .sum(d => d.count)
        .sort((a, b) => b.value - a.value);
    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
    root.each(d => d.current = d);
    
    // Create the arc generator.
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
    
    // Create the SVG container.
    const svg = d3.select("#sunbusrt-graph").append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, width])
        .style("font", "8px sans-serif");
    
    // Append the arcs.
    const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
    
        .attr("d", d => arc(d.current));
    
    // Make them clickable if they have children.
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);
    
    const format = d3.format(",d");
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}`);
    
    const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);
    
    const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);
    
    // Handle zoom on click.
    function clicked(event, p) {
        parent.datum(p.parent || root);
    
        root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
        });
    
        const t = svg.transition().duration(750);
    
        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
            })
        .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.9 : 0.5) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 
    
            .attrTween("d", d => () => arc(d.current));
    
        label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }
    
    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
    
    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }
    
    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
    
    return svg.node();

}


function showLitDetail(e,d) {
    $( "#extra-title-lit" ).replaceWith(`<div class="my-2" id="extra-title-lit"><b>${d.title}</b></div>`);
    $( "#extra-abstract" ).replaceWith(`<div id="extra-abstract">${d.abstract}</div>`);
    $( "#extra-link-lit" ).replaceWith(`<div class="my-2" id="extra-link-lit"><a href="${d.link}">${d.link}</a></div>`);

    $("#extra-info-lit").show("slow");
}

function showToolDetail(e,d) {
    $( "#extra-title-com" ).replaceWith(`<div class="my-2" id="extra-title-com"><b>${d.tool_name}</b></div>`);
    // $( "#extra-usage" ).replaceWith(`<div id="extra-usage">${d.desc_manual}</div>`);
    $( "#extra-link-com" ).replaceWith(`<div class="my-2" id="extra-link-com"><a href="${d.link}">${d.link}</a></div>`);

    $("#extra-info-com").show("slow");
}

async function getCSVData(fname) {
    let data = await d3.csv(fname);
    return data
}

async function getJSONData(fname) {
    const data = await d3.json(fname);
    return data
}
