// Get the video stream
let isMetaDataLoaded = false;
let video = document.getElementById('video');
let currentZoom = 1;
navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
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
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
function takePhoto() {
    if (!isMetaDataLoaded) {
        console.log("The metadata for the video has not yet been loaded");
        return;
    }

    if(video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
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
        let binaryPngData = new Blob(binaryData, {type: "image/png"});
        let url = URL.createObjectURL(binaryPngData);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `photo${photoCount++}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }, 'image/png');

    resetCanvas();
}

// Detect touch at the bottom of the screen
let touchCount = 0;
document.body.addEventListener('click', function(event) {
    const videoTrack = video.srcObject.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    if (event.clientX > window.innerWidth * 0.5 && capabilities.zoom) {
        currentZoom = Math.min(currentZoom + 1, capabilities.zoom.max);
    }
    else if (event.clientX <= window.innerWidth * 0.5 && capabilities.zoom) {
        currentZoom = Math.max(currentZoom - 1, capabilities.zoom.min);
    }
    videoTrack.applyConstraints({
        advanced: [{zoom: currentZoom}]
    });

    // 기존의 사진 촬영 또는 다운로드 로직을 실행합니다.
    if (event.clientY > window.innerHeight * 0.5) {
        if(touchCount == 0) {
            takePhoto();
            touchCount++;
        } else {
            photoDownload();
            touchCount = 0;
        }
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