/**
 * Get the video stream
 * Check capabilities Zoom
 */ 
let isMetaDataLoaded = false;
const video = document.getElementById('video');
let currentZoom = 1;
navigator.mediaDevices.getUserMedia({ video: { 
    width: { ideal: 2560 }, 
    height: { ideal: 1920 },
    facingMode: { exact: "environment" }
} })
.then(function(stream) {
    video.srcObject = stream;
    video.play();
    video.onloadedmetadata = function(e) {
        isMetaDataLoaded = true;
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();
        if (capabilities.zoom) {
            currentZoom = capabilities.zoom.min;
            videoTrack.applyConstraints({
                advanced: [{zoom: currentZoom}]
            });
        }
    };
})
.catch(function(err) {
    console.log("An error occurred: " + err);
});

// Function to take the photo
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
function takePhoto() {
    if (!isMetaDataLoaded) {
        console.log("The metadata for the video has not yet been loaded");
        return;
    }

    if(video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
        console.log("Failed to get video size");
    }
}

function resetCanvas() {
    canvas.width = 0;
    canvas.height = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

// Function to download the photo
let photoCount = 0;
function photoDownload() {
    canvas.toBlob(function(blob) {
        let binaryData = [];
        binaryData.push(blob);
        const binaryPngData = new Blob(binaryData, {type: "image/png"});
        const url = URL.createObjectURL(binaryPngData);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, '');
        const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '');
        const filename = `photo_${formattedDate}_${formattedTime}.png`;

        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }, 'image/png');

    resetCanvas();
}

/**
 * Detect touch at the bottom of the screen
 * Capture Zoom in and out 
 */ 
let touchCount = 0;
let isDownloading = false;
document.body.addEventListener('click', function(event) {
    if(isDownloading) {
        isDownloading = false;
        return; 
    }

    if (event.clientY > window.innerHeight * 0.5) {
        if(touchCount == 0) {
            takePhoto();
            touchCount++;
        } else {
            isDownloading = true;
            photoDownload();
            touchCount = 0;
        }
    } else {
        const videoTrack = video.srcObject.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();
        if (event.clientX > window.innerWidth * 0.5 && capabilities.zoom) {
            currentZoom = Math.min(currentZoom + 0.5, capabilities.zoom.max);
        }
        else if (event.clientX <= window.innerWidth * 0.5 && capabilities.zoom) {
            currentZoom = Math.max(currentZoom - 0.5, capabilities.zoom.min);
        }
        videoTrack.applyConstraints({
            advanced: [{zoom: currentZoom}]
        });
    }
});  

// Open Full Screeen
function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
    document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
    document.documentElement.msRequestFullscreen();
    }
}

// Close Full Screen
function closeFullscreen() {
    if (document.exitFullscreen) {
    document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
    }
}

window.onload = () => {
    openFullscreen();
}