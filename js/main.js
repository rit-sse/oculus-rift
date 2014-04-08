
Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';

var OculusLeapLift = function() {
  this.initScene();

  var self = this;
  var handleResize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();

    self.effect.setSize( window.innerWidth, window.innerHeight );
  };
  window.addEventListener( 'resize', handleResize, false );
};

OculusLeapLift.prototype.render = function() {
  this.scene.simulate(); // run physics
  
  var polled = vr.pollState(this.vrstate);
  this.controls.update( Date.now() - this.time, polled ? this.vrstate : null );
  this.time = Date.now();
  
  this.effect.render( this.scene, this.camera );
  this.requestAnimationFrame();
};

var origin = new THREE.Vector3(0,0,0);
OculusLeapLift.prototype.puntBox = function(vec) {
  this.box.applyCentralImpulse(vec);
};

OculusLeapLift.prototype.requestAnimationFrame = function() {
  var self = this;      
  requestAnimationFrame( function() {
    self.render();
  });
};

OculusLeapLift.prototype.initScene = function() {
  var self = this;
  this.time = Date.now();
  this.renderer = new THREE.WebGLRenderer({
    devicePixelRatio: 1,
    alpha: false,
    clearColor: 0xffffff,
    antialias: true
  });
  this.renderer.setClearColor(0xffffff);
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  this.scene = new Physijs.Scene();


  this.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set( 60, 50, 60 );
  this.camera.lookAt( this.scene.position );
  //this.scene.add( this.camera );

  this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  // Box
  this.box = new Physijs.SphereMesh(
    new THREE.SphereGeometry( 2, 10 ),
    new THREE.MeshPhongMaterial({ color: 0x888888 })
  );
  this.scene.add( this.box );
  this.box.castShadow = true;
  this.box.position.set(0,20,0);
  this.box.__dirtyPosition = true;
  this.box.addEventListener('collision', function(otherthing, linvel, angvel) {
    if (otherthing===self.target) {
      self.box.position.set(0,20,0);
      self.controls.getObject().position.set(0,10,10);
      self.box.setLinearVelocity(new THREE.Vector3(0,0,0));
      self.box.setAngularVelocity(new THREE.Vector3(0,0,0));
      self.controls.getObject().__dirtyPosition = true;
      self.box.__dirtyPosition = true;
    }
  });


  this.floor = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 1000, 1, 1000 ),
    new THREE.MeshPhongMaterial({ color: 0x666666 }),
    0 //0 mass, ground.
  );
  this.floor.receiveShadow = true;
  this.scene.add( this.floor );
  
  this.target = new Physijs.BoxMesh(
    new THREE.CubeGeometry(10,10,1),
    new THREE.MeshPhongMaterial({ color: 0xfe34ac }),
    0 //0 mass, ground.
  );
  this.target.castShadow = true;
  this.target.receiveShadow = true;
  this.scene.add(this.target);
  this.target.position = new THREE.Vector3(0,5,-10);
  this.target.__dirtyPosition = true;

  this.scene.setGravity(new THREE.Vector3(0,-10,0));


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
  this.renderer.sortObjects = false;

  this.effect = new THREE.OculusRiftEffect(this.renderer);

  // Right Oculus Parameters are yet to be determined
  this.effect.separation = 20;
  this.effect.distortion = 0.1;
  this.effect.fov = 110;

  
  this.controls = new THREE.OculusRiftControls( this.camera );
  this.scene.add( this.controls.getObject() );

  this.vrstate = new vr.State();
  
  // Poll VR, if it's ready.
  var polled = vr.pollState(this.vrstate);
  this.controls.update( Date.now() - this.time, polled ? this.vrstate : null );

  this.effect.render( this.scene, this.camera );

  this.time = Date.now();  

  document.querySelector( 'body' ).appendChild( this.renderer.domElement );

  this.requestAnimationFrame();
};

vr.load(function(err) {
  console.log(err);
  OLL = new OculusLeapLift();
});