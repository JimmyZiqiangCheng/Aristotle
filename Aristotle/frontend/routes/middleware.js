const passport = require('passport');
const userType = {
    Employee: 'Employee',
    Admin: 'Administrator',
    Manager: 'Manager'
};

function authorise(type) {
    return (req, res, next) => {
        //console.log(req.cookies.jwt);
        if (!req.cookies)
        {   
             res.redirect("/login"); 
        }
        passport.authenticate('jwt', {session: false}, function(error, payload) {
                //1 get the token from cookies
            if(error) {
                console.log(error);
                res.redirect("/login"); 
                //res.send("Not Login");
            } else {
                //2 if the token exists, if not send them back to the login
                //3 decode the token and varify the type
                // if the input type is matching with the type of token
                // it is valid, otherwise: not
                if (type === payload['type']) {
                    req.payload = payload;
                    next(); 
                } else {
                    // token timeout or other reason
                    console.log(type);
                    res.redirect("/login");
                }
            }
            
        })(req,res,next);
    }
};

const isAdmin = (type = userType.Admin) => {
    return authorise(type);
};

const isEmployee = (type = userType.Employee) => {
    return authorise(type);
};

const isManager = (type = userType.Manager) => {
    return authorise(type);
};

module.exports = {isAdmin, isEmployee, isManager};