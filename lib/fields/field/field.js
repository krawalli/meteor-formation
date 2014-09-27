err = function( message ){ throw new Error( message ); };

////////////////////////////////////////////////////////////
////  Field Parent
////////////////////////////////////////////////////////////


if ( typeof( Formation.Fields ) === 'undefined' )  Formation.Fields = {};


/*	Field Parent Model
*/
// Formation.Field = function( params ){

Formation.Field = function Field( params ){
  var fromDOMDefault = function( value ){
    return value;
  };
  var toDOMDefault = function(){
    var protoself = this;
    return protoself.getValue();
  };
  var fromDOM = params.fromDOM || fromDOMDefault;
  var toDOM = params.toDOM || toDOMDefault;

  Object.defineProperties( this, {
    label: { value: params.label || '', writable: true },
    helpText: { value: params.helpText || '' },
    widget: { value: params.widget || err( 'Please add a widget to this field.' ) },
    unique: { value: typeof( params.unique ) === 'boolean' ? params.unique : false },
    min: { value: params.min || null },
    max: { value: params.max || null },
    editable: { value: typeof params.editable === 'boolean' || typeof params.editable === 'function' ? params.editable : true },
    required: { value: typeof( params.required ) === 'boolean' ? params.required : true },
    defaultValue: { value: typeof( params.defaultValue ) === "function" ? params.defaultValue : function(){ return params.defaultValue } },
    _optional: { value: function( validator ){
      return this.required ? validator : Match.Optional( validator );
    }},
    toDOM: { value: toDOM },
    fromDOM: { value: fromDOM },
  });
}
