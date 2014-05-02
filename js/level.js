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

  Level.prototype.start = function(context) {
    context.score = 0;
    this.setupfunc(this, context);
  };
  
  Level.prototype.end = function(context) {
    this.teardownfunc(this, context);
  };
  
  window.Level = Level;
})();