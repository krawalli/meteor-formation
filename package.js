Package.describe({
  name: "quietcreep:formation",
  summary: "Slender form creation w/ client & server side validation",
  version: "1.0.3_1",
  git: "http://github.com/quietcreep/meteor-formation"
});


Package.onUse( function( api ) {
  api.versionsFrom( 'METEOR@0.9.2.2' );

  var both = [ 'client', 'server' ];

  api.use([ 'quietcreep:formation-core@1.0.3_1', 'quietcreep:formation-blaze-widgets@1.0.3' ]);
  api.imply([ 'quietcreep:formation-core@1.0.3_1', 'quietcreep:formation-blaze-widgets@1.0.3' ]);
});


Package.onTest( function( api ) {
  // api.use( 'tinytest' );
  // api.use( 'quietcreep:formation' );
  // api.addFiles( 'quietcreep:formation-tests.js' );
});
