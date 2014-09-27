

Formation.ModelInstance = function( params ){

  params.__name__ = "ModelInstance";

  var superinstance = ModelInstanceSuper( params );

  function ModelInstance( data ){
    var data = arguments[ 0 ] || {};
    Object.defineProperty( this, "_editMode", {
      value: new ReactiveVar( false ),
      writable: true,
      enumerable: false
    });
    superinstance.call( this, data );

    // add _id as unwritable, non-enumerable property
    if ( this._model.collection ){
      Object.defineProperty( this, "_id", {
        value: data._id,
        enumerable: false
      });
    }
  }

  ModelInstance.prototype = Object.create( superinstance.prototype );

  Object.defineProperties( ModelInstance.prototype, {
    delete: { value: function(){
        this._model.collection.remove( this._id );
      }
    }
  });

  return ModelInstance;
};
