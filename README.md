# Formation - easy meteor forms and models
Formation is a slender form creation package for Meteor.

Formation will take care of modeling your collection documents, facilitate form creation and submission, and, even more, validate data on both the client and the server.


### Live Demo here:  http://formation.meteor.com/
### Reference Documentation here:  http://quietcreep.github.io/meteor-formation/


======================================


# Getting started
If you're looking for data type validation, display options, and plenty of built-in hooks, you can define a Formation Model to handle standard forms simply and effectively. With only a little extra effort, you can design a schema for collection documents. Based on the schema you define **Formation** is able to add the corresponding input fields in your template and automatically handle field validation.

To keep things simple, Formation favors convention over configuration. Bootstrap styling comes stock, and input types are neatly mapped to Meteor template widgets, but both can be overridden.

Finally, Formation *does not* enforce data schemas an a database level. Part of MongoDB's draw is flexibility, and part of Formation's flexibility is the ability to use one collection for any number of models. More on this below...


## Basic usage:
### Defining a Model
In Meteor, you'd normally define a collection like this:
```javascript
  ItemsCollection = new Mongo.Collection('items');
```

From there, you could define a basic Model with no fields:
```javascript
  Items = new Formation.Model({
    collection: ItemsCollection
  });
```

Or you can do it all at once:
```javascript
  Items = new Formation.Model({
    collection: new Meteor.Collection('items')
  });
```

If you need access to a collection you defined inside a Model, you can use MyModel.collection.  This will come in handy when using publishing functions like the one below.
```javascript
  Meteor.publish( 'allItems', function () {
    return Items.collection.find();
  });
```

To define the schema inside the model add a schema object. Each value inside the schema object should be either a Formation Field, a Model, or an Array with a single Model in it.
```javascript
  Items = new Formation.Model({
    collection: new Meteor.Collection('items'),
    schema: {
      itemName: new Fields.Char({ max: 100 }),
    }
  });
```


--------------------------------------


### Fields
Because Formation prioritizes convention over configuration, there are a variety of Fields to choose from, each one tailored to a specific data type, display type, or handling method.

All the built-in fields inherit from the generic **Formation.Field**, so most of the fields include these options. The generic field is missing some key components for effective use, so don't expect to use this unless you're creating your own field. Except for **widget**, the values for the options listed are the default values.
```javascript
var genericField = new Formation.Field({
  min: null,                // minimum value or length
  max: null,                // minimum value or length
  required: true,           // whether field is required to have a value
  label: '',                // appears as field label; defaults to title case
                            // version of field name
  widget: 'CustomWidget',   // the name of the template to use to display the
                            // field; each field has its own default widget
  unique: false,            // the value of this field should be unique inside
                            // this collection
  defaultValue: undefined   // a value or function to initialize a field with
                            // if no value is provided
  summary: undefined        // a function to return a transformed value for
                            // display mode, if unset, will return field.toDOM()
});
```


Each field below has all of the above options, but certain fields require specific options. If an option is required or is specific to a field, it will appear below.
```javascript
// for Boolean data
// default widget is CheckboxInput;
// default value is false unless otherwise specified
var BooleanField = new Formation.Fields.Boolean;


// for String data
// default widget is TextInput; another pre-made option is TextArea
var CharField = new Formation.Fields.Char({ max: 255 });


// For an array of strings
// default widget is TextInput
// optional delimiter value for separating string into array, default is a comma
var CharArray = new Formation.Fields.CharArray({ delimiter: ',' });


// For a single value from a set of choices
// default widget is SelectInput
// choices can be an array or a function that returns an array
var SingleChoice = new Formation.Fields.SingleChoice({
  choices: [ 'apple', 'oranges', 'bananas' ]
});


// For a single value from a set of choices
// default widget is SelectInput
// choices can be an array or a function that returns an array
var MultipleChoice = new Formation.Fields.MultipleChoice({
  choices: function(){ return [ '1 potato', '2 potato', '3 potato', '4' ] }
});


// For a date with no time value (time set to 00:00:01)
// default widget is DateInput
// min and max can be Date objects or milliseconds since 00:00:00 1 January 1970
var DateField = new Formation.Fields.Date


// For a date with time value
// default widget is DatetimeInput
// min and max can be Date objects or milliseconds since 00:00:00 1 January 1970
var DatetimeField = new Formation.Fields.Datetime;


// For an email address
// default widget is EmailInput
var EmailField = new Formation.Fields.Email({
  max: 255
});


// For a single reference to another model; value is _id; similar to a foreign key
// default widget ModelSelect
var ModelSingleChoice = new Formation.Fields.ModelSingleChoice({
  model: MyModel,
  filter: { name: { '$in': [ 'this one', 'that one', 'the other one' ] }}  // optional query filter for choices
});


// For array of references to another model; value is array of _id's; similar to M2M field
// default widget ModelSelectMultiple
var ModelSingleChoice = new Formation.Fields.ModelMultipleChoice({
  model: MyModel,
});


// for Number data
// default widget is NumberInput; another pre-made option is TextArea
var NumberField = new Formation.Fields.Number;


// For an array of Numbers
// default widget is TextArray
// optional delimiter value for separating string into array, default is a comma;
// will attempt to convert split values into Numbers
var NumberArray = new Formation.Fields.NumberArray({ delimiter: ',' });


// For passwords; exactly like Fields.Char, but hides input values
// default widget is PasswordInput
var PasswordField = new Formation.Fields.Password({
  max: 255
});


// For slugs; exactly like Fields.Char, but slugifies input values
// default widget is SlugInput
var SlugField = new Formation.Fields.Slug({
  max: 255,
});


// For URLs; exactly like Fields.Char, but expects valid URLs
// default widget is URLInput
var URLField = new Formation.Fields.URL({
  max: 255,
});
```


