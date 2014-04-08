/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Based on THREE.PointerLockControls by mrdoob.
 * @author benvanik
 */

THREE.OculusRiftControls = function ( camera ) {

  var scope = this;

  var moveObject = new Physijs.BoxMesh(
    new THREE.CubeGeometry(5,10,5)
  );
  moveObject.position.y = 10;
  moveObject.position.z = 10;
  moveObject.add( camera );

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var turnLeft = false;
  var turnRight = false;

  var velocity = new THREE.Vector3(0,0,0);
  var turningVel = 0;
  
  var angOffset = 0;

  var PI_2 = Math.PI / 2;

  this.moveSpeed = 0.12 / 4;
  
  this.turnSpeed = PI_2 / 80;

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;
        
      case 81: //q
        turnLeft = true;
        break;
        
      case 69: //e
        turnRight = true;
        break;

    }

  }.bind(this);

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // a
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 81: //q
        turnLeft = false;
        break;
        
      case 69: //e
        turnRight = false;
        break;        
        
    }

  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  this.enabled = false;

  this.getObject = function () {

    return moveObject;

  };
  
  var iHat = new THREE.Vector3(0,1,0);

  this.update = function ( delta, vrstate ) {

    camera.position = moveObject.position;
    camera.quaternion = moveObject.quaternion;

    //if ( scope.enabled === false ) return;

    delta *= 0.1;

    velocity.x += ( - velocity.x ) * 0.08 * delta;
    velocity.z += ( - velocity.z ) * 0.08 * delta;
    
    turningVel += ( - turningVel ) * 0.08 * delta;

    if ( moveForward ) velocity.z -= this.moveSpeed * delta;
    if ( moveBackward ) velocity.z += this.moveSpeed * delta;

    if ( moveLeft ) velocity.x -= this.moveSpeed * delta;
    if ( moveRight ) velocity.x += this.moveSpeed * delta;
    
    if ( turnLeft ) turningVel += this.turnSpeed * delta;
    if ( turnRight ) turningVel -= this.turnSpeed * delta;

    angOffset += turningVel;
    
    var ang = new THREE.Quaternion().setFromAxisAngle(iHat, angOffset);
    
    if (vrstate && (vrstate.hmd.present)) {
      var vel= velocity.clone();
      var rotation = new THREE.Quaternion(
        vrstate.hmd.rotation[0],
        vrstate.hmd.rotation[1],
        vrstate.hmd.rotation[2],
        vrstate.hmd.rotation[3]);
      moveObject.quaternion = rotation;
      moveObject.quaternion.set(moveObject.quaternion.x+ang.x, moveObject.quaternion.y+ang.y, moveObject.quaternion.z+ang.z, moveObject.quaternion.w+ang.w);
      moveObject.quaternion.normalize();

      vel.applyQuaternion(moveObject.quaternion);

      moveObject.position.x += ( vel.x );
      moveObject.position.y += ( vel.y );
      moveObject.position.z += ( vel.z );
    } else {

      moveObject.quaternion = ang;
      
      velocity.applyQuaternion(moveObject.quaternion);
      moveObject.position.x += ( velocity.x );
      moveObject.position.y += ( velocity.y );
      moveObject.position.z += ( velocity.z );
    }
    


    moveObject.__dirtyPosition = true;
    moveObject.__dirtyRotation = true;

  };

};
