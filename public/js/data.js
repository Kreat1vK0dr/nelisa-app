$(document).ready(function () {

if (window.location.pathname.split('/')[1] === 'graphs') {
    var dateFrom, dateTo, dateFromCompare, dateToCompare, compareDates = [],
        compareDatesChosen;

    $(".chart-add .period-compare-btn").click(function () {
        $(".chart-add .period-compare").css("display", "inline-block");
        $(this).css("display", "none");
        $(".chart-add .break-line").toggle(true);
    });

    $(".chart-add .cancel-period-compare").click(function () {
        $(".chart-add .from-compare").val("");
        $(".chart-add .to-compare").val("");
        $(".chart-add .period-compare").css("display", "none");
        $(".chart-add .period-compare-btn").css("display", "inline-block");
        $(".chart-add .break-line").toggle(false);
    });

    $(".chart-add .product-btn").click(function () {
        $(".chart-add .data-select").toggle(false);
        $(".chart-add .product-select").toggle(true);
        $(".chart-add .category-select").toggle(false);
    });

    $(".chart-add .category-btn").click(function () {
        $(".chart-add .data-select").toggle(false);
        $(".chart-add .product-select").toggle(false);
        $(".chart-add .category-select").toggle(true);
    });

    $(".chart-add .cancel-data-select").click(function () {
        $(".chart-add .category-select").toggle(false);
        $(".chart-add .product-select").toggle(false);
        $(".chart-add .data-select").toggle(true);
        $(".chart-add .data-select label").toggleClass("active", false);
    });

    $(".chart-add .value-btn").click(function () {
        $(".chart-add .filter-select").toggle(false);
        $(".chart-add .data-value-filter").toggle(true);
    });
    $(".chart-add .quantity-btn").click(function () {
        $(".chart-add .filter-select").toggle(false);
        $(".chart-add .data-quantity-filter").toggle(true);
    });
    $(".chart-add .cancel-filter-select").click(function () {
        $(".chart-add .data-value-filter").toggle(false);
        $(".chart-add .data-quantity-filter").toggle(false);
        $(".chart-add .data-filter label").toggleClass("active", false);
        $(".chart-add .filter-select").toggle(true);
    });
    $(".chart-edit .period-compare-btn").click(function () {
        $(".chart-edit .period-compare").css("display", "inline-block");
        $(this).css("display", "none");
        $(".chart-edit .break-line").toggle(true);
    });

    $(".chart-edit .cancel-period-compare").click(function () {
        $(".chart-edit .from-compare").val("");
        $(".chart-edit .to-compare").val("");
        $(".chart-edit .period-compare").css("display", "none");
        $(".chart-edit .period-compare-btn").css("display", "inline-block");
        $(".chart-edit .break-line").toggle(false);
    });

    $(".chart-edit .product-btn").click(function () {
        $(".chart-edit .data-select").toggle(false);
        $(".chart-edit .product-select").toggle(true);
        $(".chart-edit .category-select").toggle(false);
    });

    $(".chart-edit .category-btn").click(function () {
        $(".chart-edit .data-select").toggle(false);
        $(".chart-edit .product-select").toggle(false);
        $(".chart-edit .category-select").toggle(true);
    });

    $(".chart-edit .cancel-data-select").click(function () {
        $(".chart-edit .category-select").toggle(false);
        $(".chart-edit .product-select").toggle(false);
        $(".chart-edit .data-select").toggle(true);
        $(".chart-edit .data-select label").toggleClass("active", false);
    });

    $(".chart-edit .value-btn").click(function () {
        $(".chart-edit .filter-select").toggle(false);
        $(".chart-edit .data-value-filter").toggle(true);
    });
    $(".chart-edit .quantity-btn").click(function () {
        $(".chart-edit .filter-select").toggle(false);
        $(".chart-edit .data-quantity-filter").toggle(true);
    });
    $(".chart-edit .cancel-filter-select").click(function () {
        $(".chart-edit .data-value-filter").toggle(false);
        $(".chart-edit .data-quantity-filter").toggle(false);
        $(".chart-edit .data-filter label").toggleClass("active", false);
        $(".chart-edit .filter-select").toggle(true);
    });
$("body").on("click",":button.svg-remove", function(){
  $(this).closest('div').remove();
});
// $("body").on("click",":button.svg-edit", function(){
//   console.log("EDIT BUTTON CLICKED");
//   // $("#add").toggle(false);
//   var offset = $(this).closest("div").offset();
//   var id = $(this).closest("div").attr('id');
//   var svg = $("#"+id+" svg")[0]
//   offset.top += 35;
//   // $("#edit").toggleClass("hide-element",false).offset(offset);
//   // // var closest = $(this).closest("div");
//   // //
//   // //               closest.append($('.chart-edit')[0]);
//   // //                       // .attr("id", "edit-nav")
//   //                       // .html();
//   //   $("#edit-chart-btn").on('click', function(e){
//   //     e.preventDefault();
//   //     $("#edit").toggleClass("hide-element",true);
//   //     // $("#add").toggleClass("hide-element",false);
//   //     // $("#add").toggle(true);
//   //     // $("#edit-nav").remove();
//   //     var dataToSend = getDataToSend("edit");
//   //     $.post('/graphs/data', dataToSend, function (dataReceived) {
//   //         console.log('pathname =', window.location.pathname);
//   //         const received = JSON.parse(dataReceived);
//   //     var multifilter = received.multifilter,
//   //             showTimeLine = received.showTimeLine,
//   //             showAllItems = received.dataToShow === "all",
//   //             dataOption = received.dataOption,
//   //             dataToShow = received.dataToShow;
//   //
//   //     if (dataOption==="product" && !showAllItems) {
//   //       dataToShow = $(".chart-edit .product option:selected").html();
//   //     } else if (dataOption==="category" && !showAllItems) {
//   //       dataToShow = $(".chart-edit .category option:selected").html();
//   //     }
//   //
//   //     var data = retrieveData(received.dataset, received.compareDates, received.dataOption, received.valuesToShow);
//   //     var dataset = [sortData(data[0],showTimeLine,multifilter)];
//   //     var winW = window.innerWidth;
//   //
//   //     var margin = {
//   //          top: 100,
//   //          right: multifilter ? 100 : 30,
//   //          bottom: 100,
//   //          left: multifilter || !showAllItems ? 60 : 225
//   //      };
//   //      const maxDomain = getMaxDomain(dataset, received.multifilter);
//   //      const timeExtent = getTimeScaleExtent(dataset, received.compareDates, received.showTimeLine);
//   //      const divWidthPerc = 0.8;
//   //
//   //     var svgWidth = winW * divWidthPerc,
//   //         svgHeight = 500;
//   //
//   //     const chartWidth = svgWidth - margin.left - margin.right,
//   //           chartHeight = svgHeight - margin.top - margin.bottom;
//   //
//   //     const bWidth = 50, // button width
//   //           bHeight = 40; // button height
//   //
//   //     var newChart = {
//   //                    dataset: dataset,
//   //                    compareDates: received.compareDateRange,
//   //                    showTimeLine: showTimeLine,
//   //                    multifilter: multifilter,
//   //                    dates: received.dates,
//   //                    dataOption: dataOption,
//   //                    dataToShow: dataToShow,
//   //                    valuesToShow: received.valuesToShow,
//   //                    chartHeight: chartHeight,
//   //                    chartWidth: chartWidth,
//   //                    margin: margin,
//   //                    max: maxDomain,
//   //                    axisLabel: received.axisLabel
//   //                   };
//   //
//   //     var newMulti = newChart.multifilter,
//   //         prevMulti = window.localStorage.getItem("prevMulti") ? window.localStorage.getItem("prevMulti") : false,
//   //         prevAndNewMulti = newMulti && prevMulti;
//   //
//   //     var firstChart = $(".chart").length===0,
//   //     newChartId = createNewId(getLastId());
//   //
//   //     var div = d3.select("center")
//   //                  .append("div")
//   //                  .attr('class', 'chart')
//   //                  .attr('id', newChartId)
//   //                  .style('width',divWidthPerc*100+"%")
//   //
//   //                  div.append("button")
//   //                     .attr("class","svg-remove btn btn-danger")
//   //                     .append("span")
//   //                     .attr("class", "glyphicon glyphicon-remove")
//   //
//   //                  div.append("button")
//   //                     .attr("class","svg-edit btn btn-primary")
//   //                     .append("span")
//   //                     .attr("class", "glyphicon glyphicon-edit")
//   //
//   //         var svg = div.append("svg")
//   //                  .attr("width", svgWidth /*+ margin.left + margin.right*/)
//   //                  .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
//   //                   .attr("z-index",1)
//   //                   .attr("class", "svg-"+newChartId)
//   //                  var chart = svg.append('g')
//   //                       .attr('class', 'innerspace')
//   //                       .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');
//   //
//   //                  newChart.chart = chart;
//   //                  newChart.chartId = newChartId;
//   //                  addChartTitle(newChart);
//   //
//   //       if (multifilter) {
//   //         var radio = ["grouped","stacked"]
//   //         var form = div.append("form");
//   //
//   //         radio.forEach(function(i){
//   //           form.append("label")
//   //               .text(i)
//   //               .append("input")
//   //               .attr({
//   //                       type: "radio",
//   //                       name: "mode",
//   //                       value: i,
//   //                       checked: i ==="stacked" ? true : false
//   //               });
//   //         });
//   //         // addGroupedColumnChart(newChart);
//   //           addStackedGroupedColumnChart(newChart);
//   //       } else if (!multifilter && !showTimeLine) {
//   //
//   //       addBarChart(newChart);
//   //       window.localStorage.setItem("prevMulti", newChart.multifilter);
//   //
//   //     } else if (!multifilter && showTimeLine) {
//   //
//   //       addTimeColumnChart(newChart);
//   //
//   //     }
//   //
//   //   });
//   //   });
//
// });

$('#show-chart-btn').on('click', function (e) {
          e.preventDefault();
          console.log("press show chart button");

              // d3.select("svg").remove();

      var dataToSend = getDataToSend("add");

      $.post('/graphs/data', dataToSend, function (dataReceived) {
          console.log('pathname =', window.location.pathname);
          const received = JSON.parse(dataReceived);
          // const showCost = data.valuesToShow.indexOf("cost") === -1;
          // const showRevenue = data.valuesToShow.indexOf("revenue") === -1;
          // const showProfit = data.valuesToShow.indexOf("profit") === -1;
          // const showSales = data.valuesToShow.indexOf("sold") === -1;
          // const showPurchases = data.valuesToShow.indexOf("purchased") === -1;
          var multifilter = received.multifilter,
              showTimeLine = received.showTimeLine,
              showAllItems = received.dataToShow === "all",
              dataOption = received.dataOption,
              dataToShow = received.dataToShow;

          if (dataOption==="product" && !showAllItems) {
            dataToShow = $(".chart-add .product option:selected").html();
          } else if (dataOption==="category" && !showAllItems) {
            dataToShow = $(".chart-add .category option:selected").html();
          }

          var data = retrieveData(received.dataset, received.compareDates, received.dataOption, received.valuesToShow);
          var dataset = [sortData(data[0],showTimeLine,multifilter)];
          var winW = window.innerWidth;

          var margin = {
               top: 100,
               right: multifilter ? 100 : 30,
               bottom: 100,
               left: multifilter || !showAllItems ? 60 : 225
           };
           const maxDomain = getMaxDomain(dataset, received.multifilter);
           const timeExtent = getTimeScaleExtent(dataset, received.compareDates, received.showTimeLine);
           const divWidthPerc = 0.8;

          var svgWidth = winW * divWidthPerc,
              svgHeight = 500;

          const chartWidth = svgWidth - margin.left - margin.right,
                chartHeight = svgHeight - margin.top - margin.bottom;

          const bWidth = 50, // button width
                bHeight = 40; // button height

          var newChart = {
                         dataset: dataset,
                         compareDates: received.compareDateRange,
                         showTimeLine: showTimeLine,
                         multifilter: multifilter,
                         dates: received.dates,
                         dataOption: dataOption,
                         dataToShow: dataToShow,
                         valuesToShow: received.valuesToShow,
                         chartHeight: chartHeight,
                         chartWidth: chartWidth,
                         margin: margin,
                         max: maxDomain,
                         axisLabel: received.axisLabel
                        };

          var newMulti = newChart.multifilter,
              prevMulti = window.localStorage.getItem("prevMulti") ? window.localStorage.getItem("prevMulti") : false,
              prevAndNewMulti = newMulti && prevMulti;

          var firstChart = $(".chart").length===0,
          newChartId = createNewId(getLastId());

          var div = d3.select("center")
                       .append("div")
                       .attr('class', 'chart')
                       .attr('id', newChartId)
                       .style('width',divWidthPerc*100+"%")

                       div.append("button")
                          .attr("class","svg-remove btn btn-danger")
                          .append("span")
                          .attr("class", "glyphicon glyphicon-remove")

                      //  div.append("button")
                      //     .attr("class","svg-edit btn btn-primary")
                      //     .append("span")
                      //     .attr("class", "glyphicon glyphicon-edit")

              var svg = div.append("svg")
                       .attr("width", svgWidth /*+ margin.left + margin.right*/)
                       .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
                        .attr("z-index",1)
                       var chart = svg.append('g')
                            .attr('class', 'innerspace')
                            .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');

                       newChart.chart = chart;
                       newChart.chartId = newChartId;
                       addChartTitle(newChart);

            if (multifilter) {
              var radio = ["grouped","stacked"]
              var form = div.append("form")
                            .attr("class","group-stack");

              radio.forEach(function(i){
                form.append("label")
                    .text(i)
                    .append("input")
                    .attr({
                            type: "radio",
                            name: "mode",
                            value: i,
                            checked: i ==="stacked" ? true : false
                    });
              });
              // addGroupedColumnChart(newChart);
                addStackedGroupedColumnChart(newChart);
            } else if (!multifilter && !showTimeLine) {

            addBarChart(newChart);
            window.localStorage.setItem("prevMulti", newChart.multifilter);

          } else if (!multifilter && showTimeLine) {

            addTimeColumnChart(newChart);

          }
      //   } else if (!firstChart){
      //     addChartTitle(newChart);
      //
      //     newChart.chart = d3.select("#chart1")
      //                       .attr("width", svgWidth /*+ margin.left + margin.right*/)
      //                       .attr("height", svgHeight /*+ margin.top + margin.bottom*/)
      //                     .select("g.innerspace")
      //                     .attr('transform', 'translate(' + margin.left +","+ margin.top + ')');
      //
      //
      //     if (multifilter) {
      //     redrawGroupedColumnChart(newChart);
      //
      //     } else if (!multifilter && !showTimeLine) {
      //
      //     } else if (!multifilter && showTimeLine) {
      //
      //     }
      //
      //       redraw(newChart);
      //       window.localStorage.setItem("prevMulti", newChart.multifilter);
      //     }
      });
});

}// !-- window.location.path == /graphs

function getColor(valueToshow){
  switch (valueToshow) {
    case "sold" :  return "#009900";
    case "profit": return "#009900";
    case "purchased" : return "#990000"
    case "loss"      : return "#990000";
    case "remaining" : return "#0066cc";
    case "revenue"   : return "#0066cc";
    case "cost"      : return "#ff9900";
    default : return null;
  }
}

function getColorRange(valueTypes,dataset){
  const showProfit = valueTypes.indexOf("profit")!=-1;
  const negValExist = showProfit ? dataset.find(function(d){return d.profit < 0;}) : false;
  if (negValExist) valueTypes.push("loss");

  var colors = [];
  valueTypes.forEach(function(v){
    colors.push(getColor(v));
  });
  return colors;
}

function weekDay(dayIndex) {
  switch (dayIndex){
  case 0: return "Sun";
  case 1: return "Mon";
  case 2: return "Tue";
  case 3: return "Wed";
  case 4: return "Thu";
  case 5: return "Fri";
  case 6: return "Sat";
  default: return null;
}
}

function addChartTitle(newChart) {
  const h = newChart.chartHeight,
        w = newChart.chartWidth,
        valuesToShow = newChart.valuesToShow,
        dataToShow = newChart.dataToShow,
        dataOption = newChart.dataOption,
        dates = newChart.dates,
        margin = newChart.margin,
        dataset = newChart.dataset,
        axisLabel = newChart.axisLabel,
        chart = newChart.chart;

  const dateRangeTitle = dateRangeText(dates[0]),
        dataTitle = dataTitleText(dataOption, dataToShow, valuesToShow);

chart.append("text")
        .attr("id","daterange-title")
        .attr("x", (w - margin.left)/2)
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(dateRangeTitle);

chart.append("text")
        .attr("id","data-title")
        .attr("x", (w - margin.left)/2)
        .attr("y", 0 - (margin.top - 40))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-style", "italic")
        .text(dataTitle);
  }

function addStackedGroupedColumnChart(newChart){
  var x0, x1, y, xAxis, yAxis, bars, groups, legend;

  const h = newChart.chartHeight,
        w = newChart.chartWidth,
        margin = newChart.margin,
        valuesToShow = newChart.valuesToShow,
        max = newChart.max,
        showTimeLine = newChart.showTimeLine,
        dataset = newChart.dataset,
        axisLabel = newChart.axisLabel,
        chartId = newChart.chartId,
        chart = newChart.chart;

  const name = showTimeLine ? "date" : "name";

  var stackTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-20, 0])
    .html(function(d) {
      var html = "<div style='text-align:center;'>"+d.x+"<br/>";
      d.values.forEach(function(d){
      html += "<strong><span style='color:grey'>"+d.valueName+": </span></strong> <span style='color:white'>" + d.value + "</span><br/>";
    });
    html += "</div>";
    return html;
    });

var groupTip = d3.tip()
              .attr('class','d3-tip')
              .offset([-20, 0])
              .html(function(d){
                return "<div style='text-align:center;'>"+d.x+"<br/><strong><span style='color:grey'>"+d.valueName+": </span></strong> <span style='color:white'>" + d.value+ "</span></div>"
              });

chart.call(stackTip);
chart.call(groupTip);

  if (showTimeLine)
  {
    dataset[0].forEach(function(data){
          var date = data.date.split("/"),
              day = weekDay(new Date(data.date).getDay()),
              values = data.values;

          data.date = day+" "+monthText(+date[0])+" "+date[1];
          data.values = values.map(function(d){d.date = data.date; return d;});
      });
  }

  var n = valuesToShow.length, // number of layers
      m = dataset[0].length; // number of samples per layer

      var layers = d3.layout.stack()(valuesToShow.map(function(value) {
          return dataset[0].map(function(d) {
            var val = value ==="sold" ? "quantity" : value;
            var description = showTimeLine ? "date" : "name";
            return {x: d[description], y: Math.abs(+d[val]), value: +d[val], valueName: value};
          });
      }));

for (var i=0; i<layers.length;i++) {
layers[i].map(function(d, j){
                    d.values = dataset[0][j].values;
                    return d;
                      });
                    }


      var yGroupMax = max;
      var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

      var x = d3.scale.ordinal()
                 .rangeRoundBands([25, w], .08)
                 .domain(layers[0].map(function(d) { return d.x; }));
                //  .domain(dataset[0].map(function(d) { return d[name]; }));

      var x1 = d3.scale.ordinal()
                       .domain(valuesToShow)
                       .rangeRoundBands([0, x.rangeBand()]);

      var y = d3.scale.linear()
          .domain([0, yStackMax])
          .range([h, 0]);

      var y1 = d3.scale.linear()
                .domain([0, max])
                .range([h,0]);

      var colorRange = getColorRange(valuesToShow,dataset[0]);
          console.log(valuesToShow);
      var color = d3.scale.ordinal()
                          .domain(valuesToShow)
                          .range(colorRange);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

      var xAxisGroup = chart.append("g")
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em");

      if (showTimeLine) {
        xAxisGroup.attr("transform", "rotate(-90)");
      } else {
        xAxisGroup.attr("transform", "rotate(-25)");
      }

          //create y axis (!showTimeLine)
           chart.append("g")
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
              .attr('x', -(h - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text(axisLabel);


      var layer = chart.selectAll(".layer")
          .data(layers)
          .enter().append("g")
          .attr("class", "layer");


      var rect = layer.selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
          .attr("x", function(d) { return x(d.x); })
          .attr("y", h)
          .attr("width", x.rangeBand())
          .attr("height", 0)
          .style("fill", function(d, i) {
            if (d.value<0) {
              d.valueName = "loss";
            }
            return color(d.valueName);
          });

      rect.transition()
          .delay(function(d, i) { return i * 10; })
          .attr("y", function(d) { return y(d.y0 + d.y); })
          .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

    var textgroup = chart.selectAll("g.textgroup")
        .data(dataset[0])
        .enter()
        .append('g')
        .attr('class','textgroup')
        .attr('transform', function(d) {
          return 'translate('+ x(d[name]) +',0)';
        });

  var groupValues =  textgroup.selectAll('text.valuegroup')
        .data(function(d) {return d.values;})
        .enter()
        .append('text')
        .attr("class","valuegroup")
        .attr("y",function(d) {return y(Math.abs(d.value)) - x1.rangeBand()/2 - 50;})
        .attr("x", function (d) {
            return x1(d.valueName) + x1.rangeBand()/2;
        })
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('font-size', x1.rangeBand()/2+"px")
        .attr('text-anchor', 'middle')
        .attr('fill', 'black');

      d3.selectAll("#"+chartId+" input").on("change", change);

      var timeout = setTimeout(function() {
        d3.select("#"+chartId+" input[value='grouped']").property("checked", true).each(change);
      }, 500);

      function change() {
        clearTimeout(timeout);
        if (this.value === "grouped") transitionGrouped();
        else transitionStacked();
      }

      function transitionGrouped() {
        y.domain([0, max]);
        yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        chart.selectAll("g.y.axis")
            .transition()
            .duration(300)
            .ease("sin-in-out")
            .call(yAxis);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("x", function(d, i, j) {
              return x(d.x) + x.rangeBand() / n * j;
            })
            .attr("width", x.rangeBand() / n)
          .transition()
            .attr("y", function(d) { return y(d.y); })
            .attr("height", function(d) { return h - y(d.y); });

        rect.on("mouseover", groupTip.show)
            .on("mouseout", groupTip.hide);


        groupValues.transition()
              .duration(1000)
              .ease('bounce')
              .delay(550)
              .attr("y", function (d) {
                  return y(Math.abs(d.value)) - 5  ;
              })
              // .attr("dy", "0.3em")
              .text(function (d) {
                  return d.value;
              });

    };

      function transitionStacked() {
        y.domain([0, yStackMax]);

        yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

        chart.selectAll("g.y.axis")
        .transition()
        .duration(300)
        .ease("sin-in-out")
            .call(yAxis);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
          .transition()
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.rangeBand());

            groupValues.text('');

        rect.on("mouseover", stackTip.show)
            .on("mouseout", stackTip.hide);

        // rect.on("mouseover", function() { tooltip.style("display", null); })
        //   .on("mouseout", function() { tooltip.style("display", "none"); })
        //   .on("mousemove", function(d) {
        //     var xPosition = d3.mouse(this)[0] - 15;
        //     var yPosition = d3.mouse(this)[1] - 25;
        //     console.log(xPosition);
        //     tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        //     tooltip.select("text").text("hello world");
        //   });
          // textgroup.selectAll('text.valuegroup').text('');

          // valuesStack.transition()
          //       .duration(1000)
          //       .delay(550)
          //       .text(function (d) {
          //           return d.value;
          //       });
      };

      var tooltip = chart.append("g")
          .attr("class", "tooltip");

      tooltip.append("rect")
          .attr("width", 30)
          .attr("height", 20)
          .attr("fill", "red")
          .style("opacity", 0.5);

      tooltip.append("text")
          .attr("x", 15)
          .attr("dy", "1.2em")
          .style("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold");

        legend = chart.selectAll(".legend")
            .data(valuesToShow.slice())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", w)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", w + 20)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { return d; });

}

