let matrix_lit, matrix_com;

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

///// Literature Tools
d3.csv("data/v5-cleaned-lit-review.csv").then(function (dataFamilyAttributes) {
    matrix_lit = new Matrix("chart-area", dataFamilyAttributes, dataMarriages, dataBusiness);
});

document.getElementById('lit-order').onchange = function () {
    matrix_lit.updateVis(this.value);
}


///// Commercial Tools
d3.csv("data/v1-cleaned-commercial-tools.csv").then(function (dataFamilyAttributes) {
    matrix_com = new Matrix("chart-area", dataFamilyAttributes, dataMarriages, dataBusiness);
});

document.getElementById('com-order').onchange = function () {
    matrix_com.updateVis(this.value);
}