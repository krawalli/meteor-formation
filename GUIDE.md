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
Models consist of this properties... (TODO)

## Fields
The possible field-types will define your collection document (TODO)

## Best Practice
Hints and Tips (TODO)

## Sample Models
Common patterns for models for easier start with new models for your project. Please share your models with the rest of the world by placing the source of them in issue or pull-request - Thank you!

### Meteor User
(TODO)
