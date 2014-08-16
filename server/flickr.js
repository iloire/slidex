/*!
 * flickr.js - flickr api
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

var request = require('request'),
    sys = require('sys'),
    utils = require('./utils');

var Flickr = module.exports = exports = function Flickr(api_key) {
  if (!api_key) throw Error("api_key required");
  this.api_key = api_key;
  this.host = 'https://api.flickr.com';
  this.per_page = 25;
};

exports.createFlickr = function( api_key ) {
  return new Flickr( api_key );
};

Flickr.prototype._request = function(method, args, callback) {
  // aggregate all params
  var defaults = {
    method: method,
    format: 'json',
    nojsoncallback: 1,
    api_key: this.api_key
  };
  var params = [];
  for (var key in defaults) {
    params.push( key + "=" + defaults[key] );
  }
  for (var key in args) {
    params.push( key + "=" + args[key] );
  }

  var url = this.host + "/services/rest/?" + params.join('&');

  // call api.flickr.com
  request(url, function(error, response, body){
    if (error){
      callback( {stat: 'error', code: 500, message: 'error on request:' + error } );      
    } else {
      data = JSON.parse(body);
      if (data.stat === 'ok') {
        callback( null, data );
      }
      else {
        callback( {stat: 'error', code: data.code, message: data.message} );
      }
    }
  });  
};




Flickr.prototype.search = function(term, args, callback) {
  args = args || {};
  var defaults = { privacy_filter:1, per_page:this.per_page, extras:'description,owner_name,url_m', text:term };
  var req = this._request(
      'flickr.photos.search',
      utils.merge( defaults, args ),
      callback);
};


Flickr.prototype.photoset = function(date, args, callback) {
  var defaults = { date: date, per_page:this.per_page, extras:'owner_name,url_m' };
  //args.photoset_id = '72157610803960909';
  var req = this._request(
      'flickr.photosets.getPhotos',
      utils.merge( defaults, args ),
      callback);
};

Flickr.prototype.mypictures = function(date, args, callback) {
  var defaults = { date: date, per_page:this.per_page, extras:'owner_name,url_m' };
  //args.user_id = '62516217@N00';
  var req = this._request(
      'flickr.people.getPublicPhotos',
      utils.merge( defaults, args ),
      callback);
};


Flickr.prototype.interestingness = function(date, args, callback) {
  var defaults = { date: date, per_page:this.per_page, extras:'owner_name,url_m' };
  var req = this._request(
      'flickr.interestingness.getList',
      utils.merge( defaults, args ),
      callback);
};

Flickr.prototype.getInfo = function(photo_id, secret, callback) {
  var args = { photo_id: photo_id, secret: secret };
  var req = this._request(
      'flickr.photos.getInfo',
      args,
      callback);
};
