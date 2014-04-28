(function(){
  var Target = function(cb) {
    Damageable.call(this, "models/target.obj", Physijs.CylinderMesh, 0, 25, cb);
  };
  Target.prototype = Object.create( Damageable.prototype );
  
  window.Target = Target;
})();