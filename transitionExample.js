// .on("click", function(d){
  // 	d3.select(this)
  // 		.transition()
  // 		.duration(1000)
  // 		.ease('linear')
  // 		// .attr("cx", width-xPadding)
  // 		.each("end", function(){
  // 			d3.select(this)
  // 				.transition()
  // 				.delay(500)
  // 				.duration(500)
  // 				.attr({
  // 					cx: xPadding
  // 				})
  // 		})
  // })
// .attr('fill', function (d) {
//     return "rgb(" + d.quantity + ",0,0)";

function bars(data)
{

    max = d3.max(data)

    x = d3.scale.linear()
        .domain([0, max])
        .range([0, w])

    y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, h], .2)


    var vis = d3.select("#barchart")

    var bars = vis.selectAll("rect.bar")
        .data(data)

    //update
    bars
        .attr("fill", "#0a0")
        .attr("stroke", "#050")

    //enter
    bars.enter()
        .append("svg:rect")
        .attr("class", "bar")
        .attr("fill", "#800")
        .attr("stroke", "#800")


    //exit
    bars.exit()
    .transition()
    .duration(300)
    .ease("exp")
        .attr("width", 0)
        .remove()

    bars
        .attr("stroke-width", 4)
    .transition()
    .duration(300)
    .ease("quad")
        .attr("width", x)
        .attr("height", y.rangeBand())
        .attr("transform", function(d,i) {
            return "translate(" + [0, y(i)] + ")"
        })

}


function init()
{

    //setup the svg
    var svg = d3.select("#svg")
        .attr("width", w+100)
        .attr("height", h+100)
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none")

    svg.append("svg:g")
        .attr("id", "barchart")
        .attr("transform", "translate(50,50)")

    //setup our ui
    d3.select("#data1")
        .on("click", function(d,i) {
            bars(data1)
        })
    d3.select("#data2")
        .on("click", function(d,i) {
            bars(data2)
        })
    d3.select("#random")
        .on("click", function(d,i) {
            num = document.getElementById("num").value
            bars(random(num))
        })


    //make the bars
    bars(data1)
}
