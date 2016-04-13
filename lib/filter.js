function concat(arrayOfArrays) {
    return arrayOfArrays.reduce(function(a,b){return a.concat(b);});
}

function sortBy(key) {
  function compare(a,b) {
    return a[key] - b[key];
  }
  return compare;
}

function chainFilter(arrayOfFilterPairs, input) {
    return arrayOfFilterPairs.reduce(function(input, filterpair) {
      return input.filter(function(item) {
            if (filterpair[1].split(',').length > 1) {
                  var values = filterpair[1].split(',');
                  return values.indexOf(item[filterpair[0]]) > -1;
                // NOTE: THE FOLLOWING COMMENTED CODE DOESN'T WORK.
                  // values.forEach(function(value) {
                  //   conditional += "item[filterpair[0]] === "+(value)+" || ";  ==>> 'value' always evaluates to the literal value i.e. week1, nstead of in quotes as needed, ie.. "week1". What happens is that the eval() then tries to read the value week1 as a variable.
                  // });
                  // conditional = conditional.replace(/ \|\| $/, "");
                  // return eval(conditional);
                } else {
        return item[filterpair[0]] === filterpair[1];
        }
      });
  }, input);
}

//INPUT ARGUMENTS => filterData([key1,value1,[key2, value2,[...,[keyN, valueN]]]]); key==> e.g. 'product','week', etc value==> e.g. 'week1', 'Milk 1L' etc.
///OPTION 1: WITH ARGUMENTS.
// function filterDataBy(data) {
//       var i = 0, key = [], value = [], filterpairs = [];
//       while(i<arguments.length) {
//         if (i & 1) {value.push(arguments[i]);}
//         else {key.push(arguments[i]);}
//         i++;
//       }
//       for (var i = 0; i<key.length; i++) {
//         filterpairs.push([key[i],value[i]]);
//       }
//       return chainFilter(filterpairs, data);
//     }

///OPTION 2: WITH DIRECT ARRAY INPUT.
//NOTE: DATA SHOULD NOT BE AN ARRAY OF ARRAYS OF ARRAYS. SHOUD BE A SINGULAR ARRAY OF ARRAYS. IF NOT, USE CONCAT.
function filterData(data, arrayOfFilterPairs) {  //e.g. [['week','week1'],['product','Bread']] OR [['week', 'week2 week3'], ['product', 'product1 product2']] etc.
      return chainFilter(arrayOfFilterPairs, data);
    }

//NOTE: createFilterPairs TO BE USED WHEN SELECTION IS TO BE DERIVED FROM USER INPUT ONLINE.
function createFilterPairs() {
//To be created once selection method is designed.
return arrayOfFilterPairs;
}

exports.sortBy = function(key) {
  return sortBy(key);
};

exports.concat = function(arrayOfArrays) {
  return concat(arrayOfArrays);
};

exports.filterData = function(data, arrayOfFilterPairs) {
  return filterData(data, arrayOfFilterPairs);
};
