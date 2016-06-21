$(document).ready(function () {

if (window.location.pathname.split('/')[1] === 'graphs') {
    var dateFrom, dateTo, dateFromCompare, dateToCompare, compareDates = [],
        compareDatesChosen;

    // $("#from").change(function(){
    //   dateFrom = convertDate($(this).val());
    //   console.log("new date", dateFrom);
    // });
    // $("#to").change(function(){
    //   dateTo = convertDate($(this).val());
    //   console.log("new date", dateTo);
    // });
    // $("#from-compare").change(function(){
    //   dateFromCompare = convertDate($(this).val());
    //   compareDates.push(dateFromCompare);
    //   console.log("new date", dateFromCompare);
    // });
    // $("#to-compare").change(function(){
    //   dateToCompare = convertDate($(this).val());
    //   compareDates.push(dateToCompare);
    //   console.log("new date", dateToCompare);
    // });
    $("#period-compare-btn").click(function () {
        $("#period-compare").css("display", "inline-block");
        $(this).css("display", "none");
        $("#break-line").toggle(true);
    });

    $("#cancel-period-compare").click(function () {
        $("#from-compare").val("");
        $("#to-compare").val("");
        $("#period-compare").css("display", "none");
        $("#period-compare-btn").css("display", "inline-block");
        $("#break-line").toggle(false);
    });

    $("#product-btn").click(function () {
        $("#data-select").toggle(false);
        $("#product-select").toggle(true);
        $("#category-select").toggle(false);
    });

    $("#category-btn").click(function () {
        $("#data-select").toggle(false);
        $("#product-select").toggle(false);
        $("#category-select").toggle(true);
    });

    $(".cancel-data-select").click(function () {
        $("#category-select").toggle(false);
        $("#product-select").toggle(false);
        $("#data-select").toggle(true);
        $("#data-select label").toggleClass("active", false);
    });

    $("#value-btn").click(function () {
        $("#filter-select").toggle(false);
        $("#data-value-filter").toggle(true);
    });
    $("#quantity-btn").click(function () {
        $("#filter-select").toggle(false);
        $("#data-quantity-filter").toggle(true);
    });
    $(".cancel-filter-select").click(function () {
        $("#data-value-filter").toggle(false);
        $("#data-quantity-filter").toggle(false);
        $("#data-filter label").toggleClass("active", false);
        $("#filter-select").toggle(true);
    });

$('#show-chart-btn').on('click', function (e) {
          e.preventDefault();
          console.log("press show chart button");

              // d3.select("svg").remove();

      var dataToSend = getDataToSend();

      $.post('/graphs/data', dataToSend, function (dataReceived) {
          console.log('pathname =', window.location.pathname);
          const received = JSON.parse(dataReceived);
          // const showCost = data.valuesToShow.indexOf("cost") === -1;
          // const showRevenue = data.valuesToShow.indexOf("revenue") === -1;
          // const showProfit = data.valuesToShow.indexOf("profit") === -1;
          // const showSales = data.valuesToShow.indexOf("sold") === -1;
          // const showPurchases = data.valuesToShow.indexOf("purchased") === -1;
          const dataset = retrieveData(received.dataset, received.compareDates, received.dataOption, received.valuesToShow);

          var winW = window.innerWidth - 200;
          var margin = {
               top: 65,
               right: 30,
               bottom: 40,
               left: received.showTimeLine ? 50 : 225
           };
           const maxDomain = getMaxDomain(dataset, received.multifilter);
           const timeExtent = getTimeScaleExtent(dataset, received.compareDates, received.showTimeLine);

          var svgWidth = 800,
              svgHeight = 500;

          const chartWidth = svgWidth - margin.left - margin.right,
                chartHeight = svgHeight - margin.top - margin.bottom;

          var newChart = {
                         dataset: dataset,
                         compareDates: received.compareDateRange,
                         showTimeLine: received.showTimeLine,
                         multifilter: received.multifilter,
                         dates: received.dates,
                         dataOption: received.dataOption,
                         dataToShow: received.dataToShow,
                         valuesToShow: received.valuesToShow,
                         chartHeight: chartHeight,
                         chartWidth: chartWidth,
                         margins: margin,
                         maxDomain: maxDomain,
                         timeExtent: timeExtent,
                        };

          var firstChart = $(".chart").length===0,
              newChartId;
              // newChartId = createNewId(getLastId());

          if (firstChart) {
            newChartId = createNewId(getLastId());
            d3.select("center").append("svg")
                         .attr('class', 'chart')
                         .attr('id', 'svg-'+newChartId);

                        //  .attr("id", newChartId);
            newChart.svg = d3.select("#svg-"+"chart1")
                .attr("width", svgWidth /*+ margin.left + margin.right*/)
                .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
                .append('g')
                .attr("id", newChartId)
                .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');
            newChart.newChartId = newChartId;
            addChart(newChart);
          } else {
            newChart.svg = d3.select("#svg-"+"chart1")
                              .attr("width", svgWidth /*+ margin.left + margin.right*/)
                              .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
                            .select("#"+"chart1")
                            .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');

            redraw(newChart);
          }
      });
});

}// !-- window.location.path == /graphs

function addChart(newChart) {
const  dataset = newChart.dataset,
       compareDates = newChart.compareDates,
       showTimeLine = newChart.showTimeLine,
       multifilter = newChart.multifilter,
       dates = newChart.dates,
       dataOption = newChart.dataOption,
       dataToShow = newChart.dataToShow,
       valuesToShow = newChart.valuesToShow,
       svg = newChart.svg,
       chartHeight = newChart.chartHeight,
       chartWidth = newChart.chartWidth,
       margin = newChart.margins;
       max = newChart.maxDomain;
       extent = newChart.timeExtent;

// set titles
const dateRangeTitle = dateRangeText(dates[0]),
      dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);

svg.append("text")
        .attr("id","daterange-title")
        .attr("x", (chartWidth - margin.left)/2)
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(dateRangeTitle);

svg.append("text")
        .attr("id","data-title")
        .attr("x", (chartWidth - margin.left)/2)
        .attr("y", 0 - (margin.top - 40))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-style", "italic")
        .text(dataTitle);

// implement compare date functionality here...
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

              svg.append("g")
                  .attr('class', 'x axis')
                  .attr('transform', 'translate(0,' + chartHeight + ')')
                  .call(xAxis)
                  // .attr("dx", "-.8em")
                  // .attr("dy", ".15em")
                  .append("text")
                  .style("text-anchor", "end")
                  .attr("x",chartWidth)
                  .attr("dy",-5)
                  .style("font-style","italic")
                  .text('Quantity'); // make dynamic!

              //create y axis (!showTimeLine)
              svg.append("g")
                  .attr('class', 'y axis')
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

              // add bars
              var bars = svg.selectAll("rect.bar")
                  .data(dataset[0]);
                  // entering bars
              bars.enter()
                  // .append("a")
                  // .attr("xlink:href", function (d) {
                  //     var s = d.product.replace(/\s/g, '%20');
                  //     return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
                  // })
                  // .attr("style", "text-decoration: none;")
                  .append("rect") // change .append("g") to .append("rect").
                  .attr("class","bar") // change .append("g") to .append("rect").
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
// !--!multfilter && showTimeLine

// NEXT TASK IS TO APPLY THE FOLLOWING TO YOUR CODE
// var state = svg.selectAll(".state")
//     .data(data)
//   .enter().append("g")
//     .attr("class", "state")
//     .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });
//
// state.selectAll("rect")
//     .data(function(d) { return d.ages; })
//   .enter().append("rect")
//     .attr("width", x1.rangeBand())
//     .attr("x", function(d) { return x1(d.name); })
//     .attr("y", function(d) { return y(d.value); })
//     .attr("height", function(d) { return height - y(d.value); })
//     .style("fill", function(d) { return color(d.name); });
//
// var legend = svg.selectAll(".legend")
//     .data(ageNames.slice().reverse())
//   .enter().append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
// legend.append("rect")
//     .attr("x", width - 18)
//     .attr("width", 18)
//     .attr("height", 18)
//     .style("fill", color);
//
// legend.append("text")
//     .attr("x", width - 24)
//     .attr("y", 9)
//     .attr("dy", ".35em")
//     .style("text-anchor", "end")
//     .text(function(d) { return d; });


/////////////////////////////////////////////////////////////////////////////////

// create x axis (!showTimeLine)
// svg.append("g")
//     .attr('class', 'x axis')
//     .attr('transform', 'translate(0,' + chartHeight + ')')
//     .call(xAxis)
//     // .attr("dx", "-.8em")
//     // .attr("dy", ".15em")
//     .append("text")
//     .style("text-anchor", "end")
//     .attr("x",chartWidth)
//     .attr("dy",-5)
//     .style("font-style","italic")
//     .text('Quantity'); // make dynamic!
//
// //create y axis (!showTimeLine)
// svg.append("g")
//     .attr('class', 'y axis')
//     .call(yAxis);
//
// svg.selectAll('.axis line, .axis path')
//     .style({
//         'stroke': 'Black',
//         'fill': 'none',
//         'stroke-width': '1px',
//         'shape-rendering': 'crispEdges'
//     });
//
// // add bars
// var bar = svg.selectAll(".bar")
//     .data(dataset[0])
//     .enter()
//     // .append("a")
//     // .attr("xlink:href", function (d) {
//     //     var s = d.product.replace(/\s/g, '%20');
//     //     return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
//     // })
//     // .attr("style", "text-decoration: none;")
//     .append("rect") // change .append("g") to .append("rect").
//     .attr("y", function (d) {
//         return y(d.name);
//     })
//     .attr("height", y.rangeBand())
//     .attr("width", function (d) {
//         return x(d.value);
//     })
//     .attr('fill', "green")
//     .on("mouseover", function(d){
//   			d3.select(this).attr("fill", "orange");
//   		})
// 		.on("mouseout", function(d){
// 			d3.select(this).attr("fill", "green");
// 		});
//
// // add numbers in bars
// svg.selectAll(".text")
//     .data(dataset[0])
//     .enter()
//     .append('text')
//     .attr("y", function (d) {
//         return y(d.name) + y.rangeBand() / 2 ;
//     })
//     .attr("x", function (d) {
//         return x(d.value) - 2;
//     })
//     .attr("dy", "0.3em")
//     .text(function (d) {
//         return d.value;
//     })
//     .attr('class', 'text')
//     .attr('font-family', 'sans-serif')
//     .attr('font-size', '11px')
//     .attr('text-anchor', 'end')
//     .attr('fill', 'white');

} // !-- add chart

function redraw(newChart){
  const  dataset = newChart.dataset,
         compareDates = newChart.compareDates,
         showTimeLine = newChart.showTimeLine,
         multifilter = newChart.multifilter,
         dates = newChart.dates,
         dataOption = newChart.dataOption,
         dataToShow = newChart.dataToShow,
         valuesToShow = newChart.valuesToShow,
         svg = newChart.svg,
         chartHeight = newChart.chartHeight,
         chartWidth = newChart.chartWidth,
         margin = newChart.margins,
         max = newChart.maxDomain,
         extent = newChart.timeExtent;

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
            svg.selectAll("g.x.axis")
                // .attr('transform', 'translate(0,' + chartHeight + ')')
                .transition().duration(300).ease("sin-in-out")
                .call(xAxis);

                    // .attr("dx", "-.8em")
                    // .attr("dy", ".15em")
                    // .text('Quantity'); // make dynamic!

                //update y axis (!showTimeLine)
                svg.selectAll("g.y.axis")
                   .transition().duration(300).ease("sin-in-out")
                    .call(yAxis);


                svg.selectAll('.axis line, .axis path')
                    .style({
                        'stroke': 'Black',
                        'fill': 'none',
                        'stroke-width': '1px',
                        'shape-rendering': 'crispEdges'
                    });

                    // add numbers in bars
                // var numbers = svg.selectAll(".text")
                //         .data(dataset[0]);
                //
                //  numbers.enter()
                //         .append('text')
                //         .attr('class', 'text')
                //         .attr('font-family', 'sans-serif')
                //         .attr('font-size', '11px')
                //         .attr('text-anchor', 'end')
                //         .attr('fill', 'white');
                //
                //  numbers.transition()
                //         .duration(300)
                //         .ease("exp")
                //         .attr("y", function (d) {
                //           var yVal = y(d.name);
                //           var rangeBand = y.rangeBand();
                //             return y(d.name) + y.rangeBand() / 2 ;
                //         })
                //         .attr("x", function (d) {
                //           var xVal = x(d.value);
                //             return x(d.value) - 2;
                //         })
                //         .attr("dy", "0.3em")
                //         .text(function (d) {
                //             return d.value;
                //         })
                //
                //   numbers.exit()
                //         .transition()
                //         .duration(300)
                //         .ease("exp")
                //             .attr("width", 0)
                //             .remove();
                // add bars
                var bars = svg.selectAll("rect.bar")
                    .data(dataset[0]);

                bars.enter()
                    // .append("a")
                    // .attr("xlink:href", function (d) {
                    //     var s = d.product.replace(/\s/g, '%20');
                    //     return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
                    // })
                    // .attr("style", "text-decoration: none;")
                    .append("rect") // change .append("g") to .append("rect").
                    .attr("class","bar")
                    .attr('fill', "green")
                    .on("mouseover", function(d){
                        d3.select(this).attr("fill", "orange");
                      })
                    .on("mouseout", function(d){
                      d3.select(this).attr("fill", "green");
                    });


            bars.exit()
                // .transition()
                // .duration(300)
                // .ease("exp")
                //     .attr("width", 0)
                    .remove();

                bars.transition()
                    .duration(300)
                    .ease("quad")
                    .attr("y", function (d) {
                        var yVal = y(d.name);
                        return y(d.name);
                    })
                    .attr("height", y.rangeBand())
                    .attr("width", function (d) {
                      var xVal = x(d.value);
                        return x(d.value);
                    });




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
}
// end redraw

function getTimeScaleExtent(dataset, compareDates, showTimeLine) {
  var extent, extent1, extent2;
if (compareDates && showTimeLine) {
  extent1 = d3.extent(dataset[0], function(d) { return d.date; });
  extent2 = d3.extent(dataset[1], function(d) { return d.date; });
return [extent1,extent2];
} else if (!compareDates && showTimeLine) {
  extent = d3.extent(dataset[0], function(d) { return d.date; });
  return extent;
}
}

function getMaxDomain(dataset, multifilter, compareDates) {
var max,
    max1,
    max2;

if (multifilter && !compareDates) {
    max = d3.max(dataset[0], function(d) { return d3.max(d.values, function(d) { return d.value; }); });
    return max;

} else if (!multifilter && !compareDates){
    max = d3.max(dataset[0], function (d) {
        return d.value;
    });
    return max;
} else if (multifilter && compareDates) {
      max1 = d3.max(dataset[0], function(d) { return d3.max(d.values, function(d) { return d.value; }); });
      max2 = d3.max(dataset[1], function(d) { return d3.max(d.values, function(d) { return d.value; }); });
      return [max1,max2];
} else if (!multifilter && compareDates) {
      max1 = d3.max(dataset[0], function (d) {
          return d.value;
      });
      max2 = d3.max(dataset[1], function (d) {
          return d.value;
      });
      return [max1,max2];
}
}

function monthText(monthIndex) {
  switch(monthIndex) {
    case 1: return "Jan";
    case 2: return "Feb";
    case 3: return "Mar";
    case 4: return "Apr";
    case 5: return "May";
    case 6: return "Jun";
    case 7: return "Jul";
    case 8: return "Aug";
    case 9: return "Sep";
    case 10: return "Oct";
    case 11: return "Nov";
    case 12: return "Dec";
    default: return null;
  }
}

function dateRestructure(match, month, day, year){
  var textMonth = monthText(Number(month));
  var textYear = year.replace(/d{2}(d{2})/,"'$1");
  return day+" "+textMonth+" "+textYear;
}

function dateReadable(date){
return date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, dateRestructure);
}

