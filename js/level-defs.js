(function() {
  window.FirstLevel = new Level(
    [new THREE.Vector3(0,0,0)],
    1500,
    function(ctx) {
      //Setup
    },
    function(ctx) {
      //Teardown
    }).next(new Level(
    [new THREE.Vector3(0,0,0), new THREE.Vector3(0,1000,0)],
    2500,
    function(ctx) {
      //Setup
    },
    function(ctx) {
      //Teardown
    }
  ));
})();