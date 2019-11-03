const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    cookieParser = require("cookie-parser"),
    morgan = require('morgan'),
    passport    = require("passport");
    
//required routes
const adminRoutes   = require("./routes/admin"),
    indexRoutes     = require("./routes/index"),
    managerRoutes   = require("./routes/manager"),
    employeeRoutes  = require("./routes/employee");

require("./passportSetup");
    
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/test",function(req,res){
   res.render("coverpage.ejs"); 
});

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("/manager", managerRoutes);
const port = process.env.PORT || 8888;

const ip = process.env.IP || "127.0.0.1";

app.listen(port,ip,function(){
    console.log(`server has started at ${ip}:${port}`);
});