function dateRangeText(dates){
return dateReadable(dates[0])+" - "+dateReadable(dates[1]);
}

function dataTitleText(dataOption, dataToShow, valuesToShow) {
var title,
    valueText,
    values = "",
    quantity;
valuesToShow.forEach(function(value){values += value+", ";});
quantity = valuesToShow[0]==="sold"||"purchased" ? "quantity " : "";
valueText = "Showing "+quantity+values.replace(/, $/,"")+" for ";
var displayAll = dataToShow === "all";
  if (dataOption==='product') {
    title = displayAll ? valueText+"all products" : valueText+dataToShow;
  } else if (dataOption==='category') {
   title = displayAll ? valueText+"all categories" : valueText+dataToShow;
  }
  return title;
}

  function convertDate(date) {
    return date.replace(/(\d+)-(\d+)-(\d+)/g, "$2/$1/$3");
  }

  function getDataToSend() {
                  var filter = getFilterSelection(),
                      data = getDataSelection(),

                  dataToSend = {
                      inputDates: getInputDates(),
                      dataOption: data[0],
                      dataSelection: data[1],
                      filterOption: filter[0],
                      filterSelection: filter[1]
                  };

                  console.log("THIS is datatosend", dataToSend);
                  return dataToSend;
  }

  function getFilterSelection(){
    var inputFilter = $("#data-filter label.active input[name='data-filter']").val(),
        inputFilterSelection = [];

    if (inputFilter === "value") {
        $("#data-filter label.active input[name='data-value']").each(function () {
            inputFilterSelection.push($(this).val());
        });
    } else if (inputFilter === "quantity") {
        $("#data-filter label.active input[name='data-quantity']").each(function () {
            inputFilterSelection.push($(this).val());
        });
    }
  return [inputFilter, inputFilterSelection];
  }

  function getDataSelection() {
    var inputDataSelection,
        selection,
        inputDataType = $("#type-select label.active input").val();

    if (inputDataType === "product") {
        selection = $("select[name='product']").val();
    } else if (inputDataType === "category") {
        selection = $("select[name='product']").val();
    }
    inputDataSelection = selection === "all" ? selection : Number(selection);

    return [inputDataType, inputDataSelection];
  }

  function getInputDates() {
    var inputDates = [];
    $(".date-input").each(function () {
        if ($(this).val() != "") inputDates.push(convertDate($(this).val()));
    });
    return inputDates;
  }
