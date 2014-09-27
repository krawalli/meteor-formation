Formation.Fields.Number = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || "NumberInput";
  params.min = typeof( params.min ) === 'number' ? params.min : null;
  params.fromDOM = function( value ){
    if ( value === '' ){
      return undefined;
    }
    return +value;
  };

  Formation.Field.call( this, params );

  Object.defineProperties( this, {
    pattern: { value: function(){
      return this._optional( Formation.Validators.BasicNumber( this.min, this.max ) );
    }},
    instance: { value: Formation.FieldInstance({ field: this }) }
  });
};

Formation.Fields.Number.prototype = Object.create( Formation.Field.prototype );
