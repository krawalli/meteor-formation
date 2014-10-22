

Template.dxButtons.events({
  'click .btn-save': function( event ){
    event.preventDefault();
    this.save();
  },
  'click .btn-edit': function( event ){
    event.preventDefault();
    this.editMode();
  }
});

var dxArrayDep = new Tracker.Dependency;

Template.dxArray.helpers({
  instances: function(){
    dxArrayDep.depend();
    return this.model[ this.field ];
  },
  _dxParent: function( parent ){
    Object.defineProperty( this, "_dxParent", {
      value: parent.model[ parent.field ],
      writable: true,
      enumerable: false
    })
  }
});

Template.dxArray.events({
  'click .btn-add': function( event, template ){
    event.preventDefault();
    event.stopPropagation();
    template.data.model[ template.data.field ].push( new template.data.model._model[ template.data.field ][0].newInstance );
    dxArrayDep.changed();
  },
  'click .btn-remove': function( event, template ){
    event.preventDefault();
    event.stopPropagation();
    template.data.model[ template.data.field ] = _.without( template.data.model[ template.data.field ], this );
    dxArrayDep.changed();
  }

})
