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

          var firstChart = $(".chart").length===0;
          var newChartId = createNewId(getLastId());

          if (noChart) {
            d3.select("center").append("svg")
                         .attr('class', 'chart')
                         .attr("id", newChartId);
                        //  .attr("id", newChartId);
          }
              // d3.select("svg").remove();

      var dataToSend = getDataToSend();

      $.post('/graphs/data', dataToSend, function (dataReceived) {
          console.log('pathname =', window.location.pathname);

          const data = JSON.parse(dataReceived);
          // const showCost = data.valuesToShow.indexOf("cost") === -1;
          // const showRevenue = data.valuesToShow.indexOf("revenue") === -1;
          // const showProfit = data.valuesToShow.indexOf("profit") === -1;
          // const showSales = data.valuesToShow.indexOf("sold") === -1;
          // const showPurchases = data.valuesToShow.indexOf("purchased") === -1;
          const datasets = retrieveData(data, data.compareDates, data.dataOption, data.valuesToShow);

          var winW = window.innerWidth - 200;
          var margin = {
               top: 65,
               right: 30,
               bottom: 40,
               left: 225
           };

          if (showTimeLine) margin.left = 50;
          var svgWidth = 800,
              svgHeight = 500;

              var newChart = {
                             data: datasets,
                             compareDates: data.compareDateRange,
                             showTimeLine: data.showTimeLine,
                             multifilter: data.multifilter,
                             dates: data.dates,
                             dataOption: data.dataOption,
                             dataToShow: data.dataToShow,
                             valuesToShow: data.valuesToShow,
                             svgWidth: svgWidth,
                             svgHeight: svgHeight,
                             margins: margin
                            };


            addChart(newChart);
      });
});

function addChart(newChart) {
var  data = newChart.data,
     compareDates = newChart.compareDates,
     showTimeLine = newChart.showTimeLine,
     multifilter = newChart.multifilter,
     dates = newChart.dates,
     dataOption = newChart.dataOption,
     dataToShow = newChart.dataToShow,
     valuesToShow = newChart.data.valuesToShow,
     svgWidth = newChart.svgWidth,
     svgHeight = newChart.svgHeight,
     margin = newChart.margins;

var chartWidth = svgWidth - margin.left - margin.right,
    chartHeight = svgHeight - margin.top - margin.bottom;

// BARS GO SIDEWAYS

if (!showTimeLine) {

dataset = data[0];

var svg = d3.select("#chart1")
    .attr("width", svgWidth /*+ margin.left + margin.right*/)
    .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
    .append('g')
    .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');


var dateRangeTitle = dateRangeText(dates[0]);
svg.append("text")
        .attr("id","daterange-title")
        .attr("x", (chartWidth - margin.left)/2)
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold");
        .text(dateRangeTitle);

var dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);
svg.append("text")
        .attr("id","data-title")
        .attr("x", (chartWidth - margin.left)/2)
        .attr("y", 0 - (margin.top - 40))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-style", "italic");
        .text(dataTitle);

var max,
    max1,
    max2,
    extent,
    extent1,
    extent2;

// calculating max domain.
if (multifilter && !compareDates) {
max = d3.max(dataset[0], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });
extent = d3.extent(dataset[0], function(d) { return d.date; })

} else if (!multifilter && !compareDates){
max = d3.max(dataset[0], function (d) {
    return d.datapoint;
});
extent = d3.extent(dataset[0], function(d) { return d.date; })
} else if (multifilter && compareDates) {
  max1 = d3.max(dataset[0], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });
  max2 = d3.max(dataset[1], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });

  extent1 = d3.extent(dataset[0], function(d) { return d.date; })
  extent2 = d3.extent(dataset[1], function(d) { return d.date; })

} else if (!multifilter && compareDates) {
  max1 = d3.max(dataset[0], function (d) {
      return d.datapoint;
  });
  max2 = d3.max(dataset[1], function (d) {
      return d.datapoint;
  });
  extent1 = d3.extent(dataset[0], function(d) { return d.date; })
  extent2 = d3.extent(dataset[1], function(d) { return d.date; })

}

// implement compare date functionality here...
// setting scales dynamically
if (multifilter && showTimeLine) {
  var	parseDate = d3.time.format("%m/%d/%y").parse;

  dataset[0].forEach(function(d){d.date = parseDate(d.date);});
  // Parse the date / time

  var	x0 = d3.time.scale().range([0, width]);
                          .domain(extent);

  var x1 = d3.scale.ordinal();
                   .domain(valuesToShow).rangeRoundBands([0, x0.rangeBand()]);

  var y = d3.scale.linear()
                  .range([chartHeight, 0]);
                  .domain([0, max]);

  var colorRange = valuesToShow.length===2 ? ["#6b486b", "#a05d56"] : ["#6b486b", "#a05d56", "#d0743c"];
  var color = d3.scale.ordinal()
                      .range(colorRange);

  var xAxis = d3.svg.axis()
  .scale(x0)
  .orient("bottom");

} else if (multifilter && !showTimeLine) {
  var y0 = d3.scale.ordinal()
                   .rangeRoundBands([chartHeight, 0], .1);
                   .domain(data.map(function(d) { return d.name; }));

  var y1 = d3.scale.ordinal();
                   .domain(valuesToShow).rangeRoundBands([0, y0.rangeBand()]);

  var x = d3.scale.linear()
      .range([0, chartWidth]);
      .domain([0, max]);

  var colorRange = valuesToShow.length===2 ? ["#6b486b", "#a05d56"] : ["#6b486b", "#a05d56", "#d0743c"];
  var color = d3.scale.ordinal()
                      .range(colorRange);

  var yAxis = d3.svg.axis()
  .scale(y0)
  .orient("left");

} else if (!multifilter && !showTimeLine) {
      var x = d3.scale.linear()
          .range([0, chartWidth])
          .domain([0, max]);

      var y = d3.scale.ordinal()
          .rangeRoundBands([chartHeight, 0], .05)
          .domain(dataset.map(function (d) {
              return d.name;
          }));

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

} else if (!multifilter && showTimeLine) {
  var	parseDate = d3.time.format("%m/%d/%y").parse;

  dataset[0].forEach(function(d){d.date = parseDate(d.date);});

  var y = d3.scale.linear()
      .range([chartHeight, 0])
      .domain([0, max]);

  var	x0 = d3.time.scale().range([0, width]);
                          .domain(extent);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");
}