function addGroupedColumnChart(newChart){
  var x0, x1, y, xAxis, yAxis, bars, groups, legend;

  const h = newChart.chartHeight,
        w = newChart.chartWidth,
        margin = newChart.margin,
        valuesToShow = newChart.valuesToShow,
        max = newChart.max,
        showTimeLine = newChart.showTimeLine,
        dataset = newChart.dataset,
        axisLabel = newChart.axisLabel,
        chart = newChart.chart;

  const name = showTimeLine ? "date" : "name";

  if (showTimeLine)
  {
    dataset[0].forEach(function(data){
          var date = data.date.split("/"),
              day = weekDay(new Date(data.date).getDay()),
              values = data.values;

          data.date = day+" "+monthText(+date[0])+" "+date[1];
          data.values = values.map(function(d){d.date = data.date; return d;});
      });
  }



    x0 = d3.scale.ordinal()
                     .rangeRoundBands([0, w], .1)
                     .domain(dataset[0].map(function(d) { return d[name]; }));

    x1 = d3.scale.ordinal()
                     .domain(valuesToShow).rangeRoundBands([0, x0.rangeBand()]);

    y = d3.scale.linear()
        .range([h, 0])
        .domain([0, max]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-(x1.rangeBand()/2 + 20), 0])
    .html(function(d) {
      if (showTimeLine) {
      return "<div style='text-align:center;'>"+d.date+"<br/><strong><span style='color:grey'>"+d.valueName+": </span></strong> <span style='color:white'>" + d.value + "</span></div>";
    } else {
      return "<div style='text-align:center;'>"+d.name+"<br/><strong><span style='color:grey'>"+d.valueName+": </span></strong> <span style='color:white'>" + d.value + "</span></div>";
    }
    });

    chart.call(tip);

    var colorRange = getColorRange(valuesToShow,dataset[0]);
    console.log(valuesToShow);
    var color = d3.scale.ordinal()
                        .domain(valuesToShow)
                        .range(colorRange);

    var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var xAxisGroup = chart.append("g")
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em");

