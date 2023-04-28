const db = require('../lib/db');


module.exports = function(app){
    const passport = require('passport');
    const LocalStrategy = require('passport-local');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user,done)=>{
        console.log("serializeUser", user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        const user = db.get('users').find({id:id}).value();
        console.log("deserializeUser", id);
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'pwd'
        },
        function(email, password, done) {
        const user = db.get('users').find({email:email, pwd:password}).value();
        console.log("LocalStrategy", email, password);
            if(user){
                done(null, user, {message: 'welcome' });
            } else {
                done(null, false, {message: 'incorrect info'});
            }
        }
    ));
    return passport;
}