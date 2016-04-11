Handlebars templates look like regular HTML, with embedded handlebars expressions.
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{body}}
  </div>
</div>

You can deliver a template to the browser by including it in a <script> tag.
<script id="entry-template" type="text/x-handlebars-template">
  <div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
      {{body}}
    </div>
  </div>
</script>

Compile a template in JavaScript by using Handlebars.compile
var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
It is also possible to precompile your templates.
This will result in a smaller required runtime library and significant savings from not having to compile the template in the browser.
This can be especially important when working with mobile devices.