if (showTimeLine) {
  xAxisGroup.attr("transform", "rotate(-90)");
} else {
  xAxisGroup.attr("transform", "rotate(-25)");
}

    //create y axis (!showTimeLine)
     chart.append("g")
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50) // NOTE THAT when ROTATED perpendicular 'y' moves element left/right
        .attr('x', -(h - 20) / 2) // NOTE THAT when ROTATED perpendicular 'x' moves element up/down
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(axisLabel);

    groups = chart.selectAll("g.group")
      .data(dataset[0]);

    groups.enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) {
        return "translate(" + x0(d[name]) + ",0)";
      });


    bars = groups.selectAll("rect.gbar")
                    .data(function(d) { return d.values; });

    var barsEnter =  bars.enter().append("rect")
             .attr("class","gbar")
             .attr("width", x1.rangeBand())
             .attr("x", function(d){
               return x1(d.valueName);
             })
             .attr("y", h)
             .attr("height", 0)
             .style("fill", function(d) {
               if (d.value < 0) {
                return color("loss");
              } else {
                return color(d.valueName);
              }
             })
             .on("mouseover",tip.show)
             .on("mouseout",tip.hide);

    barsEnter.transition()
            .duration(1000)
             .delay(function(d, i) { return i * 10; })
             .attr("y",function(d){
               if (d.value < 0){
                 return y(Math.abs(d.value));
               } else {
               return y(d.value);
               }
             })
             .attr("height", function(d) {
               if (d.value < 0) {
                 var absVal = Math.abs(d.value);
                 return h - y(absVal);
               } else {
               return h - y(d.value);
             }
           });

    bars.exit()
             .transition()
             .duration(300)
             .ease("quad")
             .remove();

