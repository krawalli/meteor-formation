Template.DatetimeInput.events( genericEvents( 'change', 'input' ) );

Template.DatetimeInput.rendered = function(){
  var self = this;
  var el = self.$(".datetimepicker");
  if ( $(el).datetimepicker ){
    self.$(".datetimepicker").datetimepicker({
      defaultDate: new Date(),
      minDate: self.data.field.min,
      maxDate: self.data.field.max,
    });
  }

  self.$(".datetimepicker").on( "dp.change", function(){
    self.$( "input" ).change();
  });

};

Template.DateInput.rendered = function(){
  var self = this;

  self.$(".datetimepicker").datetimepicker({
    defaultDate: new Date(),
    minDate: self.data.field.min,
    maxDate: self.data.field.max,
  });

  self.$(".datetimepicker").on( "dp.change", function(){
    self.$( "input" ).change();
  });

};
