(function(){
  var Target = function(cb) {
    var self = this;
    this.setMeshType(Physijs.CylinderMesh);
    this.setMass(0);
    this.setHealth(100);
    this.setModel("models/target.obj", "models/target.mtl", function() {
      cb();
    });
  };
  Target.prototype = Object.create( Damageable.prototype );
  
  window.Target = Target;
})();