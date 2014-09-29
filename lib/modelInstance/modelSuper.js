ModelInstanceSuper = function( params ){

  function ModelInstance( data ){
    this._errors = new ReactiveVar( [] );
    var schema = this._model;

    // iterate through fields and add data
    for ( var field in schema ){
      if ( schema[ field ] instanceof Array ){
        data[ field ] = data[ field ] || [];
        this[ field ] = [];

        for ( var i=0; i < data[ field ].length; i++ ){
          if ( this.__name__ === "NewModelInstance" ){
            this[ field ].push( new schema[ field ][ 0 ].newInstance( data[ field ][ i ] ) );
          } else {
            this[ field ].push( new schema[ field ][ 0 ].instance( data[ field ][ i ] ) );
          }
        }

        if ( _.isEmpty( this[ field ] ) ){
          for ( var i=0; i < schema[ field ][ 0 ].extra; i++ ){
            this[ field ].push( new schema[ field ][ 0 ].newInstance );
          }
        }
      } else {
        this[ field ] = new schema[ field ].instance( data[ field ] );
        this[ field ]._editMode.set( this.__name__ === "NewModelInstance" );
      }
    }

    // if new instance, make sure all fields are in edit mode
    if ( this.__name__ === "NewModelInstance" ) this.editMode();

  }


  if ( Meteor.isServer ) params.model.editable = function(){ return true };

  Object.defineProperties( ModelInstance.prototype, {
    __name__: { value: params.__name__ },
    _model: { value: params.model },
    summary: { value: params.model.summary },
    beforeSave: { value: params.model.hooks.beforeSave },
    afterSave: { value: params.model.hooks.afterSave },
    beforeValidation: { value: params.model.hooks.beforeValidation },
    afterValidation: { value: params.model.hooks.afterValidation },
    modelValidator: { value: params.model.hooks.modelValidator },
    editable: { value: typeof params.model.editable === 'boolean' ? function(){ return params.model.editable; } : params.model.editable },
    editMode:  { value: function( boo ){

        if ( this.editable() ){
          var fields = this.fields();
          typeof boo === "boolean" ? this._editMode.set( boo ) : this._editMode.set( ! this._editMode.get() );

          for ( var field in fields ){
            if ( this._model[ field ] instanceof Array && fields[ field ] instanceof Array ){
              for( var i=0; i < fields[ field ].length; i++ ){
                fields[ field ][ i ].editMode( this.inEditMode() );
              }
            } else {
              fields[ field ].editMode( this.inEditMode() );
            }
          }

        }

        return this.inEditMode();
      }
    },

    inEditMode:  { value: function(){
        return this._editMode.get();
      }
    },

    errors: { value: function(){
        return this._errors.get();
      }
    },

    getAllErrors: { value: function(){
        var self = this;
        var errors;

        var fields = self.fields();
        errors = {};

        for ( var field in fields ){

          if ( self._model[ field ] instanceof Array && self[ field ] instanceof Array ){
            errors[ field ] = [];

            for ( var i=0; i < self[ field ].length; i++ ){
              if ( self[ field ][ i ].hasErrors() ){
                errors[ field ].push( self[ field ][ i ].getAllErrors() );
              }
            }

          } else {
            if ( ( fields[ field ].__name__ === "ModelInstance" || fields[ field ].__name__ === "NewModelInstance" ) && fields[ field ].hasErrors() ){
              errors[ field ] = self[ field ].getAllErrors();
            } else if ( self[ field ].hasErrors() ){
              errors[ field ] = self[ field ].errors();
            }
          }
        }

        return errors;
      }
    },

    hasErrors: { value: function(){
        var ob = this.fields();
        var hasErr = false;
        var self = this;

        if ( ! _.isEmpty( this.errors() ) ){
          return true;
        }

        _.each( ob, function( value, key ){
          var errors = self._errors.get() instanceof Array ? self._errors.get() : [];
          if ( errors.length > 0 ) hasErr = true;

          if ( value instanceof Array ){
            _.each( value, function( v, k ){
              if ( v.hasErrors() ) hasErr = true;
            });

          } else {
            if ( value.hasErrors() ) hasErr = true;
          }
        });

        return hasErr;
      }
    },

    fields: { value: function(){
        var fields = {}
        for ( var field in this ){
          if ( _.has( this._model, field ) ){
            fields[ field ] = this[ field ];
          }
        }
        return fields;
      }
    },

    fieldsArray: { value: function(){
        return _.values( this.fields() );
      }
    },

    isNew: { value: function(){
        return this.__name__ === 'NewModelInstance';
      }
    },

    save: { value: function( params, callback ){
        if ( this.beforeSave ){
          this.beforeSave();
        }

        this.validate();
        var data = this.getValue();

        if ( this.__name__ === "NewModelInstance" ){
          delete data._id;
          var objectId = this._model.collection.insert( data );
        } else {
          var objectId = this._model.collection.update( { _id: this._id }, { $set: data } );
        }

        if ( this.afterSave ){
          this.afterSave();
        }

        if ( callback && typeof( callback ) === 'function' ){
          callback( data );
        }

        this.editMode( false );

        return objectId;
      }
    },

    getValue: { value: function(){
        var data;
        var self = this;
        data = {};
        var fields = self.fields();

        for ( var field in fields ){
          if ( self._model[ field ] instanceof Array && self[ field ] instanceof Array ){
            if ( ! _.isEmpty( self[ field ] ) ){
              data[ field ] = [];

              for ( var i=0; i < self[ field ].length; i++ ){
                if ( self[ field ][ i ].__name__ !== "NewModelInstance" ){
                  data[ field ].push( self[ field ][ i ].getValue() );

                } else if ( self[ field ][ i ]._model.required || self[ field ][ i ].getValue() !== undefined ){
                  data[ field ].push( self[ field ][ i ].getValue() );
                }
              }
            }

          } else {
            data[ field ] = fields[ field ].getValue();
          }
        }

        for ( var field in data ){
          if ( data[ field ] === undefined ){
            delete data[ field ];
          }
        }


        if (! this._model.required &&
            _.isEmpty( _.compact( _.values( data ) ) ) &&
            this.__name__ === "NewModelInstance" ){
          return;
        }

        return data;
      }
    },

    validate: { value: function( callback ){
        this._errors.set( [] );

        if ( this.beforeValidation ){
          this.beforeValidation();
        }

        var fields = this.fields();
        for ( var field in fields ){
          if ( this._model[ field ] instanceof Array && this[ field ] instanceof Array ){
            for ( var i=0; i < this[ field ].length; i++ ){
              this[ field ][ i ].validate();
            }
          } else {
            fields[ field ].validate();
            if ( this._model && fields[ field ].field ){
              if ( fields[ field ].field.unique && this._model.collection ){
                var find = {};
                find[ field ] = fields[ field ].value;
                find._id = { '$ne': this._id };

                if ( this._model.collection.find( find ).count() !== 0 ){
                  var errs = fields[ field ]._errors.get();
                  errs.push( new Error( "This " + field + " already exists." ) );
                  this._errors.set( errs );
                }
              }
            }
          }
        }

        if ( this.modelValidator ){
          try {
            check( this.getValue(), this.modelValidator() );
          } catch( e ){
            var errs = this._errors.get();
            errs.push( e );
            this._errors.set( errs );
          }
        }

        // Remove errors of unrequired fields
        if ( this.hasErrors() && this.__name__ === "NewModelInstance" ){
          if ( ! this._model.required ){

            var fields = this.fields();
            for ( var field in fields ){
              if ( ! this[ field ].field.required ){
                switch( typeof( this[ field ].value ) ){
                  case 'undefined':
                    this[ field ]._errors = [];
                    break;
                  case 'string':
                  case 'array':
                    if ( this[ field ].value.length === 0 ){
                      this[ field ].value = this[ field ].field.defaultValue();
                      this[ field ]._errors = [];
                    }
                    break;
                }
              }
            }
            this._errors.set( [] );
          }
        };

        if ( this.hasErrors() ){
          console.log( this.getAllErrors() );
          throw new Error( 'Please check the fields for errors.' );
        }

        if ( this.afterValidation ){
          this.afterValidation();
        }

        if ( typeof( callback ) === "function" ){
          callback();
        }

      }
    }

  });

  // add virtual fields to prototype
  for ( var field in params.model.virtualFields ){
    if ( typeof( params.model.virtualFields[ field ] ) === 'function' ){
      Object.defineProperty( ModelInstance.prototype, field, { value: params.model.virtualFields[ field ] } );
    } else {
      throw new Error( "All virtual fields must be functions." );
    }
  }

  return ModelInstance;

};
