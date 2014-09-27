/* Boolean field  */
Formation.Fields.Boolean = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || 'CheckboxInput';
  params.max = 1;
  params.defaultValue = params.defaultValue || false;
  params.fromDOM = function( value ){
    return typeof value === "boolean" ? value : false;
  };

  Formation.Field.call( this, params );

  Object.defineProperties( this, {
    pattern: { value: function(){
      return this._optional(
        Match.Where( function( value ){
          return typeof( value ) === 'boolean';
        })
        );
      }
    },
    instance: { value: Formation.FieldInstance({ field: this }) }
  });
};

Formation.Fields.Boolean.prototype = Object.create( Formation.Field.prototype );
