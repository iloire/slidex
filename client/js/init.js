/*!
 * init.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

new App.Routers.Main();
App.GalleryView = new App.Views.GalleryView();
Backbone.history.start();

$('.content a.pirobox').live('click', function(e){
  var title = $(this).attr('title');
  _gaq.push(['_trackEvent', 'Photos', 'click', title]);
});
