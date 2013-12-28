var context;
var sound;
window.onload = ina
window.addEventListener('load', ina, false);

function ina() {
    try {
     // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
        sound = loadSound('static/js/lazarus.mp3');
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
 }

function loadSound(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    // Decode asynchronously
    xhr.onload = function() {
        context.decodeAudioData(xhr.response, function(buffer) {
        sound = buffer;
        return sound;
        });
    }
    xhr.send();
};

function playSound(buffer) {
    var source = context.createBufferSource(); 
    console.log(source.buffer + "\n" + buffer);
    source.buffer = buffer;                    
    source.connect(context.destination);      
    source.start(0);                           
}

function init(){
        playSound(sound);
}
