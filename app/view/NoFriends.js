Ext.define('JWF.view.NoFriends', {
    extend: 'Ext.Container',
    config: {
        cls: 'noFriends',
        tpl: [
            '<div class="welcomeNoFriends">',
                '<img src="https://graph.facebook.com/{id}/picture?type=square" />',
                'Welcome to Mobile Keeper with Friends, <b>{first_name} {last_name}</b>!',
            '</div>'
        ]
    }
});
