// Service Worker
self.addEventListener('install', event => {
    console.log('Service worker installed');
    // 캐싱할 파일 목록을 지정합니다.
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/assets/css/style.css',
                '/assets/css/camera.css',
                '/assets/vendor/bootstrap/css/bootstrap.min.css',
                '/assets/vendor/bootstrap-icons/bootstrap-icons.css',
                '/assets/vendor/boxicons/css/boxicons.min.css',
                '/assets/vendor/glightbox/css/glightbox.min.css',
                '/assets/vendor/swiper/swiper-bundle.min.css',
                '/assets/js/camera.js',
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
