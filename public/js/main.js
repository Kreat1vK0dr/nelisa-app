// FUNCTIONS

function checkIfCanExecuteSale(dataToPost) {
    var data = JSON.parse(dataToPost),
        cannotExecute = [];

    data.forEach(function (item) {
        var inventory = item.data[4],
            quantity = item.data[3];

        var enough = inventory - quantity >= 0;
        if (!enough) {
            var details = {
                description: $("select[name='products'] option[value='" + item.data[0] + "']").text(),
                inventory: item.data[4],
                quantity: item.data[3],
                cantSell: Math.abs(inventory - quantity)
            };
            cannotExecute.push(details);
        }
    });
    return cannotExecute;
}
function checkIfCanAddItem(item) {

      var inventory = item.data[4],
            quantity = item.data[3];

        var enough = inventory - quantity >= 0;
        if (enough) {
        return true;
      } else {
    return false;
  }
}

function createAlertTableHTML(saleItemsArray) {
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

// DOCUMENT READY

$(document).ready(function () {

  // ADD SALE

    if (window.location.pathname === '/sales/add') {
      console.log()


        if (window.localStorage.getItem('sale')) {
            if (JSON.parse(window.localStorage.getItem('sale')).length !== 0) {
                var previousState = JSON.parse(window.localStorage.getItem('table'));
                var html = previousState.map(function (i) {
                    return i.html;
                }).join("");
                $('#no-items-text').css('display', 'none');
                $('#added-items-table thead').css('display', '');
                $('#added-items-table tbody').css('display', '');
                $('#added-items-table tbody').append(html);
                $('#execute-sale').attr("disabled",false);

            } else {
                $('#no-items-text').css('display', '');
                $('#added-items-table thead').css('display', 'none');
                $('#added-items-table tbody').css('display', 'none');
            }
        }
        //NOTE: here it is ok to use .click(function...) because we only have one element to which the handler is assigned.
        $('#add-item').click(function () {
            var details = $('#combobox option:selected'),
                product = details.attr('data-description'),
                price = Number($('#price').val()),
                quantity = Number($('#quantity').val()),
                inventory = Number(details.attr('data-inventory')),
                product_id = Number(details.val()),
                category_id = Number(details.attr("data-categoryId")),
                category = details.attr('data-category'),
                storage = JSON.parse(window.localStorage.getItem('sale')),
                previousState = JSON.parse(window.localStorage.getItem('table'));
console.log([product_id, category_id, price, quantity, inventory]);
console.log("product: ", product);
console.log("details: ", details);
console.log("details category: ", details.attr('data-category'));
console.log("details category Id: ", details.attr('data-categoryId'));
            var allFieldsFilledIn = price != 0 && quantity != 0 && product_id != null && category_id != null;

            console.log(price, quantity, inventory, product_id, category_id, product, category);

            if (allFieldsFilledIn) {
                var sub_total = price * quantity;

                var rowId = storage === null ? 1 : storage.length + 1;
                var sale = {
                        itemId: rowId,
                        data: [product_id, category_id, price, quantity, inventory]
                    },
                    item = [product, category, price, quantity, sub_total];
                var canAddItem = checkIfCanAddItem(sale);
                if (canAddItem) {
                var newRowContent = "<tr style='background-color:#777' data-row-id='" + rowId + "'>";

                item.forEach(function (content) {
                  if (typeof content === 'number') {
                    newRowContent += "<td style='text-align:left'>" + content + "</td>";
                  } else {
                    newRowContent += "<td>" + content + "</td>";
                  }
                });

                newRowContent += "<td style='background-color:rgba(185,46,16,0.8)'><button class='table-links' style='background-color:transparent;border:none'>Remove item(s)</button></td></tr>";

                if (storage && previousState) {
                    var items = storage;
                    items.push(sale);
                    window.localStorage.setItem('sale', JSON.stringify(items));
                    previousState.push({
                        rowId: rowId,
                        html: newRowContent
                    });
                    var newState = previousState;
                    window.localStorage.setItem('table', JSON.stringify(newState));

                    $('#no-items-text').css('display', 'none');
                    $('#added-items-table thead').css('display', '');
                    $('#added-items-table tbody').css('display', '');
                    $('#added-items-table tbody').append(newRowContent);
                } else {
                    window.localStorage.setItem('sale', JSON.stringify([sale]));
                    window.localStorage.setItem('table', JSON.stringify([{
                        rowId: rowId,
                        html: newRowContent
                    }]));
                    console.log(newRowContent);
                    $('#no-items-text').css('display', 'none');
                    $('#added-items-table thead').css('display', '');
                    $('#added-items-table tbody').css('display', '');
                    $('#added-items-table tbody').append(newRowContent);


                }
                $('#execute-sale').attr("disabled",false);

                console.log(localStorage);
                $('#products').val('');
                $('#categories').val('');
                $('#price').val('');
                $('#quantity').val('');
              } else {
                var overlay = document.getElementsByClassName('overlay')[0],
                    alertBox = document.getElementById('execute-alert'),
                    p = "You have <span>"+inventory+"</span> <span class='alert-box-product'>"+product+"</span> <span>in stock</span>.<br/>Trying to sell <span>"+quantity+"</span>.";

                var winH = window.innerHeight,
                    winW = window.innerWidth;

                overlay.style.width = winW + "px";
                overlay.style.height = winH + "px";

                overlay.style.display = 'block';
                alertBox.style.display = 'block';

                $('.alert-box-message').html(p);

                $('.alert-ok').click(function () {
                    overlay.style.display = 'none';
                    alertBox.style.display = 'none';
                });
              }
            } else {
                alert("Please make sure you have filled in all fields before adding an item.");
            }
        });
        //NOTE: better to use .on('click',<selector>, function..) when having to assign a handler to many buttons or similar etc.

        // Remove items
        $('#added-items-table').on('click', ':button', function () {
            var itemId = Number($(this).closest('tr').attr('data-row-id'));
            console.log(itemId);
            var storage = JSON.parse(window.localStorage.getItem('sale'));
            var previousState = JSON.parse(window.localStorage.getItem('table'));

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
                $('#added-items-table thead').css('display', 'none');
                $('#added-items-table tbody').css('display', 'none');
                $('#execute-sale').attr('disabled',true);
            }
            console.log("UpdatedItems", updatedItems);
            console.log("currentState", currentState);
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
            var dataHasBeenAdded = window.localStorage.getItem('table');
            console.log(dataHasBeenAdded);
            // console.log("Data to post: ", JSON.parse(dataToPost));
            if (dataHasBeenAdded) {
                var canExecuteSale = checkIfCanExecuteSale(dataToPost);
                console.log(canExecuteSale);

                if (canExecuteSale.length === 0 && JSON.parse(dataToPost).length != 0) {
                    $.post('http://localhost:5000/sales/add/execute', {
                        data: dataToPost  });

                    window.localStorage.clear();
                    $('#execute-success').css('display', 'block');
                    $('#execute-success-ok').click(function () {
                      window.localStorage.removeItem("sale");
                        $('.overlay').css('display', 'none');
                        $('#execute-success').css('display', 'none');
                        window.location.replace("/sales/add");
                    });

                } else {
                    var overlay = document.getElementsByClassName('overlay')[0],
                        alertBox = document.getElementById('execute-alert'),
                        tableBody = createAlertTableHTML(canExecuteSale);

                    var winH = window.innerHeight,
                        winW = window.innerWidth;

                    overlay.style.width = winW + "px";
                    overlay.style.height = winH + "px";

                    overlay.style.display = 'block';
                    alertBox.style.display = 'block';

                    $('#alert-table tbody').empty();
                    $('#alert-table tbody').append(tableBody);

                    $('.alert-ok').click(function () {
                      $('#alert-table tbody').empty();
                        overlay.style.display = 'none';
                        alertBox.style.display = 'none';
                    });
                }
                // THIS IS THE SAME THING AS ABOVE...
                // $.ajax({
                //   url: 'http://localhost:5000/admin/sales/add/execute',
                //   type: "POST",
                //   dataType: 'application/json',
                //   data: {data: dataToPost},
                //   success: function(data) {
                //     console.log('success');
                //     console.log(data);
                //   }
                // });
            } else {
                alert("No items available to execute sale.");
            }
        });
    }

// ADD PURCHASE

    if (window.location.pathname === '/purchases/add') {

        //NOTE: here it is ok to use .click(function...) because we only have one element to which the handler is assigned.
        $('#execute-purchase').click(function () {
            var unitCost = Number($('#cost').val()),
                quantity = Number($('#quantity').val()),
                inventory = Number($('#products option:selected').attr('data-inventory')),
                supplier_id = Number($('#suppliers').val()),
                product_id = Number($('#products').val()),
                category_id = Number($('#products option:selected').attr('data-category')),
                supplier = $('#suppliers option:selected').text(),
                product = $('#products option:selected').attr('data-description');

            var storage = JSON.parse(window.localStorage.getItem('purchase')),
                previousState = JSON.parse(window.localStorage.getItem('table'));

            console.log("PRODUCT ID", product_id);

            var allFieldsFilledIn = !!supplier_id === true && !!unitCost === true && !!quantity === true && !!product_id === true;
            var notAllFieldsFilledIn = allFieldsFilledIn ? false : true;

            // console.log("supplier_id===true",supplier_id===true, "cost===true",cost===true, "quantity===true",quantity===true, "product_id===true",product_id===true, "category_id===true",category_id===true);
            // console.log("!!supplier_id===true",!!supplier_id===true, "!!cost===true",!!cost===true, "!!quantity===true",!!quantity===true, "!!product_id===true",!!product_id===true);

            console.log("allFieldsFilledIn", allFieldsFilledIn, "notAllFieldsFilledIn", notAllFieldsFilledIn, "supplierId", supplier_id, "product_id", product_id, "category_id", category_id, "cost", cost, "quantity", quantity, "inventory", inventory, "product", product);

            if (allFieldsFilledIn) {
                var sub_total = unitCost * quantity;

                var id = storage === null ? 1 : storage.length + 1;
                var purchase = {
                        itemId: id,
                        data: [supplier_id, product_id, category_id, unitCost, quantity, inventory]
                    };

                    $.post('http://localhost:5000/purchases/add/execute', {
                        data: [purchase]
                    });

                    $('#execute-success').css('display', 'block');

                    $('#execute-success-ok').click(function () {
                        $('.overlay').css('display', 'none');
                        $('#execute-success').css('display', 'none');
                        window.location.replace("/purchases/add");
                    });

            } else {
                alert("No items available to execute purchase.");
            }
        });

                } else {

                }
                console.log(localStorage);
                $('#suppliers').val('');
                $('#products').val('');
                $('#categories').val('');
                $('#cost').val('');
                $('#quantity').val('');

            } else if (notAllFieldsFilledIn) {
                alert("Please make sure you have filled in all fields before adding an item.");
            }
        });
        //NOTE: better to use .on('click',<selector>, function..) when having to assign a handler to many buttons or similar etc.

    if (window.location.pathname.split('/')[1] === 'users') {
      console.log($('#role option:selected').val());
    if ($('#role option:selected').val() === "user") {
      $('#adminRole').css('display','none');
    } else if ($('#role option:selected').val() === "admin") {
      $('#adminRole').css('display',null);
    }

    $('#role').change(function(){
      console.log("select option: ", $('#role option:selected').val());
      if ($('#role option:selected').val() === "user") {
        $('#adminRole').css('display','none');
        $('#adminLabel').css('display','none');
      } else if ($('#role option:selected').val() === "admin") {
        $('#adminRole').css('display',"inline-block");
        $('#adminLabel').css('display',"inline-block");
      }
    });
}

$('.user').on('click', function(){
  $('#popup').toggle();
  $('.caratA').toggle();
  $('.caratB').toggle();
});

});
