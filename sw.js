// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

/* Code Adapted from https://developers.google.com/web/fundamentals/primers/service-workers and https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim */

// Activation occurs when the old service worker no longer controls this 
// webpage. Instead, the new service worker claims the webpage.
self.addEventListener('activate', event => {
  //console.log('Activated');
  event.waitUntil(clients.claim());
});

// Initializing cache name and urls to cache.
let CACHE_NAME = 'journal-cache';
let urlsToCache = [
  './',
  './settings.svg',
  './index.html',
  './style.css',
  './scripts/router.js',
  './scripts/script.js',
  './components/entry-page.js',
  './components/journal-entry.js',
  'https://cse110lab6.herokuapp.com/entries'
];

// The install event should trigger after registering the service worker 
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
  
self.addEventListener('fetch', function(event) {
    //console.log('Fetching');
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
            console.log('Cache hit');
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });


// Registration of the Service Worker
// Included the registration at the end of the file to allow the other 
// eventlisteners to get added first.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}  
