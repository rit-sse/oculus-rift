
Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';

var OculusLeapLift = function() {

  this.path = [new THREE.Vector3(0,10,200), new THREE.Vector3(0,200,0), new THREE.Vector3(200,10,0)];
  this.ttl = 4000;
  
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
  var delta = Date.now() - this.time;
  this.totaltime += delta;
  this.controls.update( delta, polled ? this.vrstate : null );
  this.time = Date.now();
  
  if (this.totaltime >= this.ttl)
    this.totaltime = this.ttl;
  
  var pos = this.interpolation(this.path, (Math.sin(this.totaltime/this.ttl)+1)/2);
  this.camera.position = pos;
  
  this.effect.render( this.scene, this.camera );
  
  if (this.totaltime === this.ttl) {
    this.endLevel();
  }
  
  this.requestAnimationFrame();
};

OculusLeapLift.prototype.startLevel = function(num) {
  var level = window.Levels[num];
  console.log(num);
  this.path = level.path;
  this.ttl = level.duration;
  this.totaltime = 0;
  level.start(this);
  this.level = level;
}

OculusLeapLift.prototype.endLevel = function() {
  this.level.end(this);
  this.ttl = 99999999999999999;
  this.totaltime = 0;
  this.lastlevel = this.level;
  delete this.level;
}

OculusLeapLift.prototype.advanceLevel = function() {
  if (!this.level) { //Only operate when there's no active level
    if (this.lastlevel) { //Go to next level if it exists
      console.log(window.Levels.length, this.lastlevel.id)
      if ((window.Levels.length-1)<=this.lastlevel.id) {
        this.startLevel(0);
      } else { 
        this.startLevel(this.lastlevel.id+1);
      }
    } else { //Go to first level
      this.startLevel(0);
    }
  }
}

OculusLeapLift.prototype.PointOn3DCurve = function (dis,pt1,pt2,pt3) {
	var out1 = Math.pow((1-dis),2)*pt1.x+2*(1-dis)*dis*pt2.x+Math.pow(dis,2)*pt3.x;
	var out2 = Math.pow((1-dis),2)*pt1.y+2*(1-dis)*dis*pt2.y+Math.pow(dis,2)*pt3.y;
	var out3 = Math.pow((1-dis),2)*pt1.z+2*(1-dis)*dis*pt2.z+Math.pow(dis,2)*pt3.z;
	return new THREE.Vector3(out1,out2,out3);
}

OculusLeapLift.prototype.interpolation = function(path, fraction) {
  return this.PointOn3DCurve(fraction, path[0], path[1], path[2]);
};

OculusLeapLift.prototype.shootBullet = function() {
  
  var local = new THREE.Vector3(0,0,-1);
  var world = local.applyMatrix4(this.camera.matrixWorld);
  var dir = world.sub(this.camera.position).normalize();

  var scope = this;
  var bullet = new Arrow(function() {
    bullet.setPos(scope.camera.position.clone().add(dir.multiplyScalar(2)));
    var eul = new THREE.Euler();
    eul.setFromQuaternion(scope.camera.quaternion);
    eul.y += Math.PI;
    var qu = new THREE.Quaternion();
    qu.setFromEuler(eul);
    bullet.setRotation(qu);
    bullet.launch(dir.multiplyScalar(1000));
  });
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

  this.floor = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 1000, 1, 1000 ),
    new THREE.MeshPhongMaterial({ color: 0x666666 }),
    0 //0 mass, ground.
  );
  this.floor.receiveShadow = true;
  this.scene.add( this.floor );
  
  this.scene.setGravity(new THREE.Vector3(0,-15,0));

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
  this.scene.add(this.controls.getObject());

  this.vrstate = new vr.State();
  
  // Poll VR, if it's ready.
  var polled = vr.pollState(this.vrstate);
  this.controls.update( Date.now() - this.time, polled ? this.vrstate : null );

  this.effect.render( this.scene, this.camera );

  this.time = Date.now();  

  document.querySelector( 'body' ).appendChild( this.renderer.domElement );

  Entity.setWorld(this.scene); //Set up the entity system to work with this environment
  
  this.requestAnimationFrame();
};

vr.load(function(err) {
  OLL = new OculusLeapLift();
  window.addEventListener('keypress', function(e){
  var keycode = e.keyCode;
    if (keycode==32) { //Spacebar
      if (OLL.level) {
        OLL.shootBullet();
      } else {
        OLL.advanceLevel();
      }
    }
  }, false);
});