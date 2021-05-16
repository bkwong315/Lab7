// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

// Activation occurs when the old service worker no longer controls this 
// webpage. Instead, the new service worker claims the webpage.
self.addEventListener('activate', event => {
  //console.log('Activated');
  event.waitUntil(clients.claim());
});

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

  let CACHE_NAME = 'journal-cache';
  let urlsToCache = [
    'https://cse110lab6.herokuapp.com/entries'
  ];
  
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
