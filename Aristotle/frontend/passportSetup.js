const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT   = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const bcrypt        = require('bcrypt');
const backendApi    = require('./repositories/restful-api');

//const { secret }  = require('./keys');

passport.use(new LocalStrategy(async (username, password, done) => {
  //const userDocument = await UserModel.findOne({username: username}).exec();
  //const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
  // console.log(username);
  // console.log(password);
  
  backendApi.authenticate(username, password).then((user) => {
    // if having user response as a Json Object
    if (user) {
      //console.log(user);
        return done(null, {
          username: user['username'],
          type: user['type']
        });
      }
    else {
      return done('Incorrect Username / Password');
    }
  }).catch((err) => {
    return done(err);
  });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: "jwtsecret",
  },
  (jwtPayload, done) => {
    //console.log(Date.now());
    //console.log("Token expire:", jwtPayload.expires);
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    } else {
      return done(null, jwtPayload);
    }
  }
));