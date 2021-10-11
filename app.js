const express = require("express");
const app = express();
const authRouter=require("./routes/auth-routes");
const profileRouter=require("./routes/profile-routes");
const passportSetup=require("./config/passport-setup");
const cookieSession=require("cookie-session");
const passport=require("passport");
const keys=require("./config/keys");
const mongoose=require("mongoose");
//set up the view engine
app.set("view engine","ejs");
//set up the cookie session
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys:[keys.session.cookieKey]
}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connecting to our database
mongoose.connect(keys.mongo.url);

//set up routes middleware
app.use("/auth",authRouter);
app.use("/profile",profileRouter);

//create home route
app.get("/",(req,res)=>{
    res.render("home",{user:req.user});
});

//Listen on a port 3000
app.listen(3000,()=>{
    console.log("App is listening on port 3000.....");
});