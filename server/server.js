/*!
 * server.js - main node class
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

var sys = require('sys'),
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    flickr = require('./flickr'),
    utils = require('./utils'),
    router = require('choreographer').router();
    config = require('./config').config;

var API_KEY = config.flickr_api_key;

function process_result (res, error, result){
  if (error) {
    console.error('Error retreiving data from flickr', error);
  } 
  res.writeHead(error ? 400 : 200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
  res.end( JSON.stringify(error ? error : result) );
}

router.get('/search/*', function(req, res, term) {
  //utils.log( req, '/search' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.search(term, args, function(error, result){
    process_result(res, error, result);
  });
});

router.get('/interesting/*', function(req, res, date) {
  //utils.log( req, '/interesting' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.interestingness(date, args, function(error, result){
    process_result(res, error, result);
  });
});

router.get('/mypictures', function(req, res, date) {
  //utils.log( req, '/mypictures' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.mypictures(date, args, function(error, result){
    process_result(res, error, result);
  });
});

router.get('/photoset', function(req, res, date) {
  //utils.log( req, '/photoset' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.photoset(date, args, function(error, result){
    process_result(res, error, result);
  });

});

router.get('/favicon.ico', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('\n');
});

router.notFound(function(req, res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404: Web service not found.\n');
  utils.log( req, 'not found' );
});

var port = parseInt(process.argv[2], 10) || 3000;
http.createServer(router).listen(port);
sys.puts('server running at port ' + port);
