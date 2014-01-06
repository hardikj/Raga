
var context = null;
var currentKit = {};
window.onload = ina;
window.addEventListener('load', ina, false);

function Kit(){

    this.strings = null;
    this.stringsBuffer = Array();
}

Kit.prototype.load = function(){
    this.strings = ['samples/bellguitar2.mp3']; //,'samples/','samples/'];

    for (var i = 0; i < this.strings.length; i++) {
        this.loadSample(this.strings[i], i);
    };
}

Kit.prototype.loadSample = function(url, index){

    var kit = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        context.decodeAudioData(xhr.response, function(buffer) {
        kit.stringsBuffer[index] = buffer;
        });
    }
    xhr.send();
}

function ina() {
    try {
        console.log("hello");
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    kit = new Kit();
    kit.load()
    currentKit = kit;
 }



function playSound(buffer, a) {

    var source = context.createBufferSource(); 
    source.buffer = buffer;                    
    source.connect(context.destination);   
    source.noteOn(a); 
    setTimeout(600);
    currentKit.source = source;
}

/*
document.getElementById("s1").onclick = function(){
    playSound(currentKit.stringsBuffer[0], 0);
}

document.getElementById("s3").onclick = function() {
    kit.source.stop(0);
}

*/
