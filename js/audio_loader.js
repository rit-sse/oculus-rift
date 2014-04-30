(function() {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var sounds = {};
  var Add = function(file) {
    if (sounds[file]) return;
    
    sounds[file] = 'unloaded';
    var request = new XMLHttpRequest();
    request.open("GET", file, true);
    request.responseType = "arraybuffer";

    var loader = this;
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            console.log('error decoding file data: ' + file);
            return;
          }
          sounds[file] = buffer;
        },
        function(error) {
          console.log('decodeAudioData error', error);
        }
      );
    };

    request.onerror = function(e) {
      console.log('Audio XHR Error.', e);
    };

    request.send();
  };

  var Get = function(file) {
    if (!sounds[file]) return;
    while (sounds[file]==='unloaded') {}
    return sounds[file];
  };
  
  var Play = function(path) {
    var sound = Get(path);
    if (!sound) {
      Add(path);
      sound = Get(path);
    }
    
    var source = context.createBufferSource();
    source.buffer = sound;
    source.connect(context.destination);
    source.start(0);
  }

  window.Sound = window.Resource || {};
  window.Sound.Add = Add;
  window.Sound.Get = Get;
  window.Sound.Play = Play;
})();