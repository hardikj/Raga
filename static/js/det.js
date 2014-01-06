
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
        update();
    }, webcamError);
} else if (navigator.webkitGetUserMedia) {
         navigator.webkitGetUserMedia({audio:false, video:true}, function(stream) {
        video.src = window.webkitURL.createObjectURL(stream);
                update();
    }, webcamError);
} else {
    //video.src = 'video.webm'; // fallback.
}

var canvas = $("#tut")[0];
$(canvas).delay(600).fadeIn();
var ctx = canvas.getContext('2d');

var lastImageData;
var canvasSource = $("#canvas-source")[0];
//var canvasBlended = $("#canvas-blended")[0];
var contextSource = canvasSource.getContext('2d');
//contextBlended = canvasBlended.getContext('2d');
contextSource.translate(canvasSource.width, 0);
contextSource.scale(-1, 1);


function update(){
    drawVideo();
    blend();
    checkAreas();
    requestAnimFrame(update);
}

function drawVideo(){
    // image on source canvas 
    contextSource.drawImage(video, 0, 0, video.width, video.height);
}

function blend(){

    var width = canvasSource.width;
    var height = canvasSource.height;
    // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height);
    // create an image if the previous image doesn’t exist
    if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height);
    //diff(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    //contextBlended.putImageData(blendedData, 0, 0);
    gooddiff(blendedData.data, sourceData.data, lastImageData.data)
    ctx.putImageData(blendedData, 0, 0);
    // store the current webcam image
    lastImageData = sourceData;

}

function checkAreas() {
        var data;
        ratio = $("#canvas-highlights").width()/$('video').width();
        x = hotSpots.offsetLeft;
        y = hotSpots.offsetTop,
        w = hotSpots.scrollWidth,
        h = hotSpots.scrollHeight
        var blendedData = ctx.getImageData(x,y,w,h);
        var i = 0;
        var average = 0;

        while (i < (blendedData.data.length / 4)) {
            //Every time interval Add the averages of this area
            average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
            ++i;
        }

        // avarage is addition of the back coler present in the hotspot
        // i.e (blendedData.data.length/4)*value_of_black 
        // so if the result of dividion by (blendedData.data.length/4) is greater that 1
        // we have some disturbance and this is detection!!
        average = Math.round(average / (blendedData.data.length / 4));
        if (average > 20) {
            console.log("ok baby"+average);
            playSound(currentKit.stringsBuffer[0], 0);
            $("hotSpots").fadeOut();
        }
}



// ============== Helper functions ============================
function diff(target, data1, data2){
    if (data1.length != data2.length) return null;
    var i=0;
    while(i<(data1.length/4)){

        target[i*4] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i+1]);
        target[i*4+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
        target[i*4+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
        target[i*4+3] = 0xFF;
        
        i++;
    }
}

function gooddiff(target, data1, data2) {
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

function threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
}

function fastAbs(value) {
    // equivalent to Math.abs() but with binary operators;
    return (value ^ (value >> 31)) - (value >> 31);
}

window.requestAnimFrame = (function () {
                return window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                        function (callback) {
                                window.setTimeout(callback, 1000 / 60);
                        };
        })();
