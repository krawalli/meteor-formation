# Formation - easy meteor forms and models
Formation will take care of modeling your collection documents, take care of simple form creation and even more: client and server side validation.

[TOC]

## Getting started
Create a model instead of only simply a collection. With this little more effort you design a scheme for the documents inside the collection. Based on that scheme *Formations* is able to add the corresponding input fields in your template and adds automatically field validation.

Basic usage:

instead of defining a collection like this:

```javascript
    Items = new Mongo.Collection('items');
```

go with this:

```javascript
  Items = new Formation.Model({
    collection: new Meteor.Collection('items')
  });
```

When using *publish* function you can access the (meteor) collection like this:

```javascript
  Meteor.publish('allItems', function () {
  return Items.collection.find();
  });
```

To define the schema inside the model add them to the schema property like this:
```javascript
  Items = new Formation.Model({
    collection: new Meteor.Collection('items'),
    schema: {
      fieldname: new Fields.Char({
        max: 100
      })
    }
  });
```
Now after you defined your first field, you can easily used it in template with the **dxField** template that will render the input field, validator messages etc.:


```html
<template name="myItems">
  ...
  {{> dxField fieldname}}
  ...
  {{> dxButtons}}
</template>
```
Here we used another template *dxButtons*, which will turn the dxField in edit-mode or when in edit mode it shows button for save or cancel your input.

This is the basic usage of *Formation*. There are much more options and possibilities described in the following chapters.

## Models
Models determine the data structure of the forms. They take one {options} object as an argument. That options argument includes the following:

- **collection**: a Mongo.Collection object. Optional when creating forms that don't touch the database.
- **schema**: an object containing one or multiple Formation.Fields (see *Fields* for details)
- **virtualFields**: an object containing functions that manipulate and returns data. They are top level functions on ModelInstances, and they will run in the context of a ModelInstance. They extend your document by this fields. The values are not saved to the database. They behavior is reactive
- **beforeValidation**: a function that runs before validating a model. Has the context of a ModelInstance
- **afterValidation**: a function that runs after validating a model. Has the context of a ModelInstance
- **modelValidator**: a function that returns a Match.Where pattern and runs after validating a model. You'd usually use this to validate something about the model as a whole. Has the context of a ModelInstance
- **beforeSave**: a function that runs before saving a model. Has the context of a ModelInstance
- **afterSave**: a function that runs after saving a model. Has the context of a ModelInstance
- **editable**: a function that returns a boolean, and determines whether or not a user can edit it (i.e. put it into editMode). Client-side only.
- **savable**: a function that returns a boolean, and determines whether or not a user can save it.
- **removable**: a function that returns a boolean, and determines whether or not a user can remove it, whether it's a nested document or not.
- **extra**: if model is in a nested array, the number of extra newInstances to add if field is empty. *Client-side only*

### collection
The value of this property points to a Mongo.Collection object.
Example:
```javascript
    collection: new Mongo.Collection('samples')
```

### schema
Object, determines data structure for your model, and is generally made up of Fields,
Example:
```javascript
    schema: {
        firstfield: new Formation.Fields.Char({
          max: 50
        }),
        anotherfield: new Formation.Fields.Number({})
    }
```


## Fields
The possible field-types will define your collection document (TODO)

## Best Practice
Hints and Tips (TODO)

## Sample Models
Common patterns for models for easier start with new models for your project. Please share your models with the rest of the world by placing the source of them in issue or pull-request - Thank you!

### Meteor User
(TODO)
