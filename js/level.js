/*
* Container for level information
*/

(function(){
  var Level = function(path, time, setup, teardown) {
    this.path = path;
    this.duration = time;
    this.setupfunc = setup;
    this.teardownfunc = teardown;
  };

  Level.prototype.start = function() {
    this.setupfunc(this);
  };
  
  Level.prototype.end = function() {
    this.teardownfunc(this);
  };
  
  Level.prototype.next = function(level) {
    this.nextlevel = level;
    return level;
  };
  
  window.Level = Level;
})();