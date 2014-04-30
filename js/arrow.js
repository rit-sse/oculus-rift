(function() {
  var Arrow = function(cb) {
    Damageable.call(this, "models/arrow.obj", Physijs.BoxMesh, 20, 5, cb);
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
    return 10;
  };
  window.Arrow = Arrow;
})();