function redraw(newChart){
  const  datasets = newChart.data,
         compareDates = newChart.compareDates,
         showTimeLine = newChart.showTimeLine,
         multifilter = newChart.multifilter,
         dates = newChart.dates,
         dataOption = newChart.dataOption,
         dataToShow = newChart.dataToShow,
         valuesToShow = newChart.data.valuesToShow,
         svgWidth = newChart.svgWidth,
         svgHeight = newChart.svgHeight,
         margin = newChart.margins,
         max = newChart.maxDomain,
         extent = newChart.timeExtent;

const chartWidth = svgWidth - margin.left - margin.right,
      chartHeight = svgHeight - margin.top - margin.bottom;

// generate titles
const dateRangeTitle = dateRangeText(dates[0]),
      dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);

// set titles
d3.select("#daterange-title")
  .text(dateRangeTitle);

d3.select("#data-title")
  .text(dataTitle);


  // setting scales dynamically
  if (multifilter && showTimeLine) {
          var	parseDate = d3.time.format("%m/%d/%y").parse;

          dataset[0].forEach(function(d){d.date = parseDate(d.date);});

          var	x0 = d3.time.scale().range([0, width])
                                  .domain(extent);

          var x1 = d3.scale.ordinal()
                           .domain(valuesToShow).rangeRoundBands([0, x0.rangeBand()]);

          var y = d3.scale.linear()
                          .range([chartHeight, 0])
                          .domain([0, max]);

          var colorRange = valuesToShow.length===2 ? ["#6b486b", "#a05d56"] : ["#6b486b", "#a05d56", "#d0743c"];
          var color = d3.scale.ordinal()
                              .range(colorRange);

        var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

        var date = svg.selectAll(".date")
            .data(dataset[0])
          .enter().append("g")
            .attr("class", "date")
            .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });

        date.selectAll("rect")
            .data(function(d) { return d.values; })
          .enter().append("rect")
          .transition()
          .duration(300)
          .ease("exp")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(valuesToShow.slice().reverse())
          .enter().append("g")
          .transition()
          .duration(300)
          .ease("exp")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.exit()
            .transition()
            .duration(300)
            .ease("exp")
                .attr("width", 0)
                .remove();

  } else if (multifilter && !showTimeLine) {

          var y0 = d3.scale.ordinal()
                             .rangeRoundBands([chartHeight, 0], .1)
                             .domain(data.map(function(d) { return d.name; }));

            var y1 = d3.scale.ordinal()
                             .domain(valuesToShow).rangeRoundBands([0, y0.rangeBand()]);

            var x = d3.scale.linear()
                .range([0, chartWidth])
                .domain([0, max]);

            var colorRange = valuesToShow.length===2 ? ["#6b486b", "#a05d56"] : ["#6b486b", "#a05d56", "#d0743c"];
            var color = d3.scale.ordinal()
                                .range(colorRange);

            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

            var yAxis = d3.svg.axis()
            .scale(y0)
            .orient("left");

            var date = svg.selectAll(".item")
                .data(dataset[0])
              .enter().append("g")
                .attr("class", "item")
                .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

            date.selectAll("rect")
                .data(function(d) { return d.values; })
              .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return x1(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .style("fill", function(d) { return color(d.name); });

            var legend = svg.selectAll(".legend")
                .data(valuesToShow.slice().reverse())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

  } else if (!multifilter && !showTimeLine) {

                var x = d3.scale.linear()
                          .range([0, chartWidth])
                          .domain([0, max]);

                var y = d3.scale.ordinal()
                          .rangeRoundBands([0,chartHeight], .05)
                          .domain(dataset[0].map(function (d) {
                              return d.name;
                          }));

                var yDomainData = dataset[0].map(function (d) {
                    return d.name;
                });

                var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

                var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

                // update x axis
                svg.selectAll("x.axis")
                    .attr('transform', 'translate(0,' + chartHeight + ')')
                    .call(xAxis)
                    // .attr("dx", "-.8em")
                    // .attr("dy", ".15em")
                    .text('Quantity'); // make dynamic!

                //update y axis (!showTimeLine)
                svg.selectAll("y.axis")
                    .call(yAxis);

                svg.selectAll('.axis line, .axis path')
                    .style({
                        'stroke': 'Black',
                        'fill': 'none',
                        'stroke-width': '1px',
                        'shape-rendering': 'crispEdges'
                    });

                    // add numbers in bars
                    svg.selectAll(".text")
                        .data(dataset[0])
                        .enter()
                        .append('text')
                        .transition()
                        .duration(300)
                        .ease("exp")
                        .attr("y", function (d) {
                          var yVal = y(d.name);
                          var rangeBand = y.rangeBand();
                            return y(d.name) + y.rangeBand() / 2 ;
                        })
                        .attr("x", function (d) {
                          var xVal = x(d.value);
                            return x(d.value) - 2;
                        })
                        .attr("dy", "0.3em")
                        .text(function (d) {
                            return d.value;
                        })
                        .attr('class', 'text')
                        .attr('font-family', 'sans-serif')
                        .attr('font-size', '11px')
                        .attr('text-anchor', 'end')
                        .attr('fill', 'white');
                        .exit()
                        .transition()
                        .duration(300)
                        .ease("exp")
                            .attr("width", 0)
                            .remove();
                // add bars
                var bar = svg.selectAll(".bar")
                    .data(dataset[0])
                    .enter()
                    // .append("a")
                    // .attr("xlink:href", function (d) {
                    //     var s = d.product.replace(/\s/g, '%20');
                    //     return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
                    // })
                    // .attr("style", "text-decoration: none;")
                    .append("rect") // change .append("g") to .append("rect").
                    .transition()
                    .duration(300)
                    .ease("exp")
                    .attr("y", function (d) {
                        var yVal = y(d.name);
                        return y(d.name);
                    })
                    .attr("height", y.rangeBand())
                    .attr("width", function (d) {
                      var xVal = x(d.value);
                        return x(d.value);
                    })
                    .attr('fill', "green")
                    .on("mouseover", function(d){
                  			d3.select(this).attr("fill", "orange");
                  		})
                		.on("mouseout", function(d){
                			d3.select(this).attr("fill", "green");
                		});
                    .exit()
                    .transition()
                    .duration(300)
                    .ease("exp")
                        .attr("width", 0)
                        .remove();


  } else if (!multifilter && showTimeLine) {

                var	parseDate = d3.time.format("%m/%d/%y").parse;

                dataset[0].forEach(function(d){d.date = parseDate(d.date);});

                var y = d3.scale.linear()
                      .range([chartHeight, 0])
                      .domain([0, max]);

                var	x = d3.time.scale().range([0, width])
                                          .domain(extent);

                var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

                var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

  }


//****************PREVIOUS CODE **************************************
// Set x scale.
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, max]);

