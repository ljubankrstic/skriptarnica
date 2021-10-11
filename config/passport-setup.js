const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User=require("../models/user-model");
//serialize user i deserialize user are used for authorization
passport.serializeUser((user,done)=>{
    //user is entry in our database, not neccesseraly google entry
    done(null,user.id);
});
//deserialize user retrieves user from database
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //saving user to the database

        //check if user already exists in our database
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if(currentUser){
                //already have the user
                console.log("User is:",currentUser);
                done(null,currentUser);
            }
            else{
                //if not, create user in our database
                new User({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser)=>{
                    console.log("New User:",newUser);
                    done(null,newUser);
                });
            }
        })
    })
);