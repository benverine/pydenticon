
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, {position: 'right', margin: 10});
    trees("Brandi");
    document.getElementById("input").focus();
});

d3.select("#input")
    .on("keyup", d=> {
        trees(d3.select("#input").property("value"));
        document.getElementById("donate").className += "scale-in";
        document.getElementById("pngButton").className += "scale-in";
    });

var pngButton = d3.select("#pngButton")
    .on("click", svg2png);

var svg = d3.select("#treehouse");
var depthLimit = 11;
var width = 400;
var height = 600;
var hash;
var counter = 0;
var colorMap;
var lumScale = d3.scaleLinear().domain([0,15]).range([0,100]);
var abScale = d3.scaleLinear().domain([0,15]).range([-100,100]);
var hashbrown = new jsSHA("SHA3-512", "TEXT");

function svg2png(){
    saveSvgAsPng(document.getElementById("treehouse"), `${d3.select("#input").property("value")}.png`, {scale:3, backgroundColor: "white"});
}

function trees(string){
    counter = 0;
    svg.selectAll("path").remove();
    hashbrown.update(string);
    hash = hashbrown.getHash("HEX");
    var a1 = abScale(charToHex(hash.charAt(0)));
    var b1 = abScale(charToHex(hash.charAt(1)));
    var a2 = abScale(charToHex(hash.charAt(2)));
    var b2 = abScale(charToHex(hash.charAt(3)));
    colorMap = d3.scaleLinear().domain([0,15]).range([d3.lab(10, a1, b1), d3.lab(90, a2, b2)]);
    drawTree(250, 400, 350, 400, 0);
    hashbrown = new jsSHA("SHA3-512", "TEXT");

}

function charToHex(char){
    return parseInt(`0x${char}`);
}

function drawTree(x1, y1, x2, y2, depth) {
    if(counter > 127){
        counter = 0;
    }
    let index = charToHex(hash.charAt(counter));
    let branch = index;
 
    if (depth == depthLimit)
        return;

    var dx = x2 - x1;
    var dy = y1 - y2;

    var x3 = x2 - dy;
    var y3 = y2 - dx;
    var x4 = x1 - dy;
    var y4 = y1 - dx;
    var x5 = x4 + 0.5 * (dx - dy);
    var y5 = y4 - 0.5 * (dx + dy);

    svg
        .append("path")
        .attr("d", `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} L ${x1} ${y1}`)
        .attr("fill", "white")
        .transition()
        .delay(d=>{
            let filter = d3.scaleLinear().domain([0, depthLimit]).range([0, 1500]);
            return filter(depth);
        })
        .duration(1000)
        .attr("fill", colorMap(index));
    counter++;
    if (depth > 1){
        if(branch == 1){
            drawTree(x4, y4, x5, y5, depth + 1);
        } else if (branch==2){
            drawTree(x5, y5, x3, y3, depth + 1);
        } else {
            drawTree(x4, y4, x5, y5, depth + 1);
            drawTree(x5, y5, x3, y3, depth + 1);
        }
    } else {
        drawTree(x4, y4, x5, y5, depth + 1);
        drawTree(x5, y5, x3, y3, depth + 1);
    }
}