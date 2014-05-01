(function() {
  
  var makeHandler = function(pos, qang) {
    return function(ent) {
        ent.addToWorld();
        ent.setPos(pos.add(new THREE.Vector3(0,32,0)));
        ent.setRotation(qang);
      }
  };
  var up = new THREE.Vector3(0,1,0);
  var rightang = (new THREE.Quaternion()).setFromAxisAngle(up, -Math.PI/2);
  
  window.Levels = []
  var pushLevelDef = function(level) {
    level.id = window.Levels.length;
    window.Levels.push(level);
  };
  
  pushLevelDef(new Level(
    [new THREE.Vector3(0,10,0),new THREE.Vector3(0,10,0),new THREE.Vector3(0,10,0)], //Stationary, a brief intoduction
    3000,
    function(ctx, game) {
      //Setup
      ctx.dist = 150;
      ctx.count = 8;
      ctx.targets = [];
      for (var i=0; i<ctx.count; i++) {
        var ang = Math.PI*i/4;
        var qang = new THREE.Quaternion();
        qang.setFromAxisAngle(up, ang);
        var pos = new THREE.Vector3(1,0,0);
        pos.applyQuaternion(qang);
        pos.multiplyScalar(ctx.dist);
        var dang = qang.multiply(rightang);
        var t = new Target(makeHandler(pos, dang));
        ctx.targets.push(t);
      }
  
    },
    function(ctx, game) {
      //Teardown
      for (var i=0;i<ctx.count; i++) {
        if (ctx.targets[i]) {
          ctx.targets[i].remove();
        }
      }
    }));
  
  pushLevelDef(new Level(
    [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1000,0)], //A short jaunt forward
    2500,
    function(ctx, game) {
      //Setup
    },
    function(ctx, game) {
      //Teardown
    }
  ));
})();