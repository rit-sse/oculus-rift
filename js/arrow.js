(function() {
  var Arrow = function(cb) {
    Damageable.call(this, "models/arrow.obj", Physijs.ConvexMesh, 20, 5, cb);
    var self=this;
    setTimeout(function() { //remove arrows automatically after some time
      if (self)
        self.remove();
    },30000)
  };
  Arrow.prototype = Object.create( Damageable.prototype );
  
  Arrow.prototype.launch = function(impulse) {
    this._physobj.applyCentralImpulse(impulse);
  };
  
  Arrow.prototype.onCollision = function(other, linvel, angvel) {
    if (other instanceof Damageable) { //Welp
      other.applyDamage(this.getDamage());
      this.remove();
    }
  };
  
  Arrow.prototype.getDamage = function() {
    return 100;
  };
  window.Arrow = Arrow;
})();