var textgroup = chart.selectAll("g.textgroup")
    .data(dataset[0])
    .enter()
    .append('g')
    .attr('class','textgroup');

if (showTimeLine) {
    textgroup.attr('transform', function(d) { return 'translate('+ x0(d.date) +',0)';});
} else {
    textgroup.attr('transform', function(d) {return 'translate('+ x0(d.name) +',0)';});
  }

var values = textgroup.selectAll('text.value')
    .data(function(d) {return d.values;})
    .enter()
    .append('text')
    .attr("class","value")
    .attr("y",h)
    .attr("x", function (d) {
        return x1(d.valueName) + x1.rangeBand()/2;
    })
    .attr("height",0)
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', x1.rangeBand()/2+"px")
    .attr('text-anchor', 'middle')
    .attr('fill', 'black');

    values.transition()
          .duration(1000)
          .delay(function(d, i) { return i * 10; })
          .attr("y", function (d) {
              return y(Math.abs(d.value)) - x1.rangeBand()/2 + 5  ;
          })
          // .attr("dy", "0.3em")
          .text(function (d) {
              return d.value;
          });


      legend = chart.selectAll(".legend")
          .data(valuesToShow.slice())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", w)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", w + 20)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });
}

function addTimeColumnChart(newChart){
  var x, y, xAxis, yAxis, bars;

  const h = newChart.chartHeight,
        w = newChart.chartWidth,
        valuesToShow = newChart.valuesToShow,
        margin = newChart.margin,
        max = newChart.max,
        dataset = newChart.dataset,
        axisLabel = newChart.axisLabel,
        chart = newChart.chart;

  // const	parseDate = d3.time.format("%m/%d/%Y").parse;

  dataset[0].forEach(function(d){
    var date = d.date.split("/");
    var day = weekDay(new Date(d.date).getDay());
    d.date = day+" "+monthText(+date[0])+" "+date[1];
    // d.date = +date[1]+" "+monthText(+date[0])+" "+date[2].replace(/(\d{2})(\d{2})/,"$2");
  });

  var y = d3.scale.linear()
        .range([h, 0])
        .domain([0, max]);

  var	x = d3.scale.ordinal().rangeRoundBands([0, w], .1)
                            .domain(dataset[0].map(function(d){
                              console.log("THIS IS D DATE", d.date);
                              return d.date;
                            }));

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-(10+x.rangeBand()/2), 0])
    .html(function(d) {
      return "<div style='text-align:center;'>"+d.date+"<br/><strong><span style='color:grey'>"+valuesToShow[0]+": </span></strong> <span style='color:white'>" + d.value + "</span></div>";
      // return d.date+"<br/><strong>"+valuesToShow[0]+": </strong> <span style='color:white'>" + d.value + "</span>";
    });

