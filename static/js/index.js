
var context = null;
var currentKit = {};
window.onload = ina;
window.addEventListener('load', ina, false);

function Kit(){

    this.strings = null;
    this.stringsBuffer = Array();
}

Kit.prototype.load = function(){
    this.strings = ['samples/AH.wav','samples/LlW Kick 3.wav','samples/END.wav']; //,'samples/','samples/'];

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
    console.log(source + "\n" + context);
    source.buffer = buffer;                    
    source.connect(context.destination);
    source.loop = true;    
    source.start(a); 
    kit.source = source;
}


document.getElementById("s1").onclick = function(){
    playSound(currentKit.stringsBuffer[0], 0);
}

document.getElementById("s2").onclick = function(){
    playSound(currentKit.stringsBuffer[1], 0);
}


document.getElementById("s3").onclick = function() {
    kit.source.stop(0);
}


