(function() {
  
  var makeHandler = function(pos, qang, ctx) {
    return function(ent) {
        ent.addToWorld();
        ent.setPos(pos.add(new THREE.Vector3(0,32,0)));
        ent.setRotation(qang);
        var oldd = ent.onDestroy;
        ent.onDestroy = function() {
          oldd();
          ctx.score = ctx.score + 1;
          if (ctx.score===8) {
            ctx.endLevel();
          }
        }
      }
  };
  var up = new THREE.Vector3(0,1,0);
  var fwd = new THREE.Vector3(0,0,-1);
  var rightang = (new THREE.Quaternion()).setFromAxisAngle(up, -Math.PI/2);
  var rightang2 = (new THREE.Quaternion()).setFromAxisAngle(fwd, -Math.PI/2);
  
  window.Levels = []
  var pushLevelDef = function(level) {
    level.id = window.Levels.length;
    window.Levels.push(level);
  };
  
  
  pushLevelDef(new Level(
    [new THREE.Vector3(0,10,0),new THREE.Vector3(0,10,0),new THREE.Vector3(0,10,0)], //Stationary, a brief intoduction
    200000, //Level duration in milliseconds
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
        var t = new Target(makeHandler(pos, dang, game));
        ctx.targets.push(t);
      }
  
    },
    function(ctx, game) {
      //Teardown
      for (var i=0;i<ctx.count; i++) {
        if (ctx.targets[i]) {
          ctx.targets[i].remove();
          delete ctx.targets[i];
        }
      }
    }));
  
  pushLevelDef(new Level(
    [new THREE.Vector3(0,10,-750), new THREE.Vector3(0,10,0), new THREE.Vector3(0,10,750)], //A short jaunt forward
    60000,
    function(ctx, game) {
      ctx.dist = 175;
      ctx.count = 8;
      ctx.targets = [];
      for (var i=0; i<ctx.count; i++) {
        var pos = new THREE.Vector3(150,0,0);
        pos.add(game.PointOn3DCurve(i/ctx.count, ctx.path[0], ctx.path[1], ctx.path[2]));
        
        var rot = new THREE.Quaternion();
        rot.setFromAxisAngle(up, Math.PI/2);
        
        var t = new Target(makeHandler(pos, rot, game));
        ctx.targets.push(t);
      }
    },
    function(ctx, game) {
      //Teardown
      for (var i=0;i<ctx.count; i++) {
        if (ctx.targets[i]) {
          ctx.targets[i].remove();
          delete ctx.targets[i];
        }
      }
    }
  ));
})();