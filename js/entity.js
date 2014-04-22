/*
Entity.js - A Wrapper around Physi.js and Three.js that provides a
  game-esque 3d entity system
*/
(function() {
  var Entity = function(model, mass) {
    var self = this;
    if (model) this.setModel(model);
    this.setMass(mass || 0);
  };
  
  if (!String.prototype.endsWith) { //Polyfill
    console.log('Polyfill for endsWith enabled');
    String.prototype.endsWith = function(subs) {
      return (this.indexOf(subs)>-1) && (this.indexOf(subs)===(this.length-subs.length));
    };
  }
  
  Entity.prototype.setModel = function(path, cb) {
    var self = this;
    var loader;
    if (path.endsWith('.js') || path.endsWith('.json')) {
      loader = new THREE.JSONLoader(); //Will error if loader isn't defined
    } else if (path.endsWith('.obj')) {
      loader = new THREE.OBJLoader();
    } else if (path.endsWith('.dae')) {
      loader = new THREE.ColladaLoader();
    }
    if (loader.options)
      loader.options.convertUpAxis = true; 
    //Most models probably don't use the three.js coordinate system, some might, though. Balance of probabilities.
    
    loader.load(path, function(geometry, mats) {
      self.setGeometry(geometry, mats);
      if (cb) cb();
    });
  };
  
  Entity.prototype.setGeometry = function(geom, mats) {
    var facemat = null;
    if (mats && mats.length>0) {
      facemat = new THREE.MeshFaceMaterial( mats[0] );
    } else {
      facemat = new THREE.MeshLambertMaterial({ color: 0xdedede });
    }
    
    var tGeom = geom.children[0].geometry; //Need to check if there's a situation where this is incorrect to assume
    if (this._physobj) {
      var pos = this.getPos();
      var rot = this.getRotation();
      this._physobj.dispose();
      this._physobj = new Physijs.ConcaveMesh(tGeom, facemat);
      this.addToWorld();
      this.setPos(pos);
      this.setRotation(rot);
    } else {
      this._physobj = new Physijs.ConcaveMesh(tGeom, facemat); //Assume worst case for phys meshes
      this.addToWorld();
      this.setPos(this.pos || new THREE.Vector3());
      this.setRotation(this.rot || new THREE.Quaternion());
    }
    this._physobj.mass = this.mass;
    this._physobj.castShadow = true;
    this._physobj.recieveShadow = true;
  };
  
  Entity.prototype.setMass = function(mass) {
    this.mass = mass;
  };
  
  var world = null;
  Entity.setWorld = function(scene) {
    world = scene;
  };
  
  Entity.prototype.addToWorld = function(scene) {
    if (scene) {
      scene.add(this._physobj);
    } else if (world) {
      world.add(this._physobj);
    }
    
    var self = this;
    this._physobj.addEventListener('collision', function(otherthing, linvel, angvel) {
      if (self.onCollision) {
        self.onCollision(otherthing, linvel, angvel);
      }
    });
  };
  
  Entity.prototype.setPos = function(vec) {
    this.pos = vec;
    if (this._physobj) {
      this._physobj.position = vec;
      this._physobj.__dirtyPosition = true;
    }
  };
  
  Entity.prototype.getPos = function() {
    return this._physobj.position;
  };
  
  Entity.prototype.setRotation = function(quat) {
    this.rot = quat;
    if (this._physobj) {
      this._physobj.quaternion = quat;
      this._physobj.__dirtyRotation = true;
    }
  };
  
  Entity.prototype.getRotation = function() {
    return this._physobj.quaternion;
  };

  window.Entity = Entity;
})();