--------------------------------------


### Using ModelInstances
Once you've defined your form, you can instantiate ```ModelInstance```s like this:
```javascript
var items = Items.find({/* query options */}, {/* other options */});

// or

var item = Items.findOne({/* query options */}, {/* other options */});
```

The usage is almost identical to ```Collection.find()``` and ```Collection.findOne()``` with a major exception: ```MyModel.find()``` does not return a cursor object, it returns an array of ModelInstances. If you need access to the raw Collection, you can use ```MyModel.collection```.


If you are creating a new ModelInstance (also called **NewModelInstance**):
```javascript
var newItem = new Items.newInstance;

// or

var newItemWithData = new Items.newInstance({ itemName: "my first items" });
```

The major difference between **ModelInstance** and **NewModelInstance** is how they handle saving. ModelInstances use update, while NewModelInstances use insert.


Here are a a few methods available on a ModelInstance.
```javascript
// first validate, then save (update) contents of ModelInstance;
// callback on ModelInstances receives errors, then updated value;
item.save(/* callback */);


// first validate, then save (insert) contents of NewModelInstance;
// callback on NewModelInstances receives errors first, then _id value;
newItem.save(/* callback */);


// validate the contents of the ModelInstance
item.validate(/* callback */);


// get top-level (model specific) errors;
// returns array of errors
var errors = item.errors();


// get all errors for each field;
// returns an object; keys are field names, values are array of errors
var allErrors = item.getAllErrors();


// get the raw values of each field and return as a JS object
var itemValues = item.getValue();


// toggle or set editMode
item.editMode(/* boolean */);


// set field values with either raw JS object or another ModelInstance
item.setValue({ itemName: "here's a new name" });


// check whether ModelInstance is new
var isItemNew     = item.isNew()      // returns false
var isNewItemNew  = newItem.isNew()   // returns true


// check whether ModelInstance is savable
var isItemSavable = item.savable();


// check whether ModelInstance is removable;
var isItemRemovable = item.removable();
```


--------------------------------------


### In Templates
Now after you defined your Model and created a ModelInstance, you can easily use the ModelInstance in template with the **dxField** template. Out of the box, the dxField template will render the input field, validator messages etc.

```Handlebars
<template name="myItems">
  <form class="form-horizontal" role="form">
    {{# each errors }}
      {{! show top level errors }}
      <span class="errors">{{ message }}</span>
    {{/ each }}

    {{> dxField itemName }}

    {{> dxButtons }}
  </form>
</template>
```

Here we used another template **dxButtons**; the edit button turns on editMode, displaying the input and save/cancel buttons for the field.  **dxButtons** acts within the current context, so make sure the context is a ModelInstance.


--------------------------------------


### Advanced Usage
When defining a Model, you can use another Model (with no collection) as a field value. You can also indicate an array of Models by enclosing a Model in an array. For instance:
```javascript
Users = Formation.Model({
  collection: Meteor.users,
  schema: {
    username: new Formation.Fields.Char({ max: 255 }),
    emails: [ Formation.Model({
      schema: {
        address: new Formation.Fields.Email({ max: 255 }),
        verified: new Formation.Fields.Boolean
      }
    }) ],
    profile: Model({
      schema: {
        firstName: new Formation.Fields.Char({ max: 40 }),
        lastName: new Formation.Fields.Char({ max: 40 })
      }
    })
  }
});
```

Or for easier readability:
```javascript
var userEmails = Formation.Model({
  schema: {
    address: new Formation.Fields.Email({ max: 255 }),
    verified: new Formation.Fields.Boolean
  }
});

var userProfile = Model({
  schema: {
    firstName: new Formation.Fields.Char({ max: 40 }),
    lastName: new Formation.Fields.Char({ max: 40 })
  }
});

Users = Formation.Model({
  collection: Meteor.users,
  schema: {
    username: new Formation.Fields.Char({ max: 255 }),
    emails: [ userEmails ],
    profile: userProfile
  }
});
```

