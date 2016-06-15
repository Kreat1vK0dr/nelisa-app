$(document).ready(function () {
console.log('THIS IS window.location.path', window.location.pathname);

const currentPath = window.location.pathname;
const searchPath = currentPath.split('/')[1]==="purchases" || currentPath.split('/')[1]==="sales" || currentPath.split('/')[1]==="products";
if (searchPath){
  $('#search').on('keyup', function(e){
    var search,
        searchBy = $('#searchBy').val();
    console.log($('#search').val());
    if ($('#search').val()==='') {
      search = "0";
    } else {
      var search = $('#search').val();
    }
    console.log(currentPath+'/filter/'+search);
    $.get(currentPath+'/filter/'+searchBy+'/'+search, function(compiledHTML){
      $('#searchResults').html(compiledHTML);
    });
  });
  }
});
