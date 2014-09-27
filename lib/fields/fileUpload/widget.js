Template.FileInput.events({
  'click .btn-upload' : function( event, template ){
    var self = this;
    event.preventDefault();
    var file = self.fromDOM( template.find( 'input' ).files[0] );
    var uploadTo = self.field.uploadTo;

    var reader = new FileReader;
    var fileData = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    reader.onload = function () {
      fileData.data = new Uint8Array( reader.result );
      self.value = Meteor.call( "S3upload", fileData, uploadTo, function( error, result ){
        if ( error ){
          console.log( error );
        } else {
          self.value = result;
          self.validate();
        }
      });
    };

    reader.readAsArrayBuffer( file );
  }
});