function valuesToShowArray(valuesToShow){

}
  function setDataPoints(valuesToShow, data, dataOption) {
    var showingProducts = dataOption==="product" ? true : false;
    var showMultiVal = valuesToShow.length > 1;
    var showAmount = valuesToShow[0] === "cost" || valuesToShow[0] === "revenue" || valuesToShow[0] === "profit";
    var showQuantity = valuesToShow[0] === "sold" || valuesToShow[0] === "purchased";

    if (!showMultiVal && showQuantity) {
        return data.map(function (d) {
            d.value = d.quantity;
            d.name = showingProducts ? d.product : d.category;
            return d;
        }).sort(sortData);
    } else if (!showMultiVal && showAmount) {
        return data.map(function (d) {
            d.value = d[valuesToShow[0]];
            d.name = showingProducts ? d.product : d.category;
            return d;
        }).sort(sortData);
    } else if (showMultiVal && showQuantity) {
      return data.map(function (d) {
          d.values = [{name: sales, value: +d.quantity}, {name: purchases, value: +d.purchases}];
          d.name = showingProducts ? d.product : d.category;
          return d;
      });
    } else if (showMultiVal && showAmount) {
      data.forEach(function(d){
        d.values = valuesToShow.map(function(value){return {name: value, value: d[value]};});
        d.name = showingProducts ? d.product : d.category;
      });
      return data;
    }
  }

  function sortData(a, b) {
      return b.value - a.value;
  }

  function structureData(valuesToShow, data, dataOption) {
    if (data.length===1) {
      return [setDataPoints(valuesToShow, data[0], dataOption)];

    } else if (data.length===2){
        return [setDataPoints(valuesToShow, data[0], dataOption), setDataPoint(valuesToShow, data[1], dataOption)];

    }
  }

  function retrieveData(data, compareDates, dataOption, valuesToShow) {
        return compareDates ? structureData(valuesToShow, [data[0], data[1]], dataOption) : structureData(valuesToShow, [data[0]], dataOption);
  }

        function changeId(match, chart, chartNumber, suffixLetter) {
          var suffix = suffixLetter || "";
          if (suffix==="a") {
          return chart + Number(chartNumber) + "b";
        } else {
          return chart + Number(chartNumber) + 1;
        }
      }

        function getLastId(){
          var charts = $(".chart");
          var firstChart = charts.length===0 ? true : false;

          var lastId = firstChart ? 'chart1' : $(charts[charts.length-1]).attr("id");

          return lastId;
        }

        function createNewId(lastId){
          var prevCompChart = lastId.match(/[ab]$/) ? true : false;

          var newId = prevCompChart ? lastId.replace(/(\w+[^\d])(\d+)(\w)?/, changeId) : lastId;

          return newId;
        }

        // BARS GO UP
        //   } else if (!compareDates && showTimeLine) {
        //     margin.left = 50;
        //     width = winW - 50 - margin.left - margin.right;
        //     height = 500 - margin.top - margin.bottom;
        //
        // var svg = d3.select(".chart")
        //     .attr("width", 960 + margin.left + margin.right)
        //     .attr("height", 500 + margin.top + margin.bottom)
        //     .append('g')
        //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        //
        //   }



    // FOR BARS GOING UP GRAPH
    // var y = d3.scale.linear()
    //     .range([height, 0])
    //     .domain([0, d3.max(dataset, function (d) {
    //         return d.quantity;
    //     })]);
    //
    // var x = d3.scale.ordinal()
    //     .rangeRoundBands([0, width], .05)
    //     .domain(dataset.map(function (d) {
    //         return d.product;
    //     }));

    // FOR BARS GOING SIDEWAYS
    // var x = d3.scale.linear()
    //     .range([0, width])
    //     .domain([0, d3.max(dataset, function (d) {
    //         return d.quantity;
    //     })]);
    //
    // var y = d3.scale.ordinal()
    //     .rangeRoundBands([height, 0], .05)
    //     .domain(dataset.map(function (d) {
    //         return d.product;
    //     }));
    // // CAN KEEP THE SAME
    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom");
    //
    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left");
    //
    // FOR BARS GOING UP
    // svg.append("g")
    //     .attr('class', 'x axis')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(xAxis)
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em")
    //     .attr("transform", "rotate(-25)");
    // //  .append("text")
    // //  .text('Products');
    //
    // svg.append("g")
    //     .attr('class', 'y axis')
    //     .call(yAxis)
    //     .append('text')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
    //     .attr('x', -(height - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
    //     .attr('dy', '.71em')
    //     .style('text-anchor', 'end')
    //     .text("Quantity");

    // BARS GOING SIDEWAYS
    // svg.append("g")
    //     .attr('class', 'x axis')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(xAxis)
    //     .selectAll("text")
    //     .style("text-anchor", "middle")
    //     // .attr("dx", "-.8em")
    //     // .attr("dy", ".15em")
    //     .append("text")
    //     .text('Quantity');
    //
    // svg.append("g")
    //     .attr('class', 'y axis')
    //     .call(yAxis)
    //     .append('text')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
    //     .attr('x', -(height - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
    //     .attr('dy', '.71em')
    //     .style('text-anchor', 'end')
    //
    // //  chart.append("g")
    // //    .attr("class", "y axis")
    // //    .call(yAxis)
    // //  .append("text")
    // //    .attr("transform", "rotate(-90)")
    // //    .attr("x", -height/2)
    // //    .attr("y", -margin.bottom)
    // //    .attr("dy", ".71em")
    // //    .style("text-anchor", "end")
    // //    .text("YAxis");
    //
    // svg.selectAll('.axis line, .axis path')
    //     .style({
    //         'stroke': 'Black',
    //         'fill': 'none',
    //         'stroke-width': '1px',
    //         'shape-rendering': 'crispEdges'
    //     });
    // var bar = svg.selectAll("g") ...This won't work because we have already appended g elements! Must choose a new element that does not yet exist.
    //  .data(dataset)
    //  .enter()
    //  .append("g")
    // //  .attr("transform", function(d, i) { return "translate(" + x(d.product) + ",0)"; })
    //  .append("a")
    //  .attr("xlink:href", function(d){var s = d.product.replace(/\s/g,'%20'); return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q='+s;})
    //  .attr("style","text-decoration: none;");

    // FOR BARS GOING UP
    // var bar = svg.selectAll(".bar")
    //     .data(dataset)
    //     .enter()
    //     .append("a")
    //     .attr("xlink:href", function (d) {
    //         var s = d.product.replace(/\s/g, '%20');
    //         return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
    //     })
    //     .attr("style", "text-decoration: none;")
    //     .append("rect") // change .append("g") to .append("rect").
    //     // attr("transform") is no longer required here. We can now simply use attr("x",...)
    //     //  .attr("transform", function(d, i) { return "translate(" + x(d.product) + ",0)"; })
    //     .attr('x', function (d) {
    //         return x(d.product);
    //     })
    //     .attr("y", function (d) {
    //         return y(d.quantity);
    //     })
    //     .attr("height", function (d) {
    //         return height - y(d.quantity);
    //     })
    //     .attr("width", x.rangeBand())
    //     .attr('fill', function (d) {
    //         return "rgb(" + d.quantity + ",0,0)";
    //     });
    //
    //
    // // SHIFT THIS CODE to ABOVE under svg.selectAll(".bar")
    // // bar.append("rect")
    // // .attr('x', function(d) {return x(d.product); })
    // // .attr("y", function(d) { return y(d.quantity); })
    // // .attr("height", function(d) { return height - y(d.quantity); })
    // // .attr("width", x.rangeBand())
    // // .attr('fill', function(d){return "rgb("+ d.quantity +",0,0)";});
    // // .on('click',function(d,i){})
    //
    // //THIS does NOT WORK because we already have text divs above. must create new text CLASS
    // // bar.append("text")
    // //     .attr("x", x.rangeBand() / 2)
    // //     .attr("y", function(d) { return y(d.quantity) + 3; })
    // //     .attr("dy", "1.5em")
    // //     .text(function(d) { return d.quantity; })
    // //     .attr('font-family','sans-serif')
    // //     .attr('font-size','11px')
    // //     .attr('text-anchor', 'middle')
    // //     .attr('fill', 'white');
    // console.log("This is x(dataset[0].quantity)", x(dataset[0].product));
    //
    // svg.selectAll(".text")
    //     .data(dataset)
    //     .enter()
    //     .append('text')
    //     .attr("x", function (d) {
    //         return x(d.product) + x.rangeBand() / 2;
    //     })
    //     .attr("y", function (d) {
    //         return y(d.quantity) + 3;
    //     })
    //     .attr("dy", "1.5em")
    //     .text(function (d) {
    //         return d.quantity;
    //     })
    //     .attr('class', 'text')
    //     .attr('font-family', 'sans-serif')
    //     .attr('font-size', '11px')
    //     .attr('text-anchor', 'middle')
    //     .attr('fill', 'white');

    // BARS GOING SIDEWAYS
