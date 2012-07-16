Ext.define('JWF.model.Post', {
    extend:'Ext.data.Model',
    config:{
        fields:[
            { name:'date', type:'date' },
            { name:'profileId', type:'string' },
            { name:'description', type:'string' },
            { name:'latitude', type:'string' },
            { name:'longitude', type:'string' }
        ]
    }
});
