Package.describe({
  name: "quietcreep:formation",
  summary: "Slender form creation w/ client & server side validation",
  version: "1.0.0",
  // git: "http://github.com/quietcreep/meteor-formation"
});


Npm.depends({
  knox: "0.8.5"
});


Package.onUse( function( api ) {

  api.versionsFrom( 'METEOR@0.9.2.2' );

  var both = [ 'client', 'server' ];
  api.use( [ 'underscore', 'check', 'accounts-base', 'reactive-var', 'tracker' ], both );
  api.use( [ 'templating', 'ui' ], 'client' );

  //// settings and setup ///////////
  api.addFiles( 'settings.js', both );
  api.addFiles( 'server/s3.js', 'server' );


  //// fields ///////////////////////
  var fields = [
    'boolean',
    'char',
    'choice',
    'date',
    'datetime',
    'email',
    'fileUpload',
    'modelChoice',
    'number',
    'password',
    'slug',
    'time',
    'url'
  ];

  api.addFiles( 'lib/fields/field/field.js', both );
  api.addFiles( 'lib/fields/field/widgets.html', 'client' );
  api.addFiles( 'lib/fields/field/widgets.js', 'client' );
  api.addFiles( 'lib/fields/field/helpers.js', 'client' );
  api.addFiles( 'lib/fields/field/extras.html', 'client' );
  api.addFiles( 'lib/fields/field/extras.js', 'client' );

  for ( var i=0; i < fields.length; i++ ){
    api.addFiles( 'lib/fields/'+ fields[ i ] +'/field.js', both );
    api.addFiles( 'lib/fields/'+ fields[ i ] +'/widget.html', 'client' );
    api.addFiles( 'lib/fields/'+ fields[ i ] +'/widget.js', 'client' );
  }

  api.addFiles( 'lib/field-instances.js', both );
  api.addFiles( 'lib/validators.js', both );

  //// models ///////////////////////
  api.addFiles( 'lib/models.js', both );
  api.addFiles( 'lib/modelInstance/modelSuper.js', both );
  api.addFiles( 'lib/modelInstance/modelInstance.js', both );
  api.addFiles( 'lib/modelInstance/newModelInstance.js', both );


  api.export( 'Formation' );

});


Package.onTest( function( api ) {
  api.use( 'tinytest' );
  api.use( 'quietcreep:formation' );
  api.addFiles( 'quietcreep:formation-tests.js' );
});