//     var bar = svg.selectAll(".bar")
//         .data(dataset)
//         .enter()
//         .append("a")
//         .attr("xlink:href", function (d) {
//             var s = d.product.replace(/\s/g, '%20');
//             return 'https://www.google.co.za/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + s;
//         })
//         .attr("style", "text-decoration: none;")
//         .append("rect") // change .append("g") to .append("rect").
//         .attr("y", function (d) {
//             return y(d.product);
//         })
//         .attr("height", y.rangeBand())
//         .attr("width", function (d) {
//             return x(d.quantity);
//         })
//         .attr('fill', '#0099ff');
//     // .attr('fill', function (d) {
//     //     return "rgb(" + d.quantity + ",0,0)";
//     // });
//
//     svg.selectAll(".text")
//         .data(dataset)
//         .enter()
//         .append('text')
//         .attr("y", function (d) {
//             return y(d.product) /*+ y.rangeBand() / 2*/ ;
//         })
//         .attr("x", function (d) {
//             return x(d.quantity) - 5;
//         })
//         .attr("dy", "1.5em")
//         .text(function (d) {
//             return d.quantity;
//         })
//         .attr('class', 'text')
//         .attr('font-family', 'sans-serif')
//         .attr('font-size', '11px')
//         .attr('text-anchor', 'end')
//         .attr('fill', 'white');
// });
// });
//
// }
});
