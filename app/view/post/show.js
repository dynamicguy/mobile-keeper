Ext.define('JWF.view.post.Show', {
    extend:'Ext.Container',
    xtype:'post-show',

    config:{
        title:'Information',
        baseCls:'x-show-post',
        layout:'vbox',

        items:[
            {
                id:'post',
                tpl:[
                    '<div class="top">',
                    '<img class="headshot" src="https://graph.facebook.com/{profileId}/picture?type=square" />',
                    '<div class="name"><div class="info">{description}</div>',
                    '<div class="location"><b>{latitude} , {longitude}</b></div>',
                    '<div class="time">{date}</div>',
                    '</div></div>'
                ].join('')
            },
            {
                xtype:'map',
                flex:1,
                mapOptions:{
                    zoomControl:true,
                    panControl:true,
                    rotateControl:true,
                    streetViewControl:true,
                    mapTypeControl:true,
                    navigationControl: true,
                    zoom:13
                }
            }
        ],

        record:null
    },

    updateRecord:function (newRecord) {
        if (newRecord) {
            this.down('#post').setData(newRecord.data);
            this.down('map').setMapCenter({
                latitude:newRecord.data.latitude,
                longitude:newRecord.data.longitude
            });
        }
    }
});
