// service worker is just a JS file running in a separate worker thread (beside main thread where script.js runs)
// this runs in background: ServiceWorker acts like a proxy server between the browser, and backend(if there's any)

// We can use this to cache data & provide offline capabilities as well for our app

// serviceWorkers will not have access to the DOM/localStorage/Session storage/cookies for security purpose
const cacheName='sw-demo/v1'
self.addEventListener('install',(event)=>{
    // wait until the resources are cached.
    // During the SW installation, we can cache the existing data in the browser

    // install process will be completed only when the code is completely executed.
    event.waitUntil(
        // creating a new cache
        // opening a new cache returns a promise
        caches.open(cacheName).then(cache=>{
            // this callback will receive the opened cache as the fn argument
            // adding all resources to the cache
            cache.addAll([
                './index.html',
                './script.js',
                './assets/camera.jpg'
            ])
            console.log('Resources are cached!')
        })
    )
})

// sw is activated
self.addEventListener('activate',(e)=>{
    // The activate event fires after the install event is completed and when the Service Worker takes control 
    // of the pages (or starts controlling them). This event is triggered when the Service Worker is activated 
    // and can start handling events like fetch.

    // commonly used to clean up old caches from previous versions of the Service Worker

    // any operations related to caches returns a promise

    e.waitUntil(
        // get all caches available in the browser and delete the useless caches
        caches.keys().then(cacheNames=>{
            // as deleting the cache returns a promise, use .all to wait until all promises are resolved
            return Promise.all(
                cacheNames.map(cache=>{
                    if(cache !== cacheName){
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
    console.log('Service Worker activated!')
})


// after activating all outgoing requests will be inspected here.
// add an event listener for fetch event.
// and we can inspect every outgoing req here
self.addEventListener('fetch',(e)=>{
    // we can either first search in the cache for the data related to the request and send that data
    // or first resolve the fetch req and cache that response.

    // in the first case, as we are always checking the cache first, we will always end up showing the stale data.

    // in the second case, we will always end up showing the fresh data.

    e.respondWith(
        // first complete the fetch req
        fetch(e.request).then(res=>{
            // cache the response
            let resClone = res.clone()

            caches.open(cacheName).then(cache=>{
                cache.put(e.request,resClone).then(()=>console.log('returning from network'))
            })
            // throw new Error('OFFLINE')
            return res
        }).catch(
            // for whatever reason if the network req is failed(or when offline) [ fetch from cache ]
           (err)=> {
            console.log(`Error: ${err}`)
            console.log('returning from cache')
            return caches.match(e.request).then(cache=>cache)
        }
        )
    )
})