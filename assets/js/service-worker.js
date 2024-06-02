// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
}

self.addEventListener('install', event => {
    console.log('Service worker installed');
});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for:', event.request.url);
});
