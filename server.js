require('colors');

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    logger = require('morgan'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    sessions = require('client-sessions'), // encrypted cookies!
    port = process.env.PORT || 1337,
    Routes = require('./routes'),
    app = express();

app.use(logger('dev'));
app.use(sessions({
    cookieName: '_mean-auth', // front-end cookie name
    secret: 'DR@G0N$', // the encryption password : keep this safe
    requestKey: 'session', // req.session,
    duration: 86400, // 60 * 60 * 24 (number of seconds in a day), tells the middleware when the cookie/session should expire,
    cookie: {
        ephemeral: false,   // when true, cookie expires when browser is closed
        httpOnly: true,     // when true, the cookie is not accesbile via front-end JavaScript
        secure: false       // when true, cookie will only be read when sent over HTTPS
    }
}));

app.use(express.static(path.join(__dirname,'public')));
app.post('*', bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.set('view engine','html'); // allows us to specify the default extension for the files in the views folder
app.engine('html', ejs.renderFile); // this is the function that binds to res.render

mongoose.connect('mongodb://localhost/mean-auth', (mongooseErr) => {
    if( mongooseErr ) {
        console.error('#ERROR#'.red,'Could not initilize mongoose!', mongooseErr);
    } else {
        console.info('Mongoose initilized!'.green.bold);
    }
});

Routes(app);

app.listen(port, (err) => {
    if( err ) {
        console.error('#ERROR#'.red,'Could not start server! :(');
    } else {
        console.log('\nMEAN Auth Server UP!'.green.bold, 'PORT:'.yellow, port);
    }
});
