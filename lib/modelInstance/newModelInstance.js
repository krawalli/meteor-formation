//////////////////////////////////
//  New Model Instance
////////////////////////////////

Formation.NewModelInstance = function( params, newData ){
  params.model = params.model instanceof Array ? params.model[ 0 ] : params.model;
  params.__name__ = "NewModelInstance";

  var superinstance = ModelInstanceSuper( params );


  function NewModelInstance( data ){
    var data = data || {};

    Object.defineProperty( this, "_editMode", {
      value: new function(){
        this.get = function(){ return true; };
        this.set = function(){ return true; };
      },
      writable: true,
      enumerable: false
    });

    superinstance.call( this, data );
  }

  NewModelInstance.prototype = Object.create( superinstance.prototype );

  return NewModelInstance;

};
