(function() {
  var Subsection = function() {
    Entity.call(this);
  };
  
  Subsection.prototype = Object.create( Entity.prototype );
  
  window.Golf = window.Golf || {};
  window.Golf.Subsection = Subsection;
}).call(this);