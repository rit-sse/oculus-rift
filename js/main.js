
Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

var OculusLeapLift = function() {
  this.initScene();
};

OculusLeapLift.prototype.render = function() {
  this.scene.simulate(); // run physics
  this.renderer.render( this.scene, this.camera); // render the scene
  this.requestAnimationFrame();
};

OculusLeapLift.prototype.requestAnimationFrame = function() {
  var self = this;      
  requestAnimationFrame( function() {
    self.render();
  } );
};

OculusLeapLift.prototype.initScene = function() {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setClearColor(0xeeeeff);
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.querySelector( 'body' ).appendChild( this.renderer.domElement );

  this.scene = new Physijs.Scene();

  this.camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set( 60, 50, 60 );
  this.camera.lookAt( this.scene.position );
  this.scene.add( this.camera );

  // Box
  this.box = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 5, 5, 5 ),
    new THREE.MeshPhongMaterial({ color: 0x888888 })
  );
  this.scene.add( this.box );
  this.box.castShadow = true;
  this.box.position.set(0,20,0);
  this.box.__dirtyPosition = true;


  this.floor = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 1000, 1, 1000 ),
    new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  this.floor.receiveShadow = true;
  this.scene.add( this.floor );

  var constraint = new Physijs.DOFConstraint(
    this.floor, // First object to be constrained
    new THREE.Vector3( 0, 0, 0 ) // point in the scene to apply the constraint
  );
  this.scene.addConstraint( constraint );
  constraint.appliedImpulse = 0; //Simulated PointConstraint


  //Lighting
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
  hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
  hemiLight.position.set( 0, 500, 0 );
  this.scene.add( hemiLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.position.set( -1, 0.75, 1 );
  dirLight.position.multiplyScalar(50);
  dirLight.name = "dirlight";
  // dirLight.shadowCameraVisible = true;

  this.scene.add( dirLight );

  dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

  var d = 300;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.35;
  
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;

  this.requestAnimationFrame();
}

document.addEventListener('DOMContentLoaded', function() {
  new OculusLeapLift();
});