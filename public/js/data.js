$(document).ready(function () {

if (window.location.pathname.split('/')[1] === 'graphs') {
    var dateFrom, dateTo, dateFromCompare, dateToCompare, compareDates = [],
        compareDatesChosen;

    function convertDate(date) {
        return date.replace(/(\d+)-(\d+)-(\d+)/g, "$2/$1/$3");
    }
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
    })
    $('#show-chart-btn').on('click', function (e) {
                e.preventDefault();
                console.log("press show chart button");
                var inputDates = [],
                    inputFilter = $("#data-filter label.active input[name='data-filter']").val(),
                    inputFilterSelection = [],
                    inputDataSelection,
                    selection,
                    inputDataType = $("#type-select label.active input").val();

                if (inputDataType === "product") {
                    selection = $("select[name='product']").val();
                } else if (inputDataType === "category") {
                    selection = $("select[name='product']").val();
                }
                inputDataSelection = selection === "all" ? selection : Number(selection);

                if (inputFilter === "value") {
                    $("#data-filter label.active input[name='data-value']").each(function () {
                        inputFilterSelection.push($(this).val());
                    });
                } else if (inputFilter === "quantity") {
                    $("#data-filter label.active input[name='data-quantity']").each(function () {
                        inputFilterSelection.push($(this).val());
                    });
                }

                $(".date-input").each(function () {
                    if ($(this).val() != "") inputDates.push(convertDate($(this).val()));
                });

                dataToSend = {
                    inputDates: inputDates,
                    filterBy: inputDataType,
                    filterRefine: inputDataSelection,
                    displayType: inputFilter,
                    dataToDisplay: inputFilterSelection
                };
                console.log("THIS is datatosend", dataToSend);

                function setDataPoints(filter, data) {
                    if (filter === "sold" || "purchased") {
                        return data.map(function (d) {
                            d.datapoint = d.quantity;
                            return d
                        });
                    } else if (filter === "cost") {
                        return data.sort(function (d) {
                            d.datapoint = d.cost;
                            return d
                        });
                    } else if (filter === "revenue") {
                        return data.sort(function (d) {
                            d.datapoint = d.revenue;
                            return d
                        });
                    } else if (filter === "profit") {
                        return data.sort(function (d) {
                            d.datapoint = d.profit;
                            return d
                        });
                    }
                }

                function sortData(data) {
                    return data.sort(function (a, b) {
                        a.datapoint - b.datapoint
                    });
                }

                function structureData(filter, data) {
                    if (typeof data === "object") {
                        return [setDataPoints(filter, data[0]).sort(sortData), setDataPoint(filter, data[1]).sort(sortData)];
                    } else {
                        return setDataPoints(filter, data).sort(sortData);
                    }
                }

                function retrieveData(compareDates, filter, data) {
                    switch (filter) {
                    case "sold":
                        return compareDates ? structureData(filter, [data.salesData, data.salesDataCompare]) : structureData(filter, data.salesData);
                    case "purchased":
                        return compareDates ? structureData(filter, [data.purchasesData, data.purchasesDataCompare]) : structureData(filter, data.purchasesData);
                    case "revenue":
                        return compareDates ? structureData(filter, [data.salesData, data.salesDataCompare]) : structureData(filter, data.salesData);
                    case "cost":
                        return compareDates ? structureData(filter, [data.salesData, data.salesDataCompare]) : structureData(filter, data.salesData);
                    case "profit":
                        return compareDates ? structureData(filter, [data.salesData, data.salesDataCompare]) : structureData(filter, data.salesData);
                    default:
                        return null;
                    }
                }

                $.post('/graphs/data', dataToSend, function (dataReceived) {
                        console.log('pathname =', window.location.pathname);
                        const data = JSON.parse(dataReceived);
                        const compareDates = data.compareDateRange;
                        const showTimeLine = data.showTimeLine;
                        const multifilter = data.multifilter;
                        const dates = data.dates;
                        const dataToShow = data.dataToShow;
                        const showCost = dataToShow.indexOf("cost") === -1;
                        const showRevenue = dataToShow.indexOf("revenue") === -1;
                        const showProfit = dataToShow.indexOf("profit") === -1;
                        const showSales = dataToShow.indexOf("sold") === -1;
                        const showPurchases = dataToShow.indexOf("purchased") === -1;
                        var margin, dataset, width, height;

                        d3.select("svg").remove();

                        var winW = window.innerWidth;

                        var datasets = [];
                        dataToShow.forEach(function (filter) {
                            datasets.push(retrieveData(compareDates, filter, data));
                        });
                        // BARS GO SIDEWAYS
                        if (!compareDates && !showTimeLine) {
                          dataset = datasets[0];
                            d3.select("body").append("svg").attr('class', 'chart');
                            margin = {
                                top: 20,
                                right: 30,
                                bottom: 40,
                                left: 250
                            };
                            width = winW - margin.left - margin.right;
                            height = 500 - margin.top - margin.bottom;

                            var svg = d3.select(".chart")
                                .attr("width", winW)
                                .attr("height", 500 + margin.top + margin.bottom)
                                .append('g')
                                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                            var x = d3.scale.linear()
                                .range([0, width])
                                .domain([0, d3.max(dataset, function (d) {
                                    return d.quantity;
                                })]);

                            var y = d3.scale.ordinal()
                                .rangeRoundBands([height, 0], .05)
                                .domain(dataset.map(function (d) {
                                    return d.product;
                                }));
                            // CAN KEEP THE SAME
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
                                .style("text-anchor", "middle")
                                // .attr("dx", "-.8em")
                                // .attr("dy", ".15em")
                                .append("text")
                                .text('Quantity');

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
                                .attr('fill', '#0099ff');
                            // .attr('fill', function (d) {
                            //     return "rgb(" + d.quantity + ",0,0)";
                            // });

                            svg.selectAll(".text")
                                .data(dataset)
                                .enter()
                                .append('text')
                                .attr("y", function (d) {
                                    return y(d.product) /*+ y.rangeBand() / 2*/ ;
                                })
                                .attr("x", function (d) {
                                    return x(d.quantity) - 5;
                                })
                                .attr("dy", "1.5em")
                                .text(function (d) {
                                    return d.quantity;
                                })
                                .attr('class', 'text')
                                .attr('font-family', 'sans-serif')
                                .attr('font-size', '11px')
                                .attr('text-anchor', 'end')
                                .attr('fill', 'white');
                              }
                        });
                });

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
