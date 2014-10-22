
Template.dxField.helpers({
  getWidget: function(){
    return Template[ this.widget ];
  },
  instanceSummary: function( value ){
    if ( value === undefined || value === null  ){
      return '';
    }

    if ( value instanceof Array ){
      var valueArray = [];

      for ( var i=0; i < value.length; i++ ){
        if ( value[ i ].__name__ === "ModelInstance" ){
          valueArray.push( value[ i ].summary() );
        } else {
          valueArray.push( value[ i ] );
        }
      }

      return valueArray.join( ', ' );
    } else if ( value.__name__ === "ModelInstance" ){
      return value.summary();
    } else if ( value instanceof Formation.Time ){
      return value.toString();
    } else {
      return value;
    }
  },
})


var isSelected = function( value, choice, selectedString ){
  var choiceClean = choice.__name__ === "ModelInstance" ? choice._id : choice;

  if ( value instanceof Array ){
    for ( var i=0; i < value.length; i++ ){
      if ( value[ i ] === choiceClean ) return selectedString;
    }
  } else {
    if ( value == choiceClean ) return selectedString;
  }
};



UI.registerHelper( "selected", function( value ){
  return isSelected( value, this, "selected" );
});


UI.registerHelper( "checked", function( value ){
  return isSelected( value, this, "checked" );
});

UI.registerHelper( "checkboxed", function( value ){
  if ( value ) return "checked";
});



Template.dxInput.helpers({
  getWidget: function(){
    return Template[ this.widget ];
  }
})
