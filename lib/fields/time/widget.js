Template.TimeTextInput.events( genericEvents( 'change', 'input') );


Template.TimeChoiceInput.events({
  'change select' : function( event, template ){
    event.stopPropagation();
    selectHour = template.find( 'select.hour' );
    selectedHour = selectHour.options[ selectHour.selectedIndex ].value;
    selectMinute = template.find( 'select.minute' );
    selectedMinute = selectMinute.options[ selectMinute.selectedIndex ].value;
    selectSecond = template.find( 'select.second' );
    selectedSecond = selectSecond.options[ selectSecond.selectedIndex ].value;
    this.value = this.fromDOM( [ selectedHour, selectedMinute, selectedSecond ].join( ':' ) );
  }
});


var getHour = function( time ){
  if ( time instanceof Formation.Time ){
    return time.getHour();
  }
};
var getMinute = function( time ){
  if ( time instanceof Formation.Time ){
    return time.getMinute();
  }
};
var getSecond = function( time ){
  if ( time instanceof Formation.Time ){
    return time.getSecond();
  }
};

Template.TimeChoiceInput.hourSelected = function( value ){
  if ( getHour( value ) === this.toString() ){
    return 'selected';
  }
};

Template.TimeChoiceInput.minuteSelected = function( value ){
  if ( getMinute( value ) === this.toString() ){
    return 'selected';
  }
};

Template.TimeChoiceInput.secondSelected = function( value ){
  if ( getSecond( value ) === this.toString() ){
    return 'selected';
  }
};
