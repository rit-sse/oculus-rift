(function() {
  var Damageable = function(model, mass, health) {
    Entity.call(this, model, mass);
    this.setHealth(this.health);
  };
  Damageable.prototype = Object.create( Entity.prototype );
  
  Damageable.prototype.applyDamage = function(damage) {
    this.setHealth(this.getHealth-damage);
    if (this.getHealth<=0) {
      this.setHealth(0);
      this.remove();
    }
  };
    
  Damageable.prototype.getHealth = function() {
    return this.health || 0;
  };
    
  Damageable.prototype.setHealth = function(hp) {
    this.health = hp;
  };
  
  window.Damageable = Damageable;
}).call(this);