chart.call(tip);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    chart.append("g")
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis)
        .selectAll("text")
        .attr("dx","-10px")
        .attr("dy","-5px")
        .style("text-anchor","end")
        .attr("transform", "rotate(-90)");

    //create y axis (!showTimeLine)
    chart.append("g")
        .attr('class', 'y axis')
        .call(yAxis);

  var bars = chart.selectAll("rect.bar")
    .data(dataset[0]);
    // entering bars
  var barsEnter = bars.enter()
    .append("rect") // change .append("g") to .append("rect").
    .attr("class","bar") // change .append("g") to .append("rect").
    .attr("width", x.rangeBand())
    // .style("fill", "green")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
    .attr("y",h)
    .attr("x",function(d){
      return x(d.date);
    })
    .attr("height", 0);

    barsEnter.transition()
              .duration(500)
              .delay(function(d,i){return i*20;})
              .ease('quad')
              .attr("height", function(d) {
                  if (d.value < 0) {
                    var absVal = Math.abs(d.value);
                    return h - y(absVal);
                  } else {
                  return h - y(d.value);
                }
                })
                .attr("y",function(d){
                  return y(d.value);
                });


    // add numbers in bars
    var text = chart.selectAll('text.value')
        .data(dataset[0])
        .enter()
        .append('text')
        .attr("class","value")
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('font-size', x.rangeBand()/2+"px")
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr("x", function (d) {
            return x(d.date) + x.rangeBand()/2;
        })
        .attr("y", function (d) {
            return y(Math.abs(d.value)) - 5 ;
        });

        // .attr("dy", "0.3em")
        text.transition()
            .duration(500)
            .delay(function(d,i){return 800 + (i+1)*20;})
            .ease("bounce")
            .text(function (d) {
            return d.value;
          });
}

