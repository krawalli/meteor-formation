
///////////////////////
//  Extra Validators
///////////////////////

if ( typeof( Formation.Validators ) ===  'undefined' ){
	Formation.Validators = {



		Unique: function( fieldName ){
		  	return Match.Where( function( value ){
				return Meteor.users.find( { fieldName: value } ).count() === 0;
		  	})
		},


		Email: function( min, max ){
		  	return Match.Where( function( value ){
			  	try {
			  		check( value, String );
			  	} catch( error ){
			  		throw new Error( "Please enter a string value." );
			  	}
			  	if ( value.indexOf( '@' ) === -1 || value.indexOf( '.' ) === -1 ){
			  		throw new Error( "Please enter a valid email address." );
			  	}
			  	if ( ( min !== undefined && value.length < min ) || ( max !== undefined &&  value.length > max ) ){
	  				throw new Error( "Please enter an email address no longer than " + max.toString() + " characters." );
	  			}
	  			return true;
	  		});
		},


		Slug: function( min, max ){
		  	return Match.Where( function( value ){
			  	try {
			  		check( value, String );
			  	} catch( error ){
			  		throw new Error( "Please enter a string value." );
			  	}
			  	if ( ( min !== null && value.length < min ) || ( max !== null &&  value.length > max ) ){
	  				throw new Error( "Please enter a slug no longer than " + max.toString() + " characters." );
	  			}
	  			return true;
	  		});
		},


		BasicChar: function( min, max ){
		  	return Match.Where( function( value ){
		  		try {
		  			check( value, String );
		  		} catch( error ){
		  			throw new Error( "Please enter a string value." );
		  		}
		  		if ( value.length < min || ( max && value.length > max ) ){
		  			if ( !max ){
		  				throw new Error( "Please enter a value longer than " + min.toString() + " characters." );
		  			} else {
		  				throw new Error( "Please enter a value longer than " + min.toString() + " characters and less than " + max.toString() + " characters." );
		  			}
		  		}
		  		return true;
		  	});
		},


		CharArray: function( min, max ){
			return Match.Where( function( value ){
				try {
					check( value, Array );
				} catch( e ){
					throw new Error( "Please enter a value." );
				}

				check( value, [ Formation.Validators.BasicChar( 1 ) ] );
				if ( value.length < min || ( max && value.length > max ) ){
					if (! max ){
						throw new Error( "Please enter more than " + min.toString() + " values." );
					} else {
						throw new Error( "Please enter more than " + min.toString() + " and less than " + max.toString() + " values." );
					}
				}
				return true;
			});
		},


		BasicNumber: function( min, max ){
		  	return Match.Where( function( value ){
		  		try {
		  			check( value, Number );
		  		} catch( error ){
		  			throw new Error( "Please enter a number value." );
		  		}
		  		if ( ( typeof( min )==='number' && value < min ) || ( max && value > max ) ){
		  			if ( !max ){
		  				throw new Error( "Please enter a value greater than " + min.toString() + "." );
		  			} else {
		  				throw new Error( "Please enter a value greater than " + min.toString() + " and less than " + max.toString() + "." );
		  			}
		  		}
		  		return true;
		  	})
		},


		ValueIsInChoices: function( choices ){
		  	return Match.Where( function( value ){
				if ( value !== undefined && ! _.contains( choices, value ) ){
					throw new Error( value.toString() + ' is not an available choice' );
				} else {
					return true;
				}
		  	});
		},


		ChoicesArray: function( choices, min, max ){
		  	return Match.Where( function( value ){
					try {
						check( value, Array );
					} catch( e ){
						throw new Error( "Please enter a value." );
					}

	  			check( value, [ Formation.Validators.ValueIsInChoices( choices ) ] );
	  			if ( ( min !== null && value.length < min ) || ( max !== null &&  value.length > max ) ){
	  				if ( max !== null ){
	  					throw new Error( "Please choose at least " + min.toString() + " and no more than " + max.toString() + " choices." );
	  				} else {
	  					throw new Error( "Please choose at least " + min.toString() + " choice(s)." );
	  				}
		  		}
		  		return true;
		  	});
		},


		Time: function( min, max ){
			return Match.Where( function( value ){
				if (! _.isObject( value ) ){
					throw new Error( "Please enter a time object with {hour[,minute,second]}" );
				}
				if ( min &&
					 ( ( value.hour < min.hour ) ||
				       ( value.hour === min.hour && value.minute < min.minute ) ||
				       ( value.hour === min.hour && value.minute === min.minute && value.second < min.second ) )
				   ){
					throw new Error( "Please enter a time value greater than " + [ min.hour, min.minute, min.second ].join( ':' ) );
				}

				if ( max &&
					 ( ( value.hour > max.hour ) ||
				       ( value.hour === max.hour && value.minute > max.minute ) ||
				       ( value.hour === max.hour && value.minute === max.minute && value.second > max.second ) )
				   ){
					throw new Error( "Please enter a time value less than " + [ max.hour, max.minute, max.second ].join( ':' ) );
				}

				return true;
			});
		},

		Date: function( min, max ){
			return Match.Where( function( value ){
				try {
					check( value, Date );
				} catch( e ){
					throw new Error( "Please enter a date in YYYY-MM-DD format" );
				}

				if ( ! min instanceof Date || ! max instanceof Date ){
					throw new Error( "Please enter javascript Date objects as min and max values" );
				}

				if ( ( min !== null && value < min ) || ( max !== null && value > max ) ){
	  			if ( min === null ){
	  				throw new Error( "Please enter a value less than " + max.toLocaleString() + "." );
	  			} else if ( max === null ){
						throw new Error( "Please enter a value greater than " + min.toLocaleString() );
					} else {
	  				throw new Error( "Please enter a value greater than " + min.toLocaleString() + " and less than " + max.toLocaleString() + "." );
	  			}
		  	}

		  		return true;
			})
		},

		URL: function(){
			return Match.Where( function( value ){
				try {
					check( value, Formation.Validators.BasicChar( 10 ) );
				} catch( e ){
					throw new Error( 'Please include the full URL (http://...)');
				}
				var regex = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
				if (! value.match( regex ) ){
					throw new Error( "Please enter a valid URL." );
				}

				return true;
			})
		},

		FileUpload: function(){
			return Match.Where( function( value ){
				try {
					check( value, Formation.Validators.URL() );
				} catch( e ){
					throw new Error( "Please choose a file to upload." )
				}
				return true;
			})
		}
	}
}
