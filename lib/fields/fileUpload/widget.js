function err( msg ){ throw new Error( msg ) };

Template.FileInput.events({
  // 'click .btn-upload' : function( event, template ){
  //   var self = this;
  //   event.preventDefault();
  //   var file = self.fromDOM( template.find( 'input' ).files[0] );
  //   var uploadTo = self.field.uploadTo;
  //
  //   var reader = new FileReader;
  //   var fileData = {
  //     name: file.name,
  //     size: file.size,
  //     type: file.type
  //   };
  //
  //   reader.onload = function () {
  //     fileData.data = new Uint8Array( reader.result );
  //     self.value = Meteor.call( "S3upload", fileData, uploadTo, function( error, result ){
  //       if ( error ){
  //         console.log( error );
  //       } else {
  //         self.value = result;
  //         self.validate();
  //       }
  //     });
  //   };
  //
  //   reader.readAsArrayBuffer( file );
  // },

  // for client-side upload
  'click .btn-upload' : function( event, template ){
    event.preventDefault();
    var self = this;
    var file = self.fromDOM( template.find( 'input' ).files[0] );
    var reader = new FileReader;
    var fileData;

    // after file reader has read data from field
    reader.onloadend = function(){
      fileData = reader.result.split(',');
      fileType = fileData[0].split(':')[1].split(';')[0];
      fileData = fileData[1];

      Meteor.call( "S3GeneratePolicy", self.field.uploadTo, function( err, value ){
        if ( err ) console.log( err );
        if ( err ) throw new Error( "Please check the file you've selected to upload" );

        var bucket = Formation.Settings.S3.bucket || err( "Please set Formation.Settings.S3.bucket" );
        var url = "http://" + Formation.Settings.S3.bucket + ".s3.amazonaws.com/";
        var bound = new Date;
        bound = bound.getTime();

        postHeaders = {
          // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          // "x-amz-date": value.date,
          "Content-Type": "multipart/form-data; boundary=" + bound,
        };

        bound = '--' + bound;
        postBody = [ bound ];
        postBody.push( "Content-Disposition: form-data; name=\"key\"",
                        '',
                        self.field.uploadTo + "${filename}",
                        bound );

        _.each( value.conditions, function( val ){
          if ( _.isObject( val ) && ! _.isArray( val ) ){
            for ( ke in val ){
              postBody.push( "Content-Disposition: form-data; name=\"" + ke + "\"",
                              '',
                              val[ ke ],
                              bound );
            }
          }
        });

        postBody.push( "Content-Disposition: form-data; name=\"file\"; filename=\"" + file.name + "\"" )
        postBody.push( "Content-Type: " + fileType, '' );
        postBody.push( fileData );
        postBody.push( bound + "--", '' );

        var bodyString = postBody.join( "\r\n" );

        HTTP.post( url, {
          headers: postHeaders,
          content: bodyString
        }, function( error, result ){
          if ( error ) console.log( error.message );
          if ( result ) console.log( result );
          // self.value = result;
        })
      })


    }

    reader.readAsDataURL( file );
  }
});
