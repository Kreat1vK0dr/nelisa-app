var Nelisa = require('./whatNelisaWants');

var smsData = Nelisa.whatSheWants();

function getWeekData(week) {
  switch(week) {
    case 1 : return smsData[0];
    case 2 : return smsData[1];
    case 3 : return smsData[2];
    case 4 : return smsData[3];
    case 5 : return smsData[4];
    default : return null;
  }
}

var content = getWeekData(1);

var sms = content.week.toUpperCase()+'\nMOST=>>\nPop-P: '+content['most popular product'].product+'\nProf-P: '+content['most profitable product'].product+'\nPop-C: '+content['most popular category'].category+'\nProf-C: '+content['most profitable category'].category+'\nLEAST=>>\nPop-P: '+content['least popular product'].product+'\nProf-P: '+content['least profitable product'].product+'\nPop-C: '+content['least popular category'].category+'\nProf-C: '+content['least profitable category'].category;

exports.content = function(week){
  return sms;
};

// console.log(sms);
