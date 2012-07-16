Ext.define('JWF.view.Main', {
    extend:'Ext.navigation.View',
    xtype:'mainview',

    requires:[
        'JWF.view.post.List',
        'JWF.view.post.Show',
        'JWF.view.post.Edit',
        'JWF.view.NoFriends'
    ],
    config:{
        autoDestroy:false,
        navigationBar:{
            docked:'top',
            id:'mainToolbar',
            cls:'mkToolbar',
            ui:'dark',
            items:[
                {
                    xtype:'button',
                    id:'editButton',
                    text:'Edit',
                    align:'right',
                    hidden:true,
                    hideAnimation:Ext.os.is.Android ? false : {
                        type:'fadeOut',
                        duration:200
                    },
                    showAnimation:Ext.os.is.Android ? false : {
                        type:'fadeIn',
                        duration:200
                    }
                },
                {
                    xtype:'button',
                    id:'saveButton',
                    text:'Save',
                    ui:'sencha',
                    align:'right',
                    hidden:true,
                    hideAnimation:Ext.os.is.Android ? false : {
                        type:'fadeOut',
                        duration:200
                    },
                    showAnimation:Ext.os.is.Android ? false : {
                        type:'fadeIn',
                        duration:200
                    }
                },
                {
                    xtype:'button',
                    cls:'fbButton',
                    align:'right',
                    iconCls:'showFormBtn',
                    id:'showFormButton'
                },
                {
                    xtype:'button',
                    cls:'fbButton',
                    align:'right',
                    iconCls:'signoutBtn',
                    id:'signout'
                }
            ]
        },
        items:[
            { xtype:'posts' }
        ]
    },

    initialize:function () {
        this.callParent();
        var meta = Ext.getCmp('signout');
        if (meta) {
            meta.element.on('tap', function (e) {
                meta.fireEvent('tap', meta, e);
            });
        }
    }
});
