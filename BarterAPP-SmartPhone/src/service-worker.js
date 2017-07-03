/**
 * Sw-toolbox: A collection of service worker tools for offlining runtime requests
 * Check out this https://googlechrome.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};


self.toolbox.precache(
  [
    './build/main.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);


self.toolbox.router.any('/*', self.toolbox.cacheFirst);


self.toolbox.router.default = self.toolbox.networkFirst;