// create x axis
svg.append("g")
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')');
    .call(xAxis)
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    .append("text")
    .style("text-anchor", "end")
    .attr("x",width)
    .attr("dy",-5)
    .style("font-style","italic")
    .text('Quantity');

//create y axis
svg.append("g")
    .attr('class', 'y axis');
    .call(yAxis)

svg.selectAll('.axis line, .axis path')
    .style({
        'stroke': 'Black',
        'fill': 'none',
        'stroke-width': '1px',
        'shape-rendering': 'crispEdges'
    });

// add bars
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
		});

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

} else if (showTimeLine) {

}
}

function redraw(newChart){
  var  datasets = newChart.data,
       compareDates = newChart.compareDates,
       showTimeLine = newChart.showTimeLine,
       multifilter = newChart.multifilter,
       dates = newChart.dates,
       dataOption = newChart.dataOption,
       dataToShow = newChart.dataToShow,
       valuesToShow = newChart.data.valuesToShow,
       svgWidth = newChart.svgWidth,
       svgHeight = newChart.svgHeight,
       margin = newChart.margins;

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
//all graphs
// Get max value from dataset.

var max,
    max1,
    max2;

if (multifilter && !compareDates) {
max = d3.max(datasets[0], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });
} else if (!multifilter && !compareDates){
max = d3.max(dataset[0], function (d) {
    return d.datapoint;
});
} else if (multifilter && compareDates) {
  max1 = d3.max(datasets[0], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });
  max2 = d3.max(datasets[1], function(d) { return d3.max(d.datapoints, function(d) { return d.value; }); });
} else if (!multifilter && !compareDates) {
  max1 = d3.max(datasets[0], function (d) {
      return d.datapoint;
  });
  max2 = d3.max(datasets[1], function (d) {
      return d.datapoint;
  });
}

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

// set date-range title
var dateRangeTitle = dateRangeText(dates[0]);
d3.select("#daterange-title")
  .text(dateRangeTitle);

// set data title
var dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);
d3.select("#data-title")
  .text(dataTitle);

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

    if (!showMultiVal && valuesToShow === "sold" || "purchased") {
        return data.map(function (d) {
            d.datapoint = d.quantity;
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (!showMultiVal && valuesToShow === "cost") {
        return data.map(function (d) {
            d.datapoint = d.cost;
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (!showMultiVal && valuesToShow === "revenue") {
        return data.map(function (d) {
            d.datapoint = d.revenue;
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (!showMultiVal && valuesToShow === "profit") {
        return data.map(function (d) {
            d.datapoint = d.profit;
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (showMultiVal && showQuantity) {
      return data.map(function (d) {
          d.datapoints = [{name: sales, value: +d.quantity}, {name: purchases, value: +d.purchases}];
          d.name = showingProducts ? d.product : d.category;
          return d;
      });
    } else if (showMultiVal && showAmount) {
      data.forEach(function(d){
        d.datapoints = valuesToShow.map(function(value){return {name: value, value: d[value]};});
        d.name = showingProducts ? d.product : d.category;
      });
    }
  }

  function sortData(a, b) {
      return a.datapoint - b.datapoint;
  }

  function structureData(filter, data, dataOption) {
    if (data.length) {
      return setDataPoints(filter, data, dataOption).sort(sortData);

    } else {
        return [setDataPoints(filter, data.set1, dataOption).sort(sortData), setDataPoint(filter, data.set2, dataOption).sort(sortData)];

    }
  }

  function retrieveData(data, compareDates, dataOption, valuesToShow) {
    switch (filter) {
    case "sold":
        return compareDates ? structureData(valuesToShow, {set1: data.salesData, set2: data.salesDataCompare}, dataOption) : structureData(valuesToShow, data.salesData, dataOption);
    case "purchased":
        return compareDates ? structureData(valuesToShow, {set1: data.purchasesData, set2: data.purchasesDataCompare}, dataOption) : structureData(valuesToShow, data.purchasesData, dataOption);
    case "revenue":
        return compareDates ? structureData(valuesToShow, {set1: data.salesData, set2: data.salesDataCompare}, dataOption) : structureData(valuesToShow, data.salesData, dataOption);
    case "cost":
        return compareDates ? structureData(valuesToShow, {set1: data.salesData, set2: data.salesDataCompare}, dataOption) : structureData(valuesToShow, data.salesData, dataOption);
    case "profit":
        return compareDates ? structureData(valuesToShow, {set1: data.salesData, set2: data.salesDataCompare}, dataOption) : structureData(valuesToShow, data.salesData, dataOption);
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