#### In Templates
With nested Models, you can use an iterator helper to iterate over arrays; the standar **#each** tag works well, but for adding and removing, **#dxArray** facilitates by adding an "add new" button and an event hook for removing, just add an element with attribute data-action="btn-remove" in the context of the item to be removed.

```Handlebars
<template name="myItems">
  <form class="form-horizontal" role="form">
    {{> dxField username }}

    {{# each emails }}
      {{> dxField address }}
    {{/ each }}

    {{> dxButtons }}
  </form>
</template>
```

or

```Handlebars
<template name="myItems">
  <form class="form-horizontal" role="form">
    {{> dxField username }}

    {{# each dxArray field=emails model=this }}
      {{> dxField address }}
      <span class="glyphicon glyphicon-remove" data-action="btn-remove"></span>
    {{/ each }}

    {{> dxButtons }}
  </form>
</template>
```


For ease of accessing extra or transformed information, you can add virtualFields. Each virtual field is a function that returns data from inside a ModelInstance in a manner you determine. For instance:
```javascript
// ...
Users = Formation.Model({
  collection: Meteor.users,
  schema: {
    username: new Formation.Fields.Char({ max: 255 }),
    emails: [ userEmails ],
    profile: userProfile
  },
  virtualFields:{
    fullName: function(){
      return this.profile.firstName.value + ' ' + this.profile.lastName.value;
    }
  }
});
```


If one of your models is being referenced by another in a ModelChoice type field, the model should have a **summary** function that determines how that model is displayed within an <option> tag.
```javascript
// ...
Users = Formation.Model({
  collection: Meteor.users,
  schema: {
    username: new Formation.Fields.Char({ max: 255 }),
    emails: [ userEmails ],
    profile: userProfile
  },
  virtualFields:{
    fullName: function(){
      return this.profile.firstName.value + ' ' + this.profile.lastName.value;
    }
  },
  summary: function(){
    return this.fullName();
  }
});
```


For Models that you'd prefer to handle saving yourself, you can define a Model with no collection and a custom save method.  Keep in mind that the context of the save method is the ModelInstance.
```javascript
var userProfile = Model({
  schema: {
    firstName: new Formation.Fields.Char({ max: 40 }),
    lastName: new Formation.Fields.Char({ max: 40 })
  }
});

NewUsers = Formation.Model({
  schema: {
    username: new Formation.Fields.Char({ max: 255 }),
    emails: new Formation.Fields.Email({ max: 255 }),
    profile: userProfile
  },
  save: function(){
    this.validate();
    return Accounts.createUser( this.getValue() );
  }
});
```


Here's a list of options that you can pass into a Model:
- **collection**: a Mongo.Collection object. Optional when creating forms that don't touch the database.
- **schema**: an object containing one or multiple Formation.Fields (see *Fields* for details)
- **virtualFields**: an object containing functions that manipulate and returns data. They are top level functions on ModelInstances, and they will run in the context of a ModelInstance. They extend your document by this fields. The values are not validated or saved to the database. Their behavior is reactive.
- **beforeValidation**: a function that runs before validating a model. Has the context of a ModelInstance.
- **afterValidation**: a function that runs after validating a model. Has the context of a ModelInstance.
- **modelValidator**: a function that returns a Match.Where pattern and runs after validating a model. You'd usually use this to validate something about the model as a whole, like relationships between two or more fields. Has the context of a ModelInstance.
- **beforeSave**: a function that runs before saving a model. Has the context of a ModelInstance.
- **afterSave**: a function that runs after saving a model. Has the context of a ModelInstance. Useful for doing things like sending an email after a successful save.
- **editable**: a function that returns a boolean, and determines whether or not a user can edit it (i.e. put it into editMode). Client-side only.
- **savable**: a function that returns a boolean, and determines whether or not a user can save it.
- **removable**: a function that returns a boolean, and determines whether or not a user can remove it, whether it's a nested document or a top level doc.
- **extra**: if model is in a nested array, the number of extra newInstances to add if field is empty. *Client-side only*


--------------------------------------


## Best Practice
Hints and Tips (TODO)

### Meteor User
(TODO)


--------------------------------------


## A little background and design reasoning
I came from Django, and I began to miss Django's model definition and form creation. I missed how it enforced specific data types with certain specifications; we all know user input can be sketchy...

What I didn't miss is the process of updating/mutating/migrating when someone wanted to change a core feature or data type. Non-developers don't really think about their features and/or the depth of requested changes.

So, I tried a few other form packages, but the syntax was unlike what I was used to, and they didn't take advantage of all the new data structures possible with MongoDB.

So I created a package that quickly expanded beyond my initial goal. Because of Meteor's lovely reactive design, I realized that a nice form package could help move away from the typical "Admin" interfaces of frameworks like Django, and replace it with an in-place editing system for simpler user experience.
