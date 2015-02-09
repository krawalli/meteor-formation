Package.describe({
  name: "quietcreep:formation",
  summary: "Slender form creation w/ client & server side validation",
  version: "2.0.4",
  git: "http://github.com/quietcreep/meteor-formation"
});


Package.onUse( function( api ) {
  api.versionsFrom( 'METEOR@0.9.2.2' );

  var both = [ 'client', 'server' ];

  api.use([   'quietcreep:formation-core@2.0.4', 'quietcreep:formation-blaze-widgets@2.0.4', 'quietcreep:formation-file-input-blaze@2.0.1' ]);
  api.imply([ 'quietcreep:formation-core@2.0.4', 'quietcreep:formation-blaze-widgets@2.0.4', 'quietcreep:formation-file-input-blaze@2.0.1' ]);
});


Package.onTest( function( api ) {
  // api.use( 'tinytest' );
  // api.use( 'quietcreep:formation' );
  // api.addFiles( 'quietcreep:formation-tests.js' );
});
