// Get the video stream
navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
.then(function(stream) {
    var video = document.getElementById('video');
    video.srcObject = stream;
    video.play();
})
.catch(function(err) {
    console.log("An error occurred: " + err);
});

// Function to take the photo
function takePhotoAndDownload() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}

function PhotoDownload() {
    canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'photo.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Detect touch at the bottom of the screen
let touchCount = 0;
document.body.addEventListener('click', function(event) {
    if (event.clientY > window.innerHeight * 0.5) {
        if(touchCount++ == 0) {
            takePhotoAndDownload();
        } else {
            PhotoDownload();
            touchCount == 0;
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