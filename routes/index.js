var Auth = require('./auth');

module.exports = (app) => {
    app.get('/', (req,res) => { // if needed, break this out into a controller!
        res.render('home.html');
    });

    app.get('/login', Auth.render);         // login page
    app.get('/logout', Auth.logout);        // logout route + redirect

    app.post('/login', Auth.login);         // login form submission
    app.post('/register', Auth.register);   // register form submission

    app.all('/dashboard', Auth.middlewares.session);
    app.get('/dashboard', (req, res) => { // if needed, break this out into a controller!
        res.render('dashboard.html', req.session);
    });
};
