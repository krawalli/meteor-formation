
Template.dxInput.events({
    'click .edit': function( e ){
      e.preventDefault();
      this.editMode();
    }
});


genericEvents = function( eventType, eventSelector, valueSelector ){
  var other = valueSelector || eventSelector;
  var selector = eventType + ' ' + eventSelector;

  var events = {};
  events[ selector ] = function( event, template ){
    var self = this;
    event.preventDefault();
    var genValue = self.fromDOM( template.find( other ).value );
    self.value = genValue === '' ? undefined : genValue;
    self.validate();
  };

  return events;
};


genericRadioEvents = function( eventType, eventSelector, valueSelector ){
  var other = valueSelector || eventSelector;
  var selector = eventType + ' ' + eventSelector;

  var events = {};
  events[ selector ] = function( event, template ){
    var self = template.data;
    event.preventDefault();
    var radioSelect = self.fromDOM( template.find( other ).value );
    self.value = radioSelect === '' ? undefined : radioSelect;
    self.validate();
  };

  return events;
};


genericCheckboxEvents = function( eventType ){
  var other = "input";
  var selector = eventType + ' ' + other;

  var events = {};
  events[ selector ] = function( event, template ){
    var self = this;
    event.preventDefault();
    var genValue = self.fromDOM( template.find( other ).checked );
    self.value = genValue === '' ? undefined : genValue;
    self.validate();
  };

  return events;
};
