function checkIfCanExecuteSale(dataToPost) {
    var data = JSON.parse(dataToPost),
        cannotExecute = [];

    data.forEach(function (item) {
        var inventory = item.data[4],
            quantity = item.data[3];

        var enough = inventory - quantity >= 0;
        if (!enough) {
            var details = {
                description: $("#products option[value='" + item.data[0] + "']").text(),
                inventory: item.data[4],
                quantity: item.data[3],
                cantSell: Math.abs(inventory - quantity)
            };
            cannotExecute.push(details);
        }
    });
    return cannotExecute;
}

function createAlertTableHTML(saleItemsArray){
  var tableBody = "";
  saleItemsArray.forEach(function (item) {
      var rowContent = "<tr>";
      for (var key in item) {
          rowContent += "<td>" + item[key] + "</td>";
      }
      rowContent += "</tr>";
      tableBody += rowContent;
  });
  return tableBody;
}

$(document).ready(function () {
    if (window.location.pathname === '/admin/sales') {
        $('#products').change(function () {
            $('#price').val($('#products option:selected').attr('data-price'));
            $('#categories').val($('#products option:selected').attr('data-category'));
        });
        if (window.localStorage.getItem('sale')) {
            if (JSON.parse(window.localStorage.getItem('sale')).length !== 0) {
                var previousState = JSON.parse(window.localStorage.getItem('table'));
                var html = previousState.map(function (i) {
                    return i.html;
                }).join("");
                $('#no-items-text').css('display', 'none');
                $('#added-items thead').css('display', '');
                $('#added-items tbody').css('display', '');
                $('#added-items tbody').append(html);
            } else {
                $('#no-items-text').css('display', '');
                $('#added-items thead').css('display', 'none');
                $('#added-items tbody').css('display', 'none');
            }
        }
        //NOTE: here it is ok to use .click(function...) because we only have one element to which the handler is assigned.
        $('#add-item').click(function () {
            var price = Number($('#price').val()),
                quantity = Number($('#quantity').val()),
                inventory = Number($('#products option:selected').attr('data-inventory')),
                p_id = Number($('#products').val()),
                c_id = Number($('#categories').val()),
                product = $('#products option:selected').attr('data-description'),
                category = $('#categories option:selected').attr('data-description'),
                storage = JSON.parse(window.localStorage.getItem('sale')),
                previousState = JSON.parse(window.localStorage.getItem('table'));

            var sub_total = price * quantity;

            var id = storage === null ? 1 : storage.length + 1;
            var sale = {
                    itemId: id,
                    data: [p_id, c_id, price, quantity,inventory]
                },
                item = [product, category, price, quantity, inventory,sub_total];


            var newRowContent = "<tr data-row-id='" + id + "'>";

            item.forEach(function (content) {
                newRowContent += "<td>" + content + "</td>";
            });

            newRowContent += "<td><button >Remove item(s)</button></td></tr>";

            if (storage && previousState) {
                var items = storage;
                items.push(sale);
                window.localStorage.setItem('sale', JSON.stringify(items));
                previousState.push({
                    rowId: id,
                    html: newRowContent
                });
                var newState = previousState;
                window.localStorage.setItem('table', JSON.stringify(newState));

                $('#no-items-text').css('display', 'none');

                $('#added-items thead').css('display', '');
                $('#added-items tbody').css('display', '');
                $('#added-items tbody').append(newRowContent);
            } else {
                window.localStorage.setItem('sale', JSON.stringify([sale]));
                window.localStorage.setItem('table', JSON.stringify([{
                    rowId: id,
                    html: newRowContent
                }]));
                console.log(newRowContent);
                $('#no-items-text').css('display', 'none');
                $('#added-items thead').css('display', '');
                $('#added-items tbody').css('display', '');
                $('#added-items tbody').append(newRowContent);
            }
            console.log(localStorage);
            $('#products').val('');
            $('#categories').val('');
            $('#price').val('');
            $('#quantity').val('');
        });
        //NOTE: better to use .on('click',<selector>, function..) when having to assign a handler to many buttons or similar etc.
        $('#added-items').on('click', ':button', function () {
            var itemId = Number($(this).closest('tr').attr('data-row-id'));
            console.log(itemId);
            var storage = JSON.parse(window.localStorage.getItem('sale'));
            var previousState = JSON.parse(window.localStorage.getItem('table'));
            console.log(storage);
            var updatedItems = storage.filter(function (i) {
                return i.itemId !== itemId;
            });
            var currentState = previousState.filter(function (i) {
                return i.rowId !== itemId;
            });
            window.localStorage.setItem('sale', JSON.stringify(updatedItems));
            window.localStorage.setItem('table', JSON.stringify(currentState));
            $(this).closest('tr').remove();
            if (updatedItems.length === 0) {
                $('#no-items-text').css('display', '');
                $('#added-items thead').css('display', 'none');
                $('#added-items tbody').css('display', 'none');
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
        $('#execute-sale').click(function (event) {
            event.preventDefault();
            console.log("executing sale button clicked");
            var dataToPost = window.localStorage.getItem('sale');
            // console.log("Data to post: ", JSON.parse(dataToPost));

            var canExecuteSale = checkIfCanExecuteSale(dataToPost);
            console.log(canExecuteSale);

            if (canExecuteSale.length === 0) {
                $.post('http://localhost:5000/admin/sales/add', {
                    data: dataToPost
                });
                window.localStorage.clear();
                $('#execute-success').css('display','block');
                $('#execute-success-ok').click(function () {
                  $('#overlay').css('display','none');
                  $('#execute-success').css('display','none');
                  window.location.replace("/admin/sales");
                });
            } else {
              var overlay = document.getElementById('overlay'),
                  alert = document.getElementById('execute-alert'),
                  tableBody = createAlertTableHTML(canExecuteSale);

                var winH = window.innerHeight,
                    winW = window.innerWidth;

                overlay.style.width = winW + "px";
                overlay.style.height = winH + "px";

                overlay.style.display = 'block';
                alert.style.display = 'block';

                $('#alert-table tbody').empty();
                $('#alert-table tbody').append(tableBody);

                $('#execute-alert-ok').click(function () {
                    overlay.style.display = 'none';
                    alert.style.display = 'none';
                });
            }
            // THIS IS THE SAME THING AS ABOVE...
            // $.ajax({
            //   url: 'http://localhost:5000/admin/sales/add',
            //   type: "POST",
            //   dataType: 'application/json',
            //   data: {data: dataToPost},
            //   success: function(data) {
            //     console.log('success');
            //     console.log(data);
            //   }
            // });
        });
    }
});
