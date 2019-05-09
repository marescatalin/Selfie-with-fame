// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'selfieFameDate-1-0';
var cacheName = 'selfieFame-1-0';
var filesToCache = [
    '/',
    '/javascripts/story.js',
    '/javascripts/index.js',
    '/javascripts/map.js',
    '/javascripts/myevent.js',
    '/stylesheets/global.css',
    '/stylesheets/map.css',
    '/stylesheets/story.css',
    '/stylesheets/style.css',
    '/stylesheets/bootstrap.min.css',
    '/stylesheets/google.parent-marker.css',
    '/stylesheets/font-awesome.all.css',
    '/javascripts/bootstrap.min.js',
    '/javascripts/idb.js',
    '/javascripts/jquery-3.3.1.min.js',
    '/javascripts/database.js',
    "/javascripts/popper.min.js"
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * /weather_data posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error - you will have to recover the situation
 *      from there (e.g. showing the cached data)
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, then if netowrk available, it will refresh the cache
         * see stale-while-revalidate at
         * https://jakearchibald.com/2014/offline-cookbook/#on-activate
         */
    event.respondWith(async function () {
        const cache = await caches.open('selfieFame-1-0');
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request);

        event.waitUntil(async function () {
            const networkResponse = await networkResponsePromise;
            await cache.put(event.request, networkResponse.clone());
        }());

        // Returned the cached response if we have one, otherwise return the network response.
        return cachedResponse || networkResponsePromise;
    }());
});
