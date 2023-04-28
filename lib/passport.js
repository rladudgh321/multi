module.exports = function(app){
    const authData = {
        email : "egoing777@gmail.com",
        pwd : "111",
        nickname : "egoing"
    }

    const passport = require('passport');
    const LocalStrategy = require('passport-local');

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser((user,done)=>{
        console.log("serializeUser", user);
        done(null, user.email);
    });

    passport.deserializeUser((id, done)=>{
        console.log("deserializeUser", id);
        done(null,authData);
    });


    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'pwd'
        },
        function(email, password, done) {
        console.log("LocalStrategy", email, password);
            if(email === authData.email){
                if(password === authData.pwd){
                    console.log("done");
                    done(null, authData, {message: 'welcome' });
                } else {
                    console.log("pwd");
                    done(null, false, {message: 'incorrect pwd'});
                }
            } else {
                console.log("email");
                done(null, false, {message: 'incorrect email'});
            }
        }
    ));
    return passport;
}