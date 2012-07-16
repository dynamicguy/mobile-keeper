Ext.define('JWF.view.PostForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Spinner',
        'Ext.field.DatePicker'
    ],

    config: {

        padding: '15 15 15 15',
        scrollable: false,

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'New Post',
                items: [
                    {
                        xtype: 'button',
                        text: 'Back',
                        ui: 'back',
                        id: 'addPostBackBtn'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'textfield',
                        id   : 'latitudeField',
                        placeHolder: 'Latitude?'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'longitudeField',
                        placeHolder: 'Longitude?'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'descriptionField',
                        placeHolder: 'Description?'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Add Post',
                ui: 'facebook',
                id: 'addPostButton'
            }
        ]
    }
});
