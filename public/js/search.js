$(document).ready(function(){
console.log('THIS IS window.location.path', window.location.pathname);

const currentPath = window.location.pathname;
const searchPath = currentPath==="/purchases" || currentPath==="/sales" || currentPath==="/products" || currentPath==="/users";
if (searchPath){
  $('#search').on('keyup', function(e){
    var search;
    console.log($('#search').val());
    if ($('#search').val()==='') {
      search = "0";
    } else {
      var search = $('#search').val();
    }
    console.log(currentPath+'/filter/'+search);
    $.get(currentPath+'/filter/'+search, function(compiledHTML){
      $('#table').html(compiledHTML);
    });
  });
  }
});
