// app/routes.jss

var User  = require('../app/models/user');
var Words = require('../app/models/word');

var mongoose = require('mongoose');

module.exports = function (app, passport) {

    // =====================================
    // MAIN SECTION ========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	// main page to record word
	app.get('/mainpage', isLoggedIn, function (req, res) {
    	res.render('mainpage.ejs', {
    		user: req.user,
    		word: req.word
    	}); // load the mainpage.ejs file
    });

    app.post('/mainpage', isLoggedIn, function (req, res) {
        var newWord     = new Words();
        var months 	    = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var time 		= new Date();
        var curr_date   = time.getDate();
        var curr_month  = months[time.getMonth()];
        var curr_year   = time.getFullYear();
        var curr_hour   = time.getHours();
        var curr_minite = time.getMinutes();

        // set the word
        newWord.recordContent  = req.param('words');
        newWord.recordDate     = curr_date + '-' + curr_month + '-' + curr_year 
        								   + ' ' 
        								   + curr_hour + ':' + curr_minite;
        newWord.recorderEmail  = req.user.local.email;
        
        console.log(newWord.recordDate);
        
        newWord.save();
        res.redirect('/record');
    });
	
	
	
    // =====================================
    // WORD SECTION ========================
    // =====================================
	app.get('/record', isLoggedIn, function(req, res) {
		Words.find({"recorderEmail": req.user.local.email}, function (err, user_words) {
			if (err) {
			}
			;
			res.render('record.ejs', {
				user: req.user,
				words: user_words
			});
		});
	});	
	
	
    // =====================================
    // INDEX PAGE (with login links) =======
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/mainpage', // redirect to the mainpage
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));
    

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/mainpage', // redirect to the mainpage
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
//      mongoose.connection.close();
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the index page
    res.redirect('/');
}


