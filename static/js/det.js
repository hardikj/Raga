
function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var webcamError = function(e) {
    alert('Webcam error!', e);
};

var video = $('#webcam')[0];
if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: true}, function(stream) {
        video.src = stream;
    }, webcamError);
} else if (navigator.webkitGetUserMedia) {
         navigator.webkitGetUserMedia({audio:false, video:true}, function(stream) {
        video.src = window.webkitURL.createObjectURL(stream);
    }, webcamError);
} else {
    //video.src = 'video.webm'; // fallback.
}

var canvas = $("#tut")[0];
$(canvas).delay(600).fadeIn();
var ctx = canvas.getContext('2d');

//var lastImageData;
var canvasSource = $("#canvas-source")[0];
var canvasBlended = $("#canvas-blended")[0];
var contextSource = canvasSource.getContext('2d');
var contextBlended = canvasBlended.getContext('2d');
contextSource.translate(canvasSource.width, 0);
contextSource.scale(-1, 1);

function update(){
    drawVideo();
    blend();
    //checkAreas();
    //timeout = setTimeout(update, 1000/60);
}

function drawVideo(){
    // image on source canvas 
    contextSource.drawImage(video, 0, 0, video.width, video.height);
}

function blend(){

    //define width and height
    var width = canvasSource.width;
    var height = canvasSource.height;

        // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height);

    // create an image if the previous image doesn’t exist
    //if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);

    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height);

    // blend the 2 images
    //differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    //contextBlended.putImageData(blendedData, 0, 0);
    // store the current webcam image
    //lastImageData = sourceData;

    diff(blendedData.data, sourceData.data)
    ctx.putImageData(blendedData, 0, 0);

}

// Helper functions
function fastAbs(value) {
    // equivalent to Math.abs() but with binary operators;
    return (value ^ (value >> 31)) - (value >> 31);
}

function diff(target, data1){
    i=0;
    while(i<(data1.length/4)){

        target[i*4] = data1[i*4];
        target[i*4+1] = data1[i*4+1];
        target[i*4+ 2] = data1[i*4+2];
        target[i*4+3] = data1[i*4+3];
        
        i++;
    }
}

function differenceAccuracy(target, data1, data2) {
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
                var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
                var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
                var diff = threshold(fastAbs(average1 - average2));
                target[4 * i] = diff;
                target[4 * i + 1] = diff;
                target[4 * i + 2] = diff;
                target[4 * i + 3] = 0xFF;
                ++i;
        }
}