function addBarChart(newChart){

  var x, y, xAxis, yAxis;

  const h = newChart.chartHeight,
        w = newChart.chartWidth,
        valuesToShow = newChart.valuesToShow,
        max = newChart.max,
        dataset = newChart.dataset,
        axisLabel = newChart.axisLabel,
        chart = newChart.chart;

         x = d3.scale.linear()
                        .range([0, w])
                        .domain([0, max]);

         y = d3.scale.ordinal()
                  .rangeRoundBands([0, h], .05)
                  .domain(dataset[0].map(function (d) {
                      return d.name;
                  }));

         xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

         yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

        chart.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis)

        //create y axis (!showTimeLine)
        chart.append("g")
            .attr('class', 'y axis')
            .call(yAxis);

                // add bars
  var bars = chart.selectAll("rect.sidebar")
      .data(dataset[0]);

var barsEnter =  bars.enter()
      .append("rect") // change .append("g") to .append("rect").
      .attr("class","sidebar") // change .append("g") to .append("rect").
      .attr("y", function (d) {
          return y(d.name);
      })
      .attr("height", y.rangeBand())
      .attr("width", 0)
      .attr('fill', function(d){
        if (d.value < 0) {
          return "orangered";
        } else {
          return "green";
        }
      })
      .on("mouseover", function(d){
    			d3.select(this).attr("fill", "orange");
    		})
  		.on("mouseout", function(d){
        if (d.value<0) {
          d3.select(this).attr("fill", "orangered");

        } else {
  			d3.select(this).attr("fill", "green");
      }
    });

