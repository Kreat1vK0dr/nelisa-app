$(document).ready(function () {
    if (window.location.pathname === '/graphs') {
        // $.get('/data/sales.json',function(data){
        $.get('/graphs/data', function (data) {
            // window.location.pathname='/graphs';
            console.log('pathname =', window.location.pathname);
            console.log(JSON.parse(data));
            const dataGet = JSON.parse(data);
            const dataset = dataGet.data;
            console.log("Dataset first quantity", dataset[0].quantity);

            var margin = {
                    top: 20,
                    right: 30,
                    bottom: 40,
                    left: 50
                },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var svg = d3.select(".chart")
                .attr("width", 960 + margin.left + margin.right)
                .attr("height", 500 + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var barWidth = width / dataset.length;

            var y = d3.scale.linear()
                .range([height, 0])
                .domain([0, d3.max(dataset, function (d) {
                    return d.quantity;
                })]);

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .05)
                .domain(dataset.map(function (d) {
                    return d.product;
                }));

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            svg.append("g")
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-25)");
            //  .append("text")
            //  .text('Products');

            svg.append("g")
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
                .attr('x', -(height - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text("Quantity");

            //  chart.append("g")
            //    .attr("class", "y axis")
            //    .call(yAxis)
            //  .append("text")
            //    .attr("transform", "rotate(-90)")
            //    .attr("x", -height/2)
            //    .attr("y", -margin.bottom)
            //    .attr("dy", ".71em")
            //    .style("text-anchor", "end")
            //    .text("YAxis");

            svg.selectAll('.axis line, .axis path')
                .style({
                    'stroke': 'Black',
                    'fill': 'none',
                    'stroke-width': '1px',
                    'shape-rendering': 'crispEdges'
                });
            // var bar = svg.selectAll("g") ...This won't work because we have already appended g elements! Must choose a new element that does not yet exist.
            //  .data(dataset)
            //  .enter()
            //  .append("g")
            // //  .attr("transform", function(d, i) { return "translate(" + x(d.product) + ",0)"; })
            //  .append("a")
            //  .attr("xlink:href", function(d){var s = d.product.replace(/\s/g,'%20'); return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q='+s;})
            //  .attr("style","text-decoration: none;");

            var bar = svg.selectAll(".bar")
                .data(dataset)
                .enter()
                .append("a")
                .attr("xlink:href", function (d) {
                    var s = d.product.replace(/\s/g, '%20');
                    return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
                })
                .attr("style", "text-decoration: none;")
                .append("rect") // change .append("g") to .append("rect").
                // attr("transform") is no longer required here. We can now simply use attr("x",...)
                //  .attr("transform", function(d, i) { return "translate(" + x(d.product) + ",0)"; })
                .attr('x', function (d) {
                    return x(d.product);
                })
                .attr("y", function (d) {
                    return y(d.quantity);
                })
                .attr("height", function (d) {
                    return height - y(d.quantity);
                })
                .attr("width", x.rangeBand())
                .attr('fill', function (d) {
                    return "rgb(" + d.quantity + ",0,0)";
                });


            // SHIFT THIS CODE to ABOVE under svg.selectAll(".bar")
            // bar.append("rect")
            // .attr('x', function(d) {return x(d.product); })
            // .attr("y", function(d) { return y(d.quantity); })
            // .attr("height", function(d) { return height - y(d.quantity); })
            // .attr("width", x.rangeBand())
            // .attr('fill', function(d){return "rgb("+ d.quantity +",0,0)";});
            // .on('click',function(d,i){})

            //THIS does NOT WORK because we already have text divs above. must create new text CLASS
            // bar.append("text")
            //     .attr("x", x.rangeBand() / 2)
            //     .attr("y", function(d) { return y(d.quantity) + 3; })
            //     .attr("dy", "1.5em")
            //     .text(function(d) { return d.quantity; })
            //     .attr('font-family','sans-serif')
            //     .attr('font-size','11px')
            //     .attr('text-anchor', 'middle')
            //     .attr('fill', 'white');
            console.log("This is x(dataset[0].quantity)", x(dataset[0].product));

            svg.selectAll(".text")
                .data(dataset)
                .enter()
                .append('text')
                .attr("x", function (d) {
                    return x(d.product) + x.rangeBand() / 2;
                })
                .attr("y", function (d) {
                    return y(d.quantity) + 3;
                })
                .attr("dy", "1.5em")
                .text(function (d) {
                    return d.quantity;
                })
                .attr('class', 'text')
                .attr('font-family', 'sans-serif')
                .attr('font-size', '11px')
                .attr('text-anchor', 'middle')
                .attr('fill', 'white');


        });

    }
});
