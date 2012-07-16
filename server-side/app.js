var graph = require('fbgraph'),
    _ = require('underscore'),
    crypto = require('crypto'),
    express = require('express'),
    connect = require('connect'),
    MongoStore = require('connect-mongo'),
    mongoose = require('mongoose');

var config = {
    //redirect_uri:  'http://freezing-fire-5124.herokuapp.com',
    redirect_uri:'http://localhost:5000',
    client_id:'132745930199228',
    client_secret:'85df4b43815ceb976c9050f4f77f599f',
    //mongoDb:       'mongodb://mongoUser:mongoPass@dbh23.mongolab.com:27237/keeper',
    mongoDb:'mongodb://mongoUser:mongoPass@localhost:27017/keeper',
    // Session encyption key
    sessionSecret:'oasjdf0asdufdsf0asd9f0adfks'
};

// Database and Model setup
mongoose.connect(config.mongoDb);

Post = mongoose.model('Post', new mongoose.Schema({
    latitude:String, //{type: Array, index: "2d"},
    longitude:String, //{type: Array, index: "2d"},
    date:Date,
    profileId:Number,
    description:String
}));


// App server setup
var app = express.createServer(
    connect.static(__dirname + '/public'),
    connect.cookieParser(),
    express.session({
        secret:config.sessionSecret,
        store:new MongoStore({ url:config.mongoDb })
    }),
    connect.bodyParser(),
    express.logger(),
    express.errorHandler({ dumpExceptions:true })
);

app.enable('jsonp callback');
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

function checkFbSession(req, res, next) {
    var fbCookie = req.cookies['fbsr_' + config.client_id],
        parsedToken, base64data;
    if (!fbCookie) {
        handleError('No Facebook cookie detected.', null, req, res);
        return;
    }
    base64data = fbCookie.split('.', 2);
    parsedToken = JSON.parse(new Buffer(base64data[1], 'base64').toString('ascii'));
    if (req.session.fb && req.session.fb.user_id == parsedToken.user_id && req.session.fb.code == parsedToken.code) {
        graph.setAccessToken(req.session.fb.access_token);
        next();
    } else {
        console.log("Found Facebook cookie. Swapping Auth code for access_token...");
        req.session.fb = {
            user_id:parsedToken.user_id,
            code:parsedToken.code
        };
        graph.authorize({
            "redirect_uri":"", // Facebook JS SDK sets redirect_uri to ''
            "client_id":config.client_id,
            "client_secret":config.client_secret,
            "code":parsedToken.code
        }, function (err, facebookRes) {
            if (err) {
                handleError('Error obtaining Facebook access_token.', facebookRes, req, res);
                return;
            }
            console.log("Successfully obtained Facebook access_token.");
            req.session.fb.access_token = facebookRes.access_token;
            graph.setAccessToken(facebookRes.access_token);
            next();
        });
    }
}
var handleError = function (msg, err, req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    console.log(msg, err);
    res.json({ success:false, error:err });
};
app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});


app.get('/posts', checkFbSession, function (req, res) {
    console.log("Getting list of friends for " + req.session.fb.user_id + "...");
    graph.get("/me/friends", function (err, friends) {
        if (err) {
            handleError('Could not retrieve list of friends', friends, req, res);
            return;
        }
        console.log("Found " + friends.data.length + " friends. Searching for runs...");
        // Create an array of friend IDs
        var friendIds = _.map(friends.data, function (f) {
            return f.id;
        });
        // Add the users ID to the list
        friendIds.push(req.session.fb.user_id);
        // Search for all runs in the database with a profile ID in the friendIds array
        Post.where('profileId').in(friendIds).sort('date', -1).run(function (err, rows) {
            if (err) {
                handleError('Could not retrieve list of runs', rows, req, res);
                return;
            }
            console.log("Found " + rows.length + " posts.");
            res.json(rows);
        });
    });
});

app.post('/post', checkFbSession, function (req, res, next) {
    console.log("Saving new Post for " + req.session.fb.user_id + "...");
    graph.get("/me", function (err, user) {
        if (err) {
            handleError('Could not retrieve user info', user, req, res);
            return;
        }
        console.log(user);
        var post = new Post({
            latitude:req.body.latitude || 'Unknown latitude',
            longitude:req.body.longitude || 'Unknown longitude',
            date:new Date(),
            profileId:user.id,
            description:req.body.description || ''
        });
        post.save(function (err) {
            if (err) {
                handleError('Could not save post', err, req, res);
                return;
            }
            console.log("Successfully saved new post");
            res.json({ success:true });
        });
    });
});
