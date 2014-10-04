YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Field",
        "FieldInstance",
        "Model",
        "ModelInstance",
        "ModelSuper",
        "NewModelInstance"
    ],
    "modules": [
        "Field",
        "FieldInstance",
        "Formation",
        "Model",
        "ModelInstance"
    ],
    "allModules": [
        {
            "displayName": "Field",
            "name": "Field",
            "description": "Field Parent Model; all fields inherit from this"
        },
        {
            "displayName": "FieldInstance",
            "name": "FieldInstance",
            "description": "FieldInstance; does the actual handling and validation of data"
        },
        {
            "displayName": "Formation",
            "name": "Formation",
            "description": "Generate Forms from JS; for Meteor"
        },
        {
            "displayName": "Model",
            "name": "Model",
            "description": "Make a Model for a form/DB document to adhere to and validate against"
        },
        {
            "displayName": "ModelInstance",
            "name": "ModelInstance",
            "description": "Model Super Class; not usually used by end dev"
        }
    ]
} };
});