// Set y scale
var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .05)
    .domain(dataset.map(function (d) {
        return d.name;
    }));



// set xAxis based on new scale
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// set yAxis based on new scale
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// call x axis and append text (only if bars sideways)
d3.selectAll('x.axis')
    .call(xAxis)
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    .append("text")
    .style("text-anchor", "end")
    .attr("x",width)
    .attr("dy",-5)
    .style("font-style","italic")
    .text('Quantity');

// call y axis and append text (only if bars going up)
d3.selectAll('y.axis')
    .call(yAxis)
    // Text for Y-axis for bars going up
    // .append('text')
    // .attr('transform', 'rotate(-90)')
    // .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
    // .attr('x', -(height - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
    // .attr('dy', '.71em')
    // .style('text-anchor', 'end')

// create axis lines
svg.selectAll('.axis line, .axis path')
    .style({
        'stroke': 'Black',
        'fill': 'none',
        'stroke-width': '1px',
        'shape-rendering': 'crispEdges'
    });

// create and attach bars to chart
var bar = svg.selectAll(".bar")
    .data(dataset)
    .enter()
    // .append("a")
    // .attr("xlink:href", function (d) {
    //     var s = d.product.replace(/\s/g, '%20');
    //     return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
    // })
    // .attr("style", "text-decoration: none;")
    .append("rect") // change .append("g") to .append("rect").
    .transition()
    .duration(300)
    .ease("exp")
    .attr("y", function (d) {
        return y(d.product);
    })
    .attr("height", y.rangeBand())
    .attr("width", function (d) {
        return x(d.quantity);
    })
    .attr('fill', "green")
  .on("mouseover", function(d){
			d3.select(this).attr("fill", "orange");
		})
		.on("mouseout", function(d){
			d3.select(this).attr("fill", "green");
		})
    .exit()
    .transition()
    .duration(300)
    .ease("exp")
        .attr("width", 0)
        .remove();

// add numbers in bars
svg.selectAll(".text")
    .data(dataset)
    .enter()
    .append('text')
    .attr("y", function (d) {
        return y(d.product) + y.rangeBand() / 2 ;
    })
    .attr("x", function (d) {
        return x(d.quantity) - 2;
    })
    .attr("dy", "0.3em")
    .text(function (d) {
        return d.quantity;
    })
    .attr('class', 'text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('text-anchor', 'end')
    .attr('fill', 'white');
}
