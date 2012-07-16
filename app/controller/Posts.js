Ext.define('JWF.controller.Posts', {
    extend:'Ext.app.Controller',

    config:{
        refs:{
            main:'mainview',
            editButton:'#editButton',
            posts:'posts',
            showPost:'post-show',
            editPost:'post-edit',
            saveButton:'#saveButton'
        },

        control:{
            main:{
                push:'onMainPush',
                pop:'onMainPop'
            },
            editButton:{
                tap:'onPostEdit'
            },
            posts:{
                itemtap:'onPostSelect'
            },
            saveButton:{
                tap:'onPostSave'
            },
            editPost:{
                change:'onPostChange'
            },
            '#addPostButton':{
                tap:'addPost'
            },
            '#showFormButton':{
                tap:'showForm'
            },
            '#addPostBackBtn':{
                tap:'hideForm'
            }
        }
    },

    onMainPush:function (view, item) {
        var editButton = this.getEditButton();

        if (item.xtype == "post-show") {
            this.getPosts().deselectAll();

            this.showEditButton();
        } else {
            this.hideEditButton();
        }
    },

    onMainPop:function (view, item) {
        if (item.xtype == "post-edit") {
            this.showEditButton();
        } else {
            this.hideEditButton();
        }
    },

    onPostSelect:function (list, index, node, record) {
        var editButton = this.getEditButton();

        if (!this.showPost) {
            this.showPost = Ext.create('JWF.view.post.Show');
        }

        // Bind the record onto the show post view
        this.showPost.setRecord(record);

        // Push the show post view into the navigation view
        this.getMain().push(this.showPost);
    },

    onPostEdit:function () {
        if (!this.editPost) {
            this.editPost = Ext.create('JWF.view.post.Edit');
        }

        // Bind the record onto the edit post view
        this.editPost.setRecord(this.getShowPost().getRecord());

        this.getMain().push(this.editPost);
    },

    onPostChange:function () {
        this.showSaveButton();
    },

    onPostSave:function () {
        var record = this.getEditPost().saveRecord();

        this.getShowPost().updateRecord(record);

        this.getMain().pop();
    },

    showEditButton:function () {
        var editButton = this.getEditButton();

        if (!editButton.isHidden()) {
            return;
        }

        this.hideSaveButton();

        editButton.show();
    },

    hideEditButton:function () {
        var editButton = this.getEditButton();

        if (editButton.isHidden()) {
            return;
        }

        editButton.hide();
    },

    showSaveButton:function () {
        var saveButton = this.getSaveButton();

        if (!saveButton.isHidden()) {
            return;
        }

        saveButton.show();
    },

    hideSaveButton:function () {
        var saveButton = this.getSaveButton();

        if (saveButton.isHidden()) {
            return;
        }

        saveButton.hide();
    },

    init:function () {
        this.callParent();
        //Ext.getStore('Posts').on('load', this.onPostsLoad);
    },

    onPostsLoad:function (store) {
        var main = Ext.getCmp('main'),
            postList = Ext.getCmp('postList'),
            noFriends = Ext.getCmp('noFriends');
        if (store.getCount()) {
            if (!postList) {
                postList = Ext.create('JWF.view.post.List', {
                    id:'postList'
                });
            }
            main.setActiveItem(postList);
        } else {
            if (!noFriends) {
                noFriends = Ext.create('JWF.view.NoFriends', {
                    id:'noFriends',
                    data:JWF.userData
                });
            }
            main.setActiveItem(noFriends);
        }
    },

    showForm:function () {
        if (!this.addPostForm) {
            this.addPostForm = Ext.create('JWF.view.PostForm', {
                id:'postForm'
            });
        }
        Ext.Viewport.setActiveItem(this.addPostForm);
    },

    hideForm:function () {
        Ext.Viewport.setActiveItem(Ext.getCmp('main'));
        Ext.getCmp('postForm').hide();
    },

    addPost:function () {
        var latitude = Ext.getCmp('latitudeField').getValue(),
            longitude = Ext.getCmp('longitudeField').getValue(),
            description = Ext.getCmp('descriptionField').getValue();
        Ext.getCmp('postForm').setMasked({
            xtype:'loadmask',
            message:'Adding New Post...'
        });
        Ext.Ajax.request({
            url:'/post',
            method:'POST',
            params:{
                latitude:latitude,
                longitude:longitude,
                description:description
            },
            callback:this.onAddPost,
            scope:this
        });
    },

    onAddPost:function (options, success, response) {
        Ext.getCmp('postForm').setMasked(false);
        this.hideForm();
        Ext.getStore('Posts').load();
    }
});
