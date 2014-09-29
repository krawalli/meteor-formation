var err = function( message ){ throw new Error( message ); };

Formation.FieldInstance = function( params ){

  function FieldInstance( value ){
    var self = this;

    Object.defineProperties( this, {
      value: { value: typeof( value ) === "undefined" ? self.field.defaultValue() : value, enumerable: true, writable: true },
     	_editMode: { value: new ReactiveVar( false ) },
      _errors: { value: new ReactiveVar( [] ) }
    });
  }

  var editable;
  switch ( typeof( params.field.editable ) ){
    case "boolean":
      var boo = params.field.editable
      editable = function(){ return boo };
      break;
    case "undefined":
      editable = function(){ return true };
      break;
    case "function":
      editable = params.field.editable;
      break;
  }

  Object.defineProperties( FieldInstance.prototype, {
    field: { value: params.field },
    toDOM: { value: params.field.toDOM },
    fromDOM: { value: params.field.fromDOM },
    uploadTo: { value: params.field.uploadTo },
    widget: { value: params.field.widget },
    editable: { value: editable },
    editMode: { value: function( boo ){
        if ( this.editable() ){
          if ( typeof( boo ) === 'undefined' ){
            this._editMode.set(! this._editMode.get() );
          } else if ( typeof( boo ) !== 'boolean' ){
            this._editMode.set( false );
          } else {
            this._editMode.set( boo );
          }
        }

        return this._editMode.get();
      }
    },

    inEditMode: { value: function(){
        return this._editMode.get();
      }
    },

    errors: { value: function(){
        return this._errors.get();
      }
    },

    validate: { value: function(){
        this._errors.set( [] );

        try {
          check( this.value, this.field.pattern() );
        } catch( e ){
          var errs = this._errors.get();
          errs.push( e );
          this._errors.set( errs );
        }
      }
    },

    hasErrors: { value: function(){
        return ! _.isEmpty( this.errors() );
      }
    },

    getValue: { value: function(){
        if ( this.value instanceof Array && _.isEmpty( this.value ) ){
          return undefined;
        } else if ( this.value === '' && ! this.field.required ){
          return undefined;
        }
        return this.value;
      }
    }

  });

  return FieldInstance;
};