barsEnter.transition()
      .duration(500)
      .ease('linear')
      .attr("width", function (d) {
        if (d.value < 0) {
          return x(Math.abs(d.value));
        } else {
          return x(d.value);
        }
      });

      // add numbers in bars
      chart.selectAll("text.numbers")
          .data(dataset[0])
          .enter()
          .append('text')
          .attr("class","numbers")
          .attr("y", function (d) {
              return y(d.name) + y.rangeBand() / 2 ;
          })
          .attr("x", function (d) {
              return x(Math.abs(d.value)) - 2;
          })
          .attr("dy", "0.3em")
          .text(function (d) {
              return d.value;
          })
          .attr('font-family', 'sans-serif')
          .attr('font-size', '11px')
          .attr('text-anchor', 'end')
          .attr('fill', 'white');

}


function getTimeScaleExtent(dataset, compareDates) {
  var extent, extent1, extent2;
if (compareDates) {
  extent1 = d3.extent(dataset[0], function(d) { return d.date; });
  extent2 = d3.extent(dataset[1], function(d) { return d.date; });
return [extent1,extent2];
} else {
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

  function getDataToSend(action) {
                  var filter = getFilterSelection(action),
                      data = getDataSelection(action),

                  dataToSend = {
                      inputDates: getInputDates(action),
                      dataOption: data[0],
                      dataSelection: data[1],
                      filterOption: filter[0],
                      filterSelection: filter[1]
                  };

                  console.log("THIS is data", data);
                  console.log("THIS is dataselection", data[1]);
                  console.log("THIS is dataToSend.dataselection", dataToSend.dataSelection);
                  console.log("THIS is datatosend", dataToSend);
                  return dataToSend;
  }

  function getFilterSelection(action){
    var inputFilter = $(".chart-"+action+" .data-filter label.active input[name='data-filter']").val(),
        inputFilterSelection = [];

    if (inputFilter === "value") {
        $(".chart-"+action+" .data-value-filter label.active input[name='data-value']").each(function () {
            inputFilterSelection.push($(this).val());
        });
    } else if (inputFilter === "quantity") {
        $(".chart-"+action+" .data-quantity-filter label.active input[name='data-quantity']").each(function () {
            inputFilterSelection.push($(this).val());
        });
    }
  return [inputFilter, inputFilterSelection];
  }

  function getDataSelection(action) {
    var dataSelection,
        selection,
        inputDataType = $(".chart-"+action+" .type-select label.active input").val();

    if (inputDataType === "product") {
      selection = $(".chart-"+action+" .product option:selected").val();
    } else if (inputDataType === "category") {
        selection = $(".chart-"+action+" .category option:selected").val();
    }

     dataSelection = selection === 'all' ? selection : Number(selection);

    return [inputDataType, dataSelection];
  }

  function getInputDates(action) {
    var inputDates = [];
    $(".chart-"+action+" .date-input").each(function () {
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
    var showQuantity = valuesToShow[0] === "sold" || valuesToShow[0] === "purchased" || valuesToShow[0] === "remaining";
    var showRemaining = valuesToShow.indexOf('remaining') != -1;

    if (!showMultiVal && showQuantity) {
        return data.map(function (d) {
            d.value = showRemaining ? d.remaining : d.quantity;
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (!showMultiVal && showAmount) {
        return data.map(function (d) {
            d.value = d[valuesToShow[0]];
            d.name = showingProducts ? d.product : d.category;
            return d;
        });
    } else if (showMultiVal && showQuantity) {
      data.forEach(function(d){
          d.name = showingProducts ? d.product : d.category;
          d.values = valuesToShow.map(function(value){return {name: d.name, valueName: value, value: value==="sold" ? +d.quantity : +d[value]};});

      });
      return data;
    } else if (showMultiVal && showAmount) {
      data.forEach(function(d){
        d.name = showingProducts ? d.product : d.category;
        d.values = valuesToShow.map(function(value){return {name: d.name, valueName: value, value: +d[value]};});
      });
      return data;
    }
  }
function sortData(data, showTimeLine, multifilter){
  if (showTimeLine) {
    return data.sort(sortDate);
  } else if (!multifilter) {
    return data.sort(sortValue);
  } else {
    return data;
  }
}
  function sortValue(a, b) {
      return b.value - a.value;
  }
  function sortDate(a,b) {
    var	parseDate = d3.time.format("%m/%d/%Y").parse;
    return parseDate(a.date) - parseDate(b.date);
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
          return chart + (+chartNumber + 1);
        }
      }

        function getLastId(){
          var charts = $(".chart");
          var firstChart = charts.length===0 ? true : false;

          var lastId = firstChart ? 'chart0' : $(charts[charts.length-1]).attr("id");

          return lastId;
        }

        function createNewId(lastId){
          var prevCompChart = lastId.match(/[ab]$/) ? true : false;

          var newId = lastId.replace(/(\w+[^\d])(\d+)(\w)?/, changeId);

          return newId;
        }

});
