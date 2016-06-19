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

              d3.select("svg").remove();

              var dataToSend = getDataToSend();

      $.post('/graphs/data', dataToSend, function (dataReceived) {
          console.log('pathname =', window.location.pathname);

          const data = JSON.parse(dataReceived);
          const compareDates = data.compareDateRange;
          const showTimeLine = data.showTimeLine;
          const multifilter = data.multifilter;
          const dates = data.dates;
          const dataOption = data.dataOption;
          const dataToShow = data.dataToShow;
          const valuesToShow = data.valuesToShow;
          const showCost = valuesToShow.indexOf("cost") === -1;
          const showRevenue = valuesToShow.indexOf("revenue") === -1;
          const showProfit = valuesToShow.indexOf("profit") === -1;
          const showSales = valuesToShow.indexOf("sold") === -1;
          const showPurchases = valuesToShow.indexOf("purchased") === -1;

          var datasets = [];

          valuesToShow.forEach(function (filter) {
              datasets.push(retrieveData(compareDates, filter, data));
          });

            addChart(datasets, dates, valuesToShow, dataToShow, dataOption, "single");
      });
});

function addChart(datasets, dates, valuesToShow, dataToShow, dataOption, type) {

var margin, dataset, width, height;

var winW = window.innerWidth - 200;

var newChartId = createNewId(getLastId());
var barColour = '#0099ff';

d3.select("center").append("svg")
             .attr('class', 'chart')
             .attr("id", newChartId);

// BARS GO SIDEWAYS
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
if (type==="single") {

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

dataset = datasets[0];

margin = {
    top: 65,
    right: 30,
    bottom: 40,
    left: 225
};

var fullWidth = 800,
    fullHeight = 500;

width = fullWidth - margin.left - margin.right;
height = fullHeight - margin.top - margin.bottom;

// Get max value from dataset.
var max = d3.max(dataset, function (d) {
    return d.quantity;
});
// Set x and y scales.
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, max]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .05)
    .domain(dataset.map(function (d) {
        return d.product;
    }));

// Setup svg element.
var svg = d3.select("#"+newChartId)
    .attr("width", fullWidth /*+ margin.left + margin.right*/)
    .attr("height", fullHeight /*+ margin.top + margin.bottom*/)
    .append('g')
    .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');
// svg.append("svg:rect")
//    .attr("width", "100%")
//    .attr("height", "100%")
  //  .attr("stroke", "#000")
  //  .attr("fill", "none");
  var dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);
  var dateRangeTitle = dateRangeText(dates[0]);

  //dateRange Title
svg.append("text")
        .attr("class","daterange-title")
        .attr("x", (width - margin.left)/2)
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(dateRangeTitle);
//data title
svg.append("text")
        .attr("class","data-title")
        .attr("x", (width - margin.left)/2)
        .attr("y", 0 - (margin.top - 40))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-style", "italic")
        .text(dataTitle);

// CAN KEEP THE SAME
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// append x axis
svg.append("g")
    .attr('class', 'x axis')
    .call(xAxis)
    .attr('transform', 'translate(0,' + height + ')')
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    .append("text")
    .style("text-anchor", "end")
    .attr("x",width)
    .attr("dy",-5)
    .style("font-style","italic")
    .text('Quantity');


// append y axis
svg.append("g")
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
    .attr('x', -(height - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
    .attr('dy', '.71em')
    .style('text-anchor', 'end')

svg.selectAll('.axis line, .axis path')
    .style({
        'stroke': 'Black',
        'fill': 'none',
        'stroke-width': '1px',
        'shape-rendering': 'crispEdges'
    });

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
    .attr("y", function (d) {
        return y(d.product);
    })
    .attr("height", y.rangeBand())
    .attr("width", function (d) {
        return x(d.quantity);
    })
    .attr('fill', barColour);


    // .on("mouseover", function(d){
		// 	d3.select(this).attr("fill", "green");
		// })
		// .on("mouseout", function(d){
		// 	d3.select(this).attr("fill", "orange");
		// })
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
// });

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

} else if (type==="double") {

} else if (type==="multiSingle") {

} else if (type==="multiDouble") {

}

}

function bars(data, chartId, x, y, barColour)
      {

          // max = d3.max(data)
          //
          // x = d3.scale.linear()
          //     .domain([0, max])
          //     .range([0, w])
          //
          // y = d3.scale.ordinal()
          //     .domain(d3.range(data.length))
          //     .rangeBands([0, h], .2)
          //
          //
          var vis = d3.select("#"+chartId);

          var bars = vis.selectAll("rect.bar")
              .data(data)

          //enter
          bars.enter()
              .append("svg:rect")
              .attr("class", "bar")
              .attr("fill", "#800")

          //exit
          bars.exit()
          .transition()
          .duration(300)
          .ease("exp")
              .attr("width", 0)
              .remove()


          bars
          .transition()
          .duration(300)
          .ease("quad")
              .attr("width", x)
              .attr("height", y.rangeBand())
              .attr("transform", function(d,i) {
                  return "translate(" + [0, y(i)] + ")"
              })

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

  function setDataPoints(filter, data) {
    if (filter === "sold" || "purchased") {
        return data.map(function (d) {
            d.datapoint = d.quantity;
            return d;
        });
    } else if (filter === "cost") {
        return data.map(function (d) {
            d.datapoint = d.cost;
            return d;
        });
    } else if (filter === "revenue") {
        return data.map(function (d) {
            d.datapoint = d.revenue;
            return d;
        });
    } else if (filter === "profit") {
        return data.map(function (d) {
            d.datapoint = d.profit;
            return d;
        });
    }
  }

  function sortData(a, b) {
      return a.datapoint - b.datapoint;
  }

  function structureData(filter, data) {
    if (data.length) {
      return setDataPoints(filter, data).sort(sortData);

    } else {
        return [setDataPoints(filter, data.set1).sort(sortData), setDataPoint(filter, data.set2).sort(sortData)];

    }
  }

  function retrieveData(compareDates, filter, data) {
    switch (filter) {
    case "sold":
        return compareDates ? structureData(filter, {set1: data.salesData, set2: data.salesDataCompare}) : structureData(filter, data.salesData);
    case "purchased":
        return compareDates ? structureData(filter, {set1: data.purchasesData, set2: data.purchasesDataCompare}) : structureData(filter, data.purchasesData);
    case "revenue":
        return compareDates ? structureData(filter, {set1: data.salesData, set2: data.salesDataCompare}) : structureData(filter, data.salesData);
    case "cost":
        return compareDates ? structureData(filter, {set1: data.salesData, set2: data.salesDataCompare}) : structureData(filter, data.salesData);
    case "profit":
        return compareDates ? structureData(filter, {set1: data.salesData, set2: data.salesDataCompare}) : structureData(filter, data.salesData);
    default:
        return null;
    }
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
