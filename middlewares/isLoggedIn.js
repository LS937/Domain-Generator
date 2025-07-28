const jwt = require('jsonwebtoken');
const userModel = require("../models/user");
const cookieParser = require('cookie-parser');

require('dotenv').config();

module.exports = async function (req, res, next){
    if(!req.cookies.token){
        req.flash("error","you need to login first");
        res.redirect("/login");
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
        .findOne({email: decoded.email})
        .select("-password");
        req.user = user;
        next();

    }
    catch(err){
        req.flash("error","something went wrong");
        return res.redirect("/login");
    }
}