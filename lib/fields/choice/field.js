////////////////////////////////////
////  Choice fields
////////////////////////////////////


var ChoiceField = function Field( params ){
  params = typeof params === "object" ? params : {};
  var choices = params.choices || err( 'Please add an array of choices for this field' );

  Formation.Field.call( this, params );

  Object.defineProperty( this, "choices", { value: function(){ return choices; } } );
};

ChoiceField.prototype = Object.create( Formation.Field.prototype );



/* Single Choice  */
Formation.Fields.SingleChoice = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || 'SelectInput';

  ChoiceField.call( this, params );

  Object.defineProperties( this, {
    pattern: { value: function(){
      return this._optional( Formation.Validators.ValueIsInChoices( this.choices() ) );
    }},
    instance: { value: Formation.FieldInstance({ field: this }) }
  });
};

Formation.Fields.SingleChoice.prototype = Object.create( ChoiceField.prototype );




/* Multiple Choice  */
Formation.Fields.MultipleChoice = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || 'SelectMultiple';

  ChoiceField.call( this, params );

  Object.defineProperties( this, {
    pattern: { value: function(){
      return this._optional( Formation.Validators.ChoicesArray( this.choices(), this.min, this.max ) );
    }},
    instance: { value: Formation.FieldInstance({ field: this }) }
  });
};

Formation.Fields.MultipleChoice.prototype = Object.create( ChoiceField.prototype );
