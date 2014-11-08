(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['debug'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div>\n	<p> "
    + escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper)))
    + " </p>\n	<p> "
    + escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper)))
    + " </p>\n</div>";
},"useData":true});
templates['queue-song'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\n<li class=\"list-group-item\" style=\"padding: 10px\" data-id="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n<div class=\"media\">\n  <span class=\"pull-left\">\n    <img class=\"media-object\" src="
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.thumbnails : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.url : stack1), depth0))
    + " height=\"50\" width=\"67\" alt=\"thumbnail\" />\n  </span>\n  <div class=\"media-body\">\n    <h4 class=\"media-heading\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>   \n    <span class=\"date\">"
    + escapeExpression(((helpers.getMetadataString || (depth0 && depth0.getMetadataString) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.statistics : depth0)) != null ? stack1.viewCount : stack1), (depth0 != null ? depth0.duration : depth0), {"name":"getMetadataString","hash":{},"data":data})))
    + "</span>\n  </div>\n</div>\n</li>\n";
},"useData":true});
templates['queue-songs'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials['queue-song'], '    ', 'queue-song', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul id=\"queue-songs\" class=\"list-group\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0['queue-songs'] : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>";
},"usePartial":true,"useData":true});
templates['search-result'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\n<li class=\"list-group-item\" style=\"padding: 10px\" data-id="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n<div class=\"media\">\n  <span class=\"pull-left\">\n    <img class=\"media-object\" src="
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.thumbnails : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.url : stack1), depth0))
    + " height=\"50\" width=\"67\" alt=\"thumbnail\" />\n  </span>\n  <div class=\"media-body\">\n    <h4 class=\"media-heading\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>   \n    <span class=\"date\">"
    + escapeExpression(((helpers.getMetadataString || (depth0 && depth0.getMetadataString) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.statistics : depth0)) != null ? stack1.viewCount : stack1), (depth0 != null ? depth0.duration : depth0), {"name":"getMetadataString","hash":{},"data":data})))
    + "</span>\n    <div class=\"btn-group btn-group-xs right\" style=\"margin-top: -20px\">\n        <button type=\"button\" class=\"btn btn-danger add-button\" arrayIndex="
    + escapeExpression(lambda((data && data.index), depth0))
    + ">+</button>\n    </div>\n  </div>\n</div>\n</li>\n\n";
},"useData":true});
templates['search-results'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials['search-result'], '    ', 'search-result', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul id=\"posts\" class=\"list-group\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0['search-results'] : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"usePartial":true,"useData":true});
})();
