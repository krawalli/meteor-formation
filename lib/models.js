

//////////////////////////
//  Convenience Functions
////////////////////////

var err = function( message ){
  throw new Error( message );
};


toTitleCase = function( string ){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return string.replace( /[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function( match, index, title ){
    if ( index > 0 && index + match.length !== title.length &&
         match.search( smallWords ) > -1 && title.charAt( index - 2 ) !== ":" &&
         ( title.charAt( index + match.length ) !== '-' || title.charAt( index - 1 ) === '-' ) &&
         title.charAt( index - 1 ).search( /[^\s-]/ ) < 0 ) {
      return match.toLowerCase();
    }

    if ( match.substr( 1 ).search( /[A-Z]|\../ ) > -1 ) {
      return match;
    }

    return match.charAt( 0 ).toUpperCase() + match.substr( 1 );
  });
};

camelToTitleCase = function( string ) {
    var i, str, lowers, uppers;
    var str = string.split( /(?=[A-Z])/ );
    for ( var j=0; j < str.length; j++ ){
      str[ j ] = toTitleCase( str[ j ] );
    }
    str = str.join( " " );

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0; i < lowers.length; i++)
        str = str.replace( new RegExp('\\s' + lowers[i] + '\\s', 'g' ),
            function( txt ) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = [ 'Id', 'Tv' ];
    for ( i = 0; i < uppers.length; i++ )
        str = str.replace( new RegExp('\\b' + uppers[i] + '\\b', 'g' ),
            uppers[ i ].toUpperCase());

    return str;
};


///////////////////////////
//  Basic Model w/ Collection
///////////////////////////


Formation.Model = function( params ){
  var self = this;
  if ( typeof params === "function" ) params = new params;

  _.each( params.schema, function( field, key ){
    if (! field.label && field instanceof Formation.Field ){
      Object.defineProperty( field, "label", { value: camelToTitleCase( key ) } );
    }
  });


  // assemble query filter
  var filter;
  switch ( typeof( params.filter ) ){
  case 'undefined':
    filter = function(){ return {}; };
    break;
  case 'object':
    filter = function(){ return params.filter; };
    break;
  case 'function':
    filter = params.filter;
    break;
  }

  var hooks = {};
  hooks.beforeSave = typeof( params.beforeSave ) === 'function' || typeof( params.beforeSave ) === 'undefined' ? params.beforeSave : err( "beforeSave hook must be a function" );
  hooks.afterSave = typeof( params.afterSave ) === 'function' || typeof( params.afterSave ) === 'undefined' ? params.afterSave : err( "afterSave hook must be a function" );
  hooks.beforeValidation = typeof( params.beforeValidation ) === 'function' || typeof( params.beforeValidation ) === 'undefined' ? params.beforeValidation : err( "beforeValidation hook must be a function" );
  hooks.afterValidation = typeof( params.afterValidation ) === 'function' || typeof( params.afterValidation ) === 'undefined' ? params.afterValidation : err( "afterValidation hook must be a function" );
  hooks.modelValidator = typeof( params.modelValidator ) === 'function' || typeof( params.modelValidator ) === 'undefined' ? params.modelValidator : err( "modelValidator hook must be a function" );


  function Model(){
    // return self;
  }

  Object.defineProperties( Model.prototype, {
    collection: { value: params.collection instanceof Meteor.Collection || typeof( params.collection ) === 'undefined' ? params.collection : err( "Please enter a Meteor Collection for instances of Formation.Model" ) },
    // isArray: { value: params.isArray ? true : false },
    extra: { value: typeof( params.extra ) === "number" ? params.extra : 1 },
    required: { value: typeof( params.required ) === "boolean" ? params.required : true },
    editable: { value: typeof params.editable === 'boolean' || typeof params.editable === 'function' ? params.editable : true },
    hooks: { value: hooks },
    summary: { value: typeof( params.summary ) === 'function' ? params.summary : function(){ return 'un-summarized model'; } },
    filter: { value: filter },
    fieldsFilter: { value: function(){
        return _.reduce( _.keys( this ), function( memo, value ){
          memo[ value ] = 1;
          return memo;
        }, {} );
      }
    },

    virtualFields: { value: ( params.virtualFields instanceof Object ) && ! ( params.virtualFields instanceof Array ) ? params.virtualFields : {} },

    find: { value: function( filter, options ){
        var protoself = this;

        var filter = filter || {};
        _.extend( filter, protoself.filter() );
        var options = options || {};
        _.extend( options, { fields: this.fieldsFilter() } );

        collectionObjects = this.collection.find( filter, options ).fetch();

        for ( var i=0; i < collectionObjects.length; i++ ){
          for ( field in protoself ){
            if ( protoself[ field ] instanceof Array && typeof( collectionObjects[ i ][ field ] ) === "undefined" ){
              collectionObjects[ i ][ field ] = [];
            }
          }
        }

        instances = [];
        for ( collectionObject in collectionObjects ){
          var instance = new protoself.instance( collectionObjects[ collectionObject ] );
          instances.push( instance );
        }

        return instances;
      }
    },

    findOne: { value: function( filter, options ){
        var protoself = this;

        filter = filter || {};
        _.extend( filter, protoself.filter() );
        options = options || {};
        _.extend( options, { fields: this.fieldsFilter() } );
        var collectionObject = protoself.collection.findOne( filter, options );

        var instance;
        if ( collectionObject ){
          for ( field in protoself ){
            if ( protoself[ field ] instanceof Array && typeof( collectionObject[ field ] ) === "undefined" ){
              collectionObject[ field ] = [];
            }
          }

          instance = new protoself.instance( collectionObject );
        }

        return instance;
      }
    }
  });

  var model = new Model;
  Object.defineProperties( Model.prototype, {
    instance: { value: Formation.ModelInstance({ model: model }) },
    newInstance: { value: Formation.NewModelInstance({ model: model }) }
  });

  var schema = params.schema || err( 'Please add a schema to this model' );
  for ( field in schema ){
    Object.defineProperty( model, field, { value: schema[ field ], enumerable: true });
  }

  return model;
};
