(function(){
  var shatter = 'sound/doop.mp3';
  Sound.Add(shatter);
  
  var Target = function(cb) {
    var self = this;
    this.setMeshType(Physijs.CylinderMesh);
    this.setMass(0);
    this.setHealth(100);
    this.setModel("models/target32.obj", "models/target32.mtl", function() {
      cb();
    });
  };
  Target.prototype = Object.create( Damageable.prototype );
  
  Target.prototype.onRemove = function() {
    console.log('Playing shatter sound');
    Sound.Play(shatter);
  };
  
  window.Target = Target;
})();