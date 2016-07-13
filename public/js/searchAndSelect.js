$( function() {
   $.widget( "custom.combobox", {
     _create: function() {
       this.wrapper = $( "<span>" )
         .addClass( "custom-combobox" )
         .insertAfter( this.element );

       this.element.hide();
       this._createAutocomplete();
       this._createShowAllButton();
     },

     _createAutocomplete: function() {
       var selected = this.element.children( ":selected" ),
         value = selected.val() ? selected.text() : "";

       this.input = $( "<input>" )
         .appendTo( this.wrapper )
         .val( value )
         .attr( "title", "" )
         .attr("placeholder","Search or select a product")
         .addClass( "product custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
         .autocomplete({
           delay: 0,
           minLength: 0,
           source: $.proxy( this, "_source" ),
           select: function(e, ui) {

             var fieldVal = ui.item.value;
             console.log(fieldVal);
             var products = $("#combobox option").map(function(){return $(this).text(); });
             var validEntry = $.inArray(fieldVal, products)!==-1;
             console.log("Valid Entry: ", validEntry);
             console.log("PRODUCTS: ",products);
             if (validEntry) {
               console.log("Should change price now");
               price = $('select[name="product"] option[data-description="'+ fieldVal +'"]').attr('data-price');
               console.log("This is field val: ", fieldVal);
               console.log("This is price: ", price);
               $('#price').val(price);
               $('#quantity').val(1);
               }
            //  $("#combobox").val($("#combobox option[data-description='" + ui.item.value + "']").val());
           }
         })
         .tooltip({
           classes: {
             "ui-tooltip": "ui-state-highlight"
           }
         });

       this._on( this.input, {
         autocompleteselect: function( event, ui ) {
           ui.item.option.selected = true;
           this._trigger( "select", event, {
             item: ui.item.option
           });
         },

         autocompletechange: "_removeIfInvalid"
       });
     },

     _createShowAllButton: function() {
       console.log("BUSY WITH CREATE SHOW ALL BUTTON FUNC");
       var input = this.input,
         wasOpen = false;
         console.log("THIS: ", this)
         console.log("THIS IS INPUT: ", input);
         console.log("THIS IS WRAPPER: ", this.wrapper)

      this.atag = $( "<a>" )
         .attr( "tabIndex", -1 )
         .attr( "title", "Show All Items" )
         .attr("role","button")
         .tooltip()
         .appendTo( this.wrapper )
         .removeClass( "ui-corner-all" )
         .addClass( "show-all-button ui-button ui-widget ui-button-icon-only custom-combobox-toggle ui-corner-right")
         .on( "mousedown", function() {
           wasOpen = input.autocomplete( "widget" ).is( ":visible" );
         })
         .on( "click", function() {
           input.trigger( "focus" );

           // Close if already visible
           if ( wasOpen ) {
             return;
           }

           // Pass empty string as value to search for, displaying all results
           input.autocomplete( "search", "" );
         })
        this.aspan = $("<span>")
         .attr("class", "ui-button-icon ui-icon ui-icon-triangle-1-s")
         .appendTo(this.atag);
         $("<span>")
         .attr("class", "ui-button-icon-space")
         .text(" ")
         .appendTo(this.atag);

        //  console.log("THIS IS A TAG", atag);

     },

     _source: function( request, response ) {
       var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
       response( this.element.children( "option" ).map(function() {
         var text = $( this ).text();
         if ( this.value && ( !request.term || matcher.test(text) ) )
           return {
             label: text,
             value: text,
             option: this
           };
       }) );
     },

     _removeIfInvalid: function( event, ui ) {

       // Selected an item, nothing to do
       if ( ui.item ) {
         return;
       }

       // Search for a match (case-insensitive)
       var value = this.input.val(),
         valueLowerCase = value.toLowerCase(),
         valid = false;
       this.element.children( "option" ).each(function() {
         if ( $( this ).text().toLowerCase() === valueLowerCase ) {
           this.selected = valid = true;
           return false;
         }
       });

       // Found a match, nothing to do
       if ( valid ) {
         return;
       }

       // Remove invalid value
       this.input
         .val( "" )
         .attr( "title", value + " didn't match any item" )
         .tooltip( "open" );
       this.element.val( "" );
       this._delay(function() {
         this.input.tooltip( "close" ).attr( "title", "" );
       }, 2500 );
       this.input.autocomplete( "instance" ).term = "";
     },

     _destroy: function() {
       this.wrapper.remove();
       this.element.show();
     }
   });

   $( "#combobox" ).combobox();
   $( "#toggle" ).on( "click", function() {
     $( "#combobox" ).toggle();
   });
 } );
