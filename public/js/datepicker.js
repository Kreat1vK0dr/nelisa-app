$.get('/graphs/available-dates', function(data){
console.log(data);
console.log(JSON.parse(data));
var availableDates = JSON.parse(data).availableDates.sort();
var dateDetails = JSON.parse(data).dateDetails;
console.log("available dates", availableDates);
// var formattedAvailableDates = availableDates.map(function(i){ return i.replace(/(\d+)\/(\d+)\/(\d+)/g,"$2/$1/$3");});
function available(date) {
var dateToCheck = jQuery.datepicker.formatDate('mm-dd-yy', date);
if ($.inArray(dateToCheck, availableDates) != -1) {
  var dateAttributes = dateDetails.find(function(i){return i.date === dateToCheck; });
  // console.log("dateAttributes: ", dateAttributes);
  return [true, dateAttributes.cssClass,dateAttributes.toolTipText];
} else {
  return [false,"","No Data Available"];
}
}

function getMonthDays(year,month){
return 32 - new Date(year, month, 32).getDate();
}

// function defaultDates(availableDates) {
const currentDate = new Date();
const lastDateAvailable = new Date(availableDates[availableDates.length-1]);
var yearsToLastDateAvailable = currentDate.getFullYear() - lastDateAvailable.getFullYear();
var monthsToLastDateAvailable = currentDate.getMonth() - lastDateAvailable.getMonth();
var daysToLastDateAvailable = currentDate.getDate() - lastDateAvailable.getDate();

var daysToMonthStart = Math.abs(1 - lastDateAvailable.getDate());

var years = yearsToLastDateAvailable > 0 ? "-"+yearsToLastDateAvailable+"y" : "";
var months = monthsToLastDateAvailable > 0 ? "-"+monthsToLastDateAvailable+"m" : "";

var lastDateIsMonthEnd = lastDateAvailable.getDate() + 1 === getMonthDays(lastDateAvailable.getFullYear(),lastDateAvailable.getMonth()) ? true : false;
if (daysToLastDateAvailable > 0 && lastDateIsMonthEnd) {
var daysToFullMonthEnd = daysToLastDateAvailable;
var daysToFullMonthStart = daysToFullMonthEnd + getMonthDays(lastDateAvailable.getFullYear(),lastDateAvailable.getMonth());
} else if (daysToLastDateAvailable > 0 && !lastDateIsMonthEnd) {
var daysToFullMonthEnd = daysToLastDateAvailable + daysToMonthStart + 1;
var daysToFullMonthStart = daysToFullMonthEnd + daysToMonthStart + 1 + getMonthDays(lastDateAvailable.getFullYear(),lastDateAvailable.getMonth()-1);

} else if (daysToLastDateAvailable = 0 && lastDateIsMonthEnd) {
var daysToFullMonthEnd = 0;
var daysToFullMonthStart = getMonthDays(lastDateAvailable.getFullYear(),lastDateAvailable.getMonth()) - 1;

} else if (daysToLastDateAvailable = 0 && !lastDateIsMonthEnd) {
var daysToFullMonthEnd = daysToMonthStart + 1;
var daysToFullMonthStart = daysToMonthStart + getMonthDays(lastDateAvailable.getFullYear(),lastDateAvailable.getMonth());

}

const defaultDateFrom = years+" "+months+" "+"-"+daysToFullMonthStart+"d";
const defaultDateTo = years+" "+months+" "+"-"+daysToFullMonthEnd+"d";

//   return {from: defaultDateFrom, to: defaultDateTo};
// }
console.log("defaultfrom",defaultDateFrom );
console.log("defaultto",defaultDateTo );
// var defaultDates = defaultDates(availableDates);



$(function() {
  $( "#from" ).datepicker({
    beforeShowDay: available,
    defaultDate: defaultDateFrom,
    dateFormat: 'dd-mm-yy',
    changeMonth: true,
    numberOfMonths: 2,
    onClose: function(selectedDate) {
      console.log("This is selected date: ", selectedDate);
      $( "#to" ).datepicker( "option", "minDate", selectedDate);
    }
  });
  $( "#to" ).datepicker({
    beforeShowDay: available,
    defaultDate: defaultDateTo,
    dateFormat: 'dd-mm-yy',
    changeMonth: true,
    numberOfMonths: 2,
    onClose: function( selectedDate ) {
      $( "#from" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
  $( "#from-compare" ).datepicker({
    beforeShowDay: available,
    defaultDate: defaultDateFrom,
    dateFormat: 'dd-mm-yy',
    changeMonth: true,
    numberOfMonths: 2,
    onClose: function(selectedDate) {
      $( "#to-compare" ).datepicker( "option", "minDate", selectedDate );
    }
  });
  $( "#to-compare" ).datepicker({
    beforeShowDay: available,
    defaultDate: defaultDateTo,
    dateFormat: 'dd-mm-yy',
    changeMonth: true,
    numberOfMonths: 2,
    onClose: function( selectedDate ) {
      $( "#from-compare" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
});
});
