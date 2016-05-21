$(document).ready(function () {
    if (window.location.pathname === '/admin/sales') {
        $('#products').change(function () {
            $('#price').val($('#products option:selected').attr('data-price'));
            $('#categories').val($('#products option:selected').attr('data-category'));
        });
  if (window.localStorage.getItem('sale')) {
    if (JSON.parse(window.localStorage.getItem('sale')).length!==0){
    var previousState = JSON.parse(window.localStorage.getItem('table'));
    var html = previousState.map(function(i){return i.html;}).join("");
    $('#no-items-text').css('display','none');
    $('#added-items thead').css('display','');
    $('#added-items tbody').css('display','');
    $('#added-items tbody').append(html);
  } else {
    $('#no-items-text').css('display','');
    $('#added-items thead').css('display','none');
    $('#added-items tbody').css('display','none');
  }
}

  $('#add-item').click(function(){
    var price = $('#price').val(),
        quantity = $('#quantity').val(),
        p_id = $('#products').val(),
        c_id = $('#categories').val(),
        product = $('#products option:selected').attr('data-description'),
        category = $('#categories option:selected').attr('data-description'),
        storage = JSON.parse(window.localStorage.getItem('sale')),
        previousState = JSON.parse(window.localStorage.getItem('table'));

    var sub_total = price * quantity;

    var id = storage === null ? 1 : storage.length+1;
    var sale = {itemId: id, data: [p_id,c_id,price,quantity]},
        item = [product,category,price,quantity,sub_total];


    var newRowContent = "<tr data-row-id='"+id+"'>";

      item.forEach(function(content){
        newRowContent += "<td>"+content+"</td>";
      });

      newRowContent += "<td><button >Remove item(s)</button></td></tr>";

    if (storage && previousState) {
      var items = storage;
      items.push(sale);
      window.localStorage.setItem('sale',JSON.stringify(items));
      previousState.push({rowId: id, html: newRowContent});
      var newState = previousState;
      window.localStorage.setItem('table', JSON.stringify(newState));

      // document.getElementById('added-items').innerHTML = newRowContent;
      // $('#added-items tr:last').after(newRowContent);
      $('#added-items').append(newRowContent);
    } else {
    window.localStorage.setItem('sale',JSON.stringify([sale]));
    window.localStorage.setItem('table',JSON.stringify([{rowId: id, html: newRowContent}]));
    console.log(newRowContent);
    $('#no-items-text').css('display','none');
    $('#added-items thead').css('display','');
    $('#added-items tbody').css('display','');
    $('#added-items tbody').append(newRowContent);
  }
  console.log(localStorage);
  $('#products').val('');
  $('#categories').val('');
  $('#price').val('');
  $('#quantity').val('');
  });

  $('#added-items').on('click',':button', function(){
    var itemId = Number($(this).closest('tr').attr('data-row-id'));
    console.log(itemId);
    var storage = JSON.parse(window.localStorage.getItem('sale'));
    var previousState = JSON.parse(window.localStorage.getItem('table'));
    console.log(storage);
    var updatedItems = storage.filter(function(i){return i.itemId !== itemId;});
    var currentState = previousState.filter(function(i){return i.rowId !== itemId;});
    window.localStorage.setItem('sale', JSON.stringify(updatedItems));
    window.localStorage.setItem('table', JSON.stringify(currentState));
    $(this).closest('tr').remove();
    if (updatedItems.length===0) {
      $('#no-items-text').css('display','');
      $('#added-items thead').css('display','none');
      $('#added-items tbody').css('display','none');
    }
    console.log(updatedItems);
    console.log(currentState);
  });
        // $('#categories').change(function () {
        //     $.getJSON("getProducts.php?category=" + $(this).val(), success = function (data) {
        //         data.forEach(function (product) {
        //             $('option')
        //             .attr({
        //                 value: data.id
        //               })
        //               .data({price: data.price, category: data.category_id})
        //               .text(data.description).insertBefore("#choose");
        //         });
        //     });
        // });
    }
});
