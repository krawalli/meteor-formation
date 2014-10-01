Template.ModelRadioInput.events( genericRadioEvents( 'change', 'input', 'input:checked' ) );


Template.ModelSelectMultiple.rendered = function(){
  selectMenu = this.find( 'select' );
  selected = _.reduce( selectMenu.options, function( memo, value ){
    if ( value.selected ){
      memo.push( value.value );
    }
    return memo;
  }, [] );
  this.data.value = this.data.field.fromDOM( selected ) || [];
};


Template.ModelSelectMultiple.events({
  'click select' : function( event, template ){
    event.preventDefault();
    selectMenu = template.find( 'select' );
    selected = _.reduce( selectMenu.options, function( memo, value ){
      if ( value.selected ){
        memo.push( value.value );
      }
      return memo;
    }, [] );
    this.value = this.field.fromDOM( selected ) || [];
    this.validate();
  }
});


Template.ModelSelect.rendered = function(){
  selectMenu = this.find( 'select' );
  selected = selectMenu.selectedIndex !== -1 ? selectMenu.options[ selectMenu.selectedIndex ].value : undefined;
  this.data.value = selected;
};


Template.ModelSelect.events({
  'change select' : function( event, template ){
    event.preventDefault();
    selectMenu = template.find( 'select' );
    selected = selectMenu.options[ selectMenu.selectedIndex ].value;
    this.value = selected === '' ? undefined : selected;
    this.validate();
  }
});
