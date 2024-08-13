// Before registering the service worker, we need to check if the browser
// has support for the service worker


if(navigator.serviceWorker){
    // After registering, register fn will return a promise 
    navigator.serviceWorker.register('./serviceWorker.js')
    .then(sw=>console.log('Service Worker Registered!'))
    .catch(err=>console.log(`Error: ${err}`))

    // service worker API is event driven
    // It follows a lifecycle once it's registered
    // Install -> Activate -> fetch

    // When the page is loaded and SW is registered, service worker wll be installed.
    // We should listen to the install event in the server worker js file.
}else{
    console.log('This browser does not support Service Worker API.')
}