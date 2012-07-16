Ext.define('JWF.view.post.Edit', {
    extend:'Ext.Container',
    xtype:'post-edit',

    config:{
        title:'Edit',
        layout:'fit',

        items:[
            {
                xtype:'formpanel',
                items:[
                    {
                        xtype:'fieldset',
                        defaults:{
                            labelWidth:'35%'
                        },
                        title:'Information',
                        items:[
                            {
                                xtype:'textfield',
                                label:'Latitude',
                                name:'latitude'
                            },
                            {
                                xtype:'textfield',
                                label:'Longitude',
                                name:'longitude'
                            },
                            {
                                xtype:'textfield',
                                label:'Description',
                                name:'description'
                            },
                            {
                                xtype:'textfield',
                                label:'Date',
                                name:'date'
                            }
                        ]
                    }
                ]
            }
        ],

        listeners:{
            delegate:'textfield',
            keyup:'onKeyUp'
        },

        record:null
    },

    updateRecord:function (newRecord) {
        this.down('formpanel').setRecord(newRecord);
    },

    saveRecord:function () {
        var formPanel = this.down('formpanel'),
            record = formPanel.getRecord();

        formPanel.updateRecord(record);

        return record;
    },

    onKeyUp:function () {
        this.fireEvent('change', this);
    }
});
