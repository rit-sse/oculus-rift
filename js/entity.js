/*
Entity.js - A Wrapper around Physi.js and Three.js that provides a
  game-esque 3d entity system
*/
(function() {
  var Entity = function(model, mass) {
    var self = this;
    Eventable.call(this); //Give this the abilty to emit events
    if (model) this.setModel(model);
    if (mass && mass>0) this.setMass(mass);
  };
  
  Entity.prototype.setModel = function(path, cb) {
    var self = this;
    var loader;
    if (path.endsWith('.js') || path.endsWith('.json')) {
      loader = new THREE.JSONLoader(); 
    } else if (path.endWith('.obj')) {
      loader = new THREE.OBJLoader();
    } else if (path.endWith('.dae')) {
      loader = new THREE.ColladaLoader();
    }
    loader.options.convertUpAxis = true; 
    //Most models probably don't use the three.js coordinate system, some might, though. Balance of probabilities.
    
    loader.load(path, function(geometry, mats) {
      self.setGeometry(geometry, mats);
      if (cb) cb();
    });
  };
  
  Entity.prototype.setGeometry = function(geom, mats) {
	var facemat = new THREE.MeshFaceMaterial( mats[0] );
    
    if (this._physobj) {
      var pos = this.getPos();
      var rot = this.getRotation();
      this._physobj.dispose();
      this._physobj = new Physijs.ConcaveMesh(geom, facemat);
      this.addToWorld();
      this.setPos(pos);
      this.setRotation(rot);
    } else {
      this._physobj = new Physijs.ConcaveMesh(geom, facemat); //Assume worst case for phys meshes
      this.addToWorld();
    }
  };
  
  Entity.prototype.setMass = function(mass) {
    this._physobj.mass = mass;
  };
  
  var world = null;
  Entity.setWorld = function(scene) {
    world = scene;
  };
  
  Entity.prototype.addToWorld = function(scene) {
    if (scene)
      return scene.add(this._physobj);
    if (world)
      return world.add(this._physobj);
    
    var this = self;
    this._physobj.addEventListener('collision', function(otherthing, linvel, angvel) {
      self.emit('collision', otherthing, linvel, angvel);
    });
  };
  
  Entity.prototype.setPos = function(vec) {
    this._physobj.position = vec;
    this._physobj.__dirtyPosition = true;
  };
  
  Entity.prototype.getPos = function() {
    return this._physobj.position;
  };
  
  Entity.prototype.setRotation = function(quat) {
    this._physobj.quaternion = quat;
    this._physobj.__dirtyRotation = true;
  };
  
  Entity.prototype.getRotation = function() {
    return this._physobj.quaternion;
  };

  window.Entity = Entity;
}).call(this);