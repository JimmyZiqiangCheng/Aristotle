var express = require("express");
var router  = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create seed data
const Repositories = require('../repositories/restful-api');

router.get('/',function(req,res){
  res.render("coverpage.ejs");
});

router.get('/login',function(req,res){
    //res.send("request");
    res.render("login/login.ejs"); 
});

router.get('/forgot_password',function(req,res){
  res.render("login/forgot_password.ejs");
});

router.get('/reset_password',function(req,res){
  res.render("login/reset_password.ejs");
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // authentication will take approximately 13 seconds
  // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
  const hashCost = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    //createfromBackend;
    
    res.status(200).send({ username });
    
  } catch (error) {
    res.status(400).send({
      error: 'req body should take the form { username, password }',
    });
  }
});

router.post('/login', function (req, res) {
  passport.authenticate(
    'local', {
      session: false
    },
    (error, user) => {

      if (error != null || user == null) {
        res.send(error);
      } else {
        /** This is what ends up in our JWT */
        const payload = {
          username: user.username,
          expires: Date.now() + (2*3600000),
          type: user.type,
        };

        /** assigns payload to req.user */
        req.login(payload, {
          session: false
        }, (error) => {
          if (error) {
            res.send({
             error
            });
          }

          /** generate a signed json web token and return it in the response */
          //const token = jwt.sign(JSON.stringify(payload), keys.secret);
          const token = jwt.sign(JSON.stringify(payload), "jwtsecret");
          //console.log(token);
          //console.log(user.type);
          //res.status(200).send({ username });
          if (user.type === "Employee") {
            res.status(200).cookie('jwt', token, {
              httpOnly: true,
              secure: false,
              maxAge: 2 * 3600000
            }).redirect("/employee");
          } else if (user.type === "Administrator") {
            res.status(200).cookie('jwt', token, {
              httpOnly: true,
              secure: false,
              maxAge: 2 * 3600000
            }).redirect("/admin");
          } else if (user.type === "Manager") {
            res.status(200).cookie('jwt', token, {
              httpOnly: true,
              secure: false,
              maxAge: 2 * 3600000
            }).redirect("/manager");
          } else {
            console.log("-> A invalid type of user logging in to our server, omg...");
            res.send("This is not a valid user");
          }
        });
      }
    }
  )(req, res);
});

module.exports = router;