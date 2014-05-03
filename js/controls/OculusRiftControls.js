/*
* New controls - mirrors occulus rift quaternion to camera, with optionally set offset
*/
THREE.OculusRiftControls = function ( camera ) {
  this.obj = camera;
  this.quatoffset = new THREE.Quaternion();
};

THREE.OculusRiftControls.prototype.getObject = function () {
  return this.obj;
};

THREE.OculusRiftControls.prototype.setAxisAngleOffset = function(axis, angle) {
  this.quatoffset.setFromAxisAngle(axis, angle);
};

THREE.OculusRiftControls.prototype.update = function ( delta, vrstate ) {    
  if (vrstate && vrstate.hmd.present) {
    var rot = new THREE.Quaternion(
      vrstate.hmd.rotation[0],
      vrstate.hmd.rotation[1],
      vrstate.hmd.rotation[2],
      vrstate.hmd.rotation[3]);

    this.obj.quaternion = rot;
    this.obj.quaternion.multiply(this.quatoffset);
    
    this.obj.quaternion.normalize();
  } 
};
