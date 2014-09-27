Template.RadioInput.events( genericRadioEvents( 'change', 'input', 'input:checked' ) );
Template.CheckboxInput.events( genericCheckboxEvents( 'change' ) );


Template.CheckboxMultiple.rendered = function(){
  var input = template.findAll( 'input:checked' );
  var checked = input ? this.data.fromDOM( input.value ) : [];
  this.data.value = _.isEmpty( checked ) ? [] : checked;
};


Template.CheckboxMultiple.events({
  'click input' : function( event, template ){
    event.preventDefault();
    var checked = this.fromDOM( template.findAll( 'input:checked' ).value );
    this.value = _.isEmpty( checked ) ? [] : checked;
    this.validate();
  }
});


Template.SelectInput.rendered = function(){
  selectMenu = this.find( 'select' );
  selected = selectMenu.options[ selectMenu.selectedIndex ].value;
  this.data.value = selected === '' ? undefined : selected;
};


Template.SelectInput.events({
  'change select' : function( event, template ){
    event.stopPropagation();
    selectMenu = template.find( 'select' );
    selected = selectMenu.options[ selectMenu.selectedIndex ].value;
    this.value = selected;
    if ( this.value === '' ){
      this.value = undefined;
    }
    this.validate();
  }
});


Template.RadioInput.rendered = function(){
  var input = this.find( 'input:checked' );

  if ( input ){
    this.data.value = this.data.fromDOM( this.find( 'input:checked' ).value );
  }
  if ( this.data.value === '' ){
    this.data.value = undefined;
  }
};


Template.SelectMultiple.events({
  'click select' : function( event, template ){
    event.stopPropagation();
    selectMenu = template.find( 'select' );
    selected = _.reduce( selectMenu.options, function( memo, value ){
      if ( value.selected ){
        memo.push( value.value );
      }
      return memo;
    }, [] );
    this.data.instance.value = selected;
    this.validate();
  }
});
