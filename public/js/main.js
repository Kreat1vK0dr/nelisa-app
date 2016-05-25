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
        $('#products').change(function () {
            $('#cost').val($('#products option:selected').attr('data-cost'));
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
                product_id = Number($('#products').val()),
                category_id = Number($('#categories').val()),
                product = $('#products option:selected').attr('data-description'),
                category = $('#categories option:selected').attr('data-description'),
                storage = JSON.parse(window.localStorage.getItem('sale')),
                previousState = JSON.parse(window.localStorage.getItem('table'));
            var allFieldsFilledIn = price != 0 && quantity != 0 && product_id != null && category_id != null;

            console.log(price, quantity, inventory, product_id, category_id, product, category);

            if (allFieldsFilledIn) {
                var sub_total = price * quantity;

                var id = storage === null ? 1 : storage.length + 1;
                var sale = {
                        itemId: id,
                        data: [product_id, category_id, price, quantity, inventory]
                    },
                    item = [product, category, price, quantity, inventory, sub_total];

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

                    $('#added-items-table thead').css('display', '');
                    $('#added-items-table tbody').css('display', '');
                    $('#added-items-table tbody').append(newRowContent);
                } else {
                    window.localStorage.setItem('sale', JSON.stringify([sale]));
                    window.localStorage.setItem('table', JSON.stringify([{
                        rowId: id,
                        html: newRowContent
                    }]));
                    console.log(newRowContent);
                    $('#no-items-text').css('display', 'none');
                    $('#added-items-table thead').css('display', '');
                    $('#added-items-table tbody').css('display', '');
                    $('#added-items-table tbody').append(newRowContent);
                }
                console.log(localStorage);
                $('#products').val('');
                $('#categories').val('');
                $('#cost').val('');
                $('#quantity').val('');
            } else {
                alert("Please make sure you have filled in all fields before adding an item.");
            }
        });
        //NOTE: better to use .on('click',<selector>, function..) when having to assign a handler to many buttons or similar etc.
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
        //               .data({cost: data.cost, category: data.category_id})
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
                        data: dataToPost
                    });
                    window.localStorage.clear();
                    $('#execute-success').css('display', 'block');
                    $('#execute-success-ok').click(function () {
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

                    $('#execute-alert-ok').click(function () {
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

        if (window.localStorage.getItem('purchase')) {

            if (JSON.parse(window.localStorage.getItem('purchase')).length !== 0) {

                var previousState = JSON.parse(window.localStorage.getItem('table'));

                var html = previousState.map(function (i) {
                    return i.html;
                }).join("");

                $('#no-items-text').css('display', 'none');
                $('#added-items-purchases-table thead').css('display', '');
                $('#added-items-purchases-table tbody').css('display', '');
                $('#added-items-purchases-table tbody').append(html);

            } else {
                $('#no-items-text').css('display', '');
                $('#added-items-purchases-table thead').css('display', 'none');
                $('#added-items-purchases-table tbody').css('display', 'none');
            }
        }

        $('#products').change(function () {
            $('#categories').val($('#products option:selected').attr('data-category'));
            //
            // {{#products}}
            // <option value="{{id}}" data-price="{{price}}" data-inventory="{{inventory}}" data-description="{{description}}" data-category="{{category_id}}">{{description}}</option>
            // {{/products}}
        });

        //NOTE: here it is ok to use .click(function...) because we only have one element to which the handler is assigned.
        $('#add-item').click(function () {
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
                    },
                    item = [supplier, product, unitCost, quantity];


                var newRowContent = "<tr data-row-id='" + id + "'>";

                item.forEach(function (content) {
                    newRowContent += "<td>" + content + "</td>";
                });

                newRowContent += "<td><button >Remove item(s)</button></td></tr>";

                if (storage && previousState) {
                    var items = storage;
                    items.push(purchase);
                    window.localStorage.setItem('purchase', JSON.stringify(items));
                    previousState.push({
                        rowId: id,
                        html: newRowContent
                    });
                    var newState = previousState;
                    window.localStorage.setItem('table', JSON.stringify(newState));

                    $('#no-items-text').css('display', 'none');

                    $('#added-items-purchases-table thead').css('display', '');
                    $('#added-items-purchases-table tbody').css('display', '');
                    $('#added-items-purchases-table tbody').append(newRowContent);
                } else {
                    window.localStorage.setItem('purchase', JSON.stringify([purchase]));
                    window.localStorage.setItem('table', JSON.stringify([{
                        rowId: id,
                        html: newRowContent
                    }]));
                    console.log(newRowContent);
                    $('#no-items-text').css('display', 'none');
                    $('#added-items-purchases-table thead').css('display', '');
                    $('#added-items-purchases-table tbody').css('display', '');
                    $('#added-items-purchases-table tbody').append(newRowContent);
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
        $('#added-items-purchases-table').on('click', ':button', function () {
            var itemId = Number($(this).closest('tr').attr('data-row-id'));
            console.log(itemId);
            var storage = JSON.parse(window.localStorage.getItem('purchase'));
            var previousState = JSON.parse(window.localStorage.getItem('table'));
            console.log(storage);
            var updatedItems = storage.filter(function (i) {
                return i.itemId !== itemId;
            });
            var currentState = previousState.filter(function (i) {
                return i.rowId !== itemId;
            });
            window.localStorage.setItem('purchase', JSON.stringify(updatedItems));
            window.localStorage.setItem('table', JSON.stringify(currentState));
            $(this).closest('tr').remove();
            if (updatedItems.length === 0) {
                $('#no-items-text').css('display', '');
                $('#added-items-purchases-table thead').css('display', 'none');
                $('#added-items-purchases-table tbody').css('display', 'none');
            }
            console.log(updatedItems);
            console.log(currentState);
        });

        $('#execute-purchase').click(function (event) {
            event.preventDefault();
            console.log("executing purchase button clicked");
            var dataToPost = window.localStorage.getItem('purchase');
            var dataHasBeenAdded = window.localStorage.getItem('table');
            console.log(dataHasBeenAdded);
            // console.log("Data to post: ", JSON.parse(dataToPost));
            if (dataHasBeenAdded) {

                if (JSON.parse(dataToPost).length != 0) {
                    $.post('http://localhost:5000/purchases/add/execute', {
                        data: dataToPost
                    });

                    window.localStorage.clear();

                    $('#execute-success').css('display', 'block');

                    $('#execute-success-ok').click(function () {
                        $('.overlay').css('display', 'none');
                        $('#execute-success').css('display', 'none');
                        window.location.replace("/purchases/add");
                    });

                } else {
                    var overlay = document.getElementsByClassName('overlay')[0],
                        alertBox = document.getElementById('execute-alert'),
                        tableBody = createAlertTableHTML(canExecutePurchase);

                    var winH = window.innerHeight,
                        winW = window.innerWidth;

                    overlay.style.width = winW + "px";
                    overlay.style.height = winH + "px";

                    overlay.style.display = 'block';
                    alertBox.style.display = 'block';

                    $('#alert-table tbody').empty();
                    $('#alert-table tbody').append(tableBody);

                    $('#execute-alert-ok').click(function () {
                        overlay.style.display = 'none';
                        alertBox.style.display = 'none';
                    });
                }
            } else {
                alert("No items available to execute purchase.");
            }
        });
    }
});
