Ext.define('JWF.store.Posts', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'JWF.model.Post',

        proxy: {
            type: 'jsonp',
            url: 'http://localhost:5000/posts'
        }
    }
});
