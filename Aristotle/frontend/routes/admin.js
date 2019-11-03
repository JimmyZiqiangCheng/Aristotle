/*jshint esversion: 8 */ 

var express = require("express");
var router  = express.Router();
const middleware = require('./middleware');
const Repositories = require('../repositories/restful-api');

//Admin Home Page
router.get("/", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    
    res.render("admin/admin_home.ejs",{username:username});
});

/*--------------------------------------**/
/********** ACCOUNT GET/POST**************/
/*--------------------------------------**/

//account overview
router.get("/account_overview", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const userId = req.payload.userId;


    Repositories.getAllUsers().then(function(data) {
    
        const users = data.body;
        console.log(users);
        res.render("admin/admin_account_overview.ejs",{username: username, users:users,userId:userId});
        
    }).catch(function(error) {
        res.send("error");
    });
    
    
});  

//add account
router.get("/add_account", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;

    const proDepartments = Repositories.getAllDepartments();
    const proRoles = Repositories.getAllRoles();
    const proTypes = Repositories.getAllTypes();

    Promise.all([proDepartments, proRoles, proTypes]).then((data) => {
        const departments = data[0].body;
        const roles = data[1].body;
        const types = data[2].body;
        res.render("admin/admin_account_add.ejs",
        {
            username:username,
            departments: departments,
            roles: roles,
            types: types,
            type:'add'
        });

    }).catch((error) => {
        console.log("Error: ", error);
    });
});
router.get("/:userId/edit_account", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const userId = req.params.userId;
    const proDepartments = Repositories.getAllDepartments();
    const proRoles = Repositories.getAllRoles();
    const proTypes = Repositories.getAllTypes();
    const proUser = Repositories.getUser(userId);

    Promise.all([proDepartments, proRoles, proTypes,proUser]).then((data) => {
        const departments = data[0].body;
        const roles = data[1].body;
        const types = data[2].body;
        const user = data[3].body;
        res.render("admin/admin_account_add.ejs",
        {
            username:username,
            departments: departments,
            roles: roles,
            user:user,
            types: types,
            type:'edit'
        });
    }).catch((error) => {
        console.log("Error: ", error);
    });
});

//Register -- add a new account
router.post("/register",middleware.isAdmin(),function(req,res){
    const user = req.body;
    
    Repositories.register(user.dptId, user.rId, user.tId, user.username,user.password, user.firstname, user.lastname, user.email,user.phone).then(function(data) {
        if(data) {
           console.log(data);
            res.send({
                message: 'OK'
            }); 
        } else {
            console.warn("Successful post without data sent back...");
            res.send({
                erorr: 'Cannot create a new user'
            });
        }
    }).catch(function(error) {
        console.error(error);
        res.send({
            error: error.message
        });
    });
});

//Register -- add a new account
router.post("/edit_user",middleware.isAdmin(),function(req,res){
    const user = req.body;
    Repositories.updateUser(user.dptId, user.rId, user.tId, user.firstname, user.lastname, user.email,user.phone, user._id).then(function(data) {
        if(data) {
           console.log(data);
            res.send({
                message: 'OK'
            }); 
        } else {
            console.warn("Successful post without data sent back...");
            res.send({
                erorr: 'Cannot create a new user'
            });
        }
    }).catch(function(error) {
        console.error(error);
        res.send({
            error: error.message
        });
    });
});

/*--------------------------------------**/
/********** COURSE GET********************/
/*--------------------------------------**/

//course overview
router.get("/course_overview", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    
    Repositories.getAllCourses().then(function(data) {
        
        const courses = data.body;
        console.log(courses);
        res.render("admin/admin_course_overview.ejs", { courses:courses, username:username ,courseId:courseId});
        
    }).catch(function(error) {
        res.send("error");
    });
    
});

//add a course
router.get("/add_course", middleware.isAdmin(), function (req, res) {
    const username = req.payload.username;
    const allDepartments = Repositories.getAllDepartments();
    const allCourses = Repositories.getAllCourses();
    
    Promise.all([allCourses, allDepartments]).then((data) =>{
        const courses = data[0].body;
        const departments = data[1].body;
        
        res.render("admin/admin_add_course.ejs",{username: username, departments:departments,courses:courses,type:'add'});
    }).catch((error) => {
        console.log(error);
    });
});

router.get("/:courseId/add_course", middleware.isAdmin(), function (req, res) {
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const allDepartments = Repositories.getAllDepartments();

    const allCoursesReq = Repositories.getAllCourses();
    const course = Repositories.getCourse(courseId);

    Promise.all([allCoursesReq,course, allDepartments]).then((data) =>{
        const courses = data[0].body;
        const course = data[1].body;
        const departments = data[2].body;
        res.render("admin/admin_add_course.ejs",{username: username, courses:courses,departments:departments,course:course,courseId:courseId,type:'edit'});
    }).catch((error) => {
        console.log(error);
    });
});

//chapter overview in the course
router.get("/:courseId/chapters", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const allCourses = Repositories.getAllCourses();
    const allChapters = Repositories.getAllChapters(courseId);
    console.log(courseId);
    
    //没chapter的时候getAllChapters跑不出来，所以用下面代码直接显示页面用于测试
    //res.render("admin/admin_chapters_overview.ejs",{username:username,chapters:"3"});
   
    Promise.all([allCourses,allChapters]).then((data) => {
        const courses = data[0].body;
        console.log(courses);
        const chapters = data[1].body;
        
        res.render("admin/admin_chapters_overview.ejs",
        {
            username:username,
            courses:courses,
            courseId:courseId,
            chapters:chapters,
            obj:'edit_quiz'
        });

    }).catch((error) => {
        console.log("Error: ", error);
    });
});

//chapter editor page
router.get("/:courseId/edit_chapter", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const allCourses = Repositories.getAllCourses();
    const allChapters = Repositories.getAllChapters(courseId);
    const course = Repositories.getCourse(courseId);


    Promise.all([allCourses,allChapters, course]).then((data) => {
        const courses = data[0].body;
        console.log(courses);
        const chapters = data[1].body;
        const courseTitle = data[2].body.title;
        res.render("admin/admin_edit_chapter.ejs",
        {
            username:username, 
            courseId:courseId,
            courses:courses,
            courseTitle:courseTitle,
            chapters:chapters,
            type: 'add_chapter'
        });

    }).catch((error) => {
        console.log("Error: ", error);
    });
});

//chapter editor page
router.get("/:courseId/:chapterId/edit_chapter", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;

    const allChapters = Repositories.getAllChapters(courseId);
    const courseReq = Repositories.getCourse(courseId);
    const chapterReq = Repositories.getChapter(courseId, chapterId);

    Promise.all([allChapters, courseReq, chapterReq]).then((data) => {
        const chapters = data[0].body;
        const course = data[1].body;
        const chapter = data[2].body;
        const courseTitle = data[1].body.title;
        res.render("admin/admin_edit_chapter.ejs",
        {
            username:username, 
            chapters:chapters,
            course: course,
            chapter: chapter,
            courseId:courseId,
            courseTitle:courseTitle,
            type: 'edit_chapter'
        });

    }).catch((error) => {
        console.log("Error: ", error);
    });
});

//quiz editor page
router.get("/:courseId/edit_quiz", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    
    res.render("admin/admin_edit_quiz.ejs",{username:username,courseId:courseId,type:'add_quiz'});
});


router.get("/:courseId/:chapterId/edit_quiz", middleware.isAdmin(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;

    const chapterReq = Repositories.getChapter(courseId, chapterId);

    Promise.all([chapterReq]).then((data) => {
    const chapter = data[0].body;
    const contents = data[0].body.contents; 
    res.render("admin/admin_edit_quiz.ejs",
        {
            username:username,
            courseId:courseId,
            chapter:chapter,
            contents:contents,
            chapterId:chapterId,
            type:'edit_quiz'
        });
    }).catch((error) => {
        console.log("Error: ", error);
    });
});



/*--------------------------------------**/
/********** COURSE POST*******************/
/*--------------------------------------**/

// POST -- add a course
router.post("/add_course", middleware.isAdmin(), function (req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const department_id = req.body.department_id;

    Repositories.createNewCourse(title, description, req.payload.username, department_id).then(function (data) {
        
        //这里不清楚返回的data的类型，可能是data.body[0]._id,也可能要调整一下
        const URL = "/"+data.body[0]._id+"/chapters";
        res.redirect(URL);

    }).catch(function (error) {

        console.log(error);
        res.redirect("course_overview");
    });

});

router.post("/:courseId/add_course", middleware.isAdmin(), function (req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const department_id = req.body.department_id;
    const courseId = req.params.courseId;
    //console.log(title, description, department_id);

    Repositories.updateCourse (courseId, title, description, req.payload.username, department_id).then(function (data) {
        console.log(data);
        
        //这里不清楚返回的data的类型，可能是data.body[0]._id,也可能要调整一下
        const URL =  "/admin/"+courseId+"/chapters";
        res.redirect(URL);

    }).catch(function (error) {

        console.log(error);
        res.redirect("/admin/course_overview");
    });
    
});

//POST -- add a quiz
router.post("/:courseId/add_quiz", middleware.isAdmin(),function(req,res){
    const courseId = req.params.courseId;
    const title = req.body.title;
    const description = "default_description";
    const createdAuthor = "default_author";
    
    /*const contents = [
                    {
                        "position": 0,
                        "description": "What is the time complexity of merge sort?",
                        "contents": [
                            "O(n)",
                            "O(n^2)",
                            "O(nlogn)",
                            "O(2n)"
                        ],
                        "answer": 2
                    },
                    {
                        "position": 1,
                        "description": "What is the most trending programming language in 2019?",
                        "contents": [
                            "Python",
                            "c++",
                            "JavaScript",
                            "Java"
                        ],
                        "answer": 0
                    },
                    {
                        "position": 2,
                        "description": "What is the most trending programming language in 2019?",
                        "contents": [
                            "Python",
                            "c++",
                            "JavaScript",
                            "Java"
                        ],
                        "answer": 0
                    }
                ];*/
    const contents = [
                    {
                        "position": 0,
                        "description": req.body.Q1_Des,
                        "contents": [
                            req.body.Q1_A,
                            req.body.Q1_B,
                            req.body.Q1_C,
                            req.body.Q1_D
                        ],
                        "answer":parseInt(req.body.Q1_ans)
                    },
                    {
                        "position": 1,
                        "description": req.body.Q2_Des,
                        "contents": [
                            req.body.Q2_A,
                            req.body.Q2_B,
                            req.body.Q2_C,
                            req.body.Q2_D
                        ],
                        "answer": parseInt(req.body.Q2_ans)
                    },
                    {
                        "position": 2,
                        "description": req.body.Q3_Des,
                        "contents": [
                            req.body.Q3_A,
                            req.body.Q3_B,
                            req.body.Q3_C,
                            req.body.Q3_D
                        ],
                        "answer":parseInt(req.body.Q3_ans)
                    }
                ];
    //console.log(contents);
    const position = 0;
    
    Repositories.createChapterOfQuiz(courseId, title, description, createdAuthor, contents, position).then(function(data) {
        
        //console.log(data);
        //不确定JS是不是这样拼接字符串的
        const URL = "/admin/"+courseId+"/chapters";
        res.redirect(URL);
        
    }).catch(function(error) {
        
        //console.log(error);
        //不确定JS是不是这样拼接字符串的
        const URL =  "/admin/"+courseId+"/chapters";
        res.redirect(URL);
    });
});

router.post("/:courseId/edit_quiz/:chapterId", middleware.isAdmin(), async function(req,res){
    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;
    const username = req.payload.username;
    const contents = [
                    {
                        "position": 1,
                        "description": req.body.Q1_Des,
                        "contents": [
                            req.body.Q1_A,
                            req.body.Q1_B,
                            req.body.Q1_C,
                            req.body.Q1_D
                        ],
                        "answer": req.body.Q1_ans
                    },
                    {
                        "position": 2,
                        "description": req.body.Q2_Des,
                        "contents": [
                            req.body.Q2_A,
                            req.body.Q2_B,
                            req.body.Q2_C,
                            req.body.Q2_D
                        ],
                        "answer": req.body.Q2_ans
                    },
                    {
                        "position": 3,
                        "description": req.body.Q3_Des,
                        "contents": [
                            req.body.Q3_A,
                            req.body.Q3_B,
                            req.body.Q3_C,
                            req.body.Q3_D
                        ],
                        "answer": req.body.Q3_ans
                    }
                ];
    
    const description = req.body.description || "Default description for the quiz";
    const title = req.body.title || "Default Title for ....";
    const URL =  "/admin/"+courseId+"/chapters";
       
    try {
        const chapterReq = await Repositories.updateChapter(courseId, chapterId, title, description, username, contents);
        if (chapterReq) {
            //console.log("Updated Quiz: ", chapterReq);
        }
         res.redirect(URL);

    } catch (error) {
        console.log(error);
         res.redirect(URL);
    }
   
});


//POST -- add a chapter
router.post("/:courseId/add_chapter", middleware.isAdmin(),function(req,res){
    const courseId = req.params.courseId;
    //console.log(req.body);
    const description = req.body.description;
    const title = req.body.title;
    const contents = req.body.contents;
    //console.log(description, '|', title, '|', contents, '|', courseId);
    Repositories.createChapterOfContent(courseId, title, description, req.payload.username, contents).then(function(data) {
        
        //console.log(data);
        //不确定JS是不是这样拼接字符串的
        const URL = "/admin/"+courseId+"/chapters";
        res.redirect(URL);
        
    }).catch(function(error) {
        
        console.log(error);
        //不确定JS是不是这样拼接字符串的
        const URL = "/admin/"+courseId+"/chapters";
        res.redirect(URL);
    });
});

router.post("/:courseId/edit_chapter/:chapterId", middleware.isAdmin(),function(req,res){
    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;

    const description = req.body.description;
    const title = req.body.title;
    const contents = req.body.contents;
    
    Repositories.updateChapter(courseId, chapterId, title, description, req.payload.username, contents).then(function(data) {
        
        //console.log(data);
        //不确定JS是不是这样拼接字符串的
        const URL = "/admin/"+courseId+"/chapters";
        res.redirect(URL);
        
    }).catch(function(error) {
        
        //console.log(error);
        //不确定JS是不是这样拼接字符串的
        const URL = "/admin/"+courseId+"/chapters";
        res.redirect(URL);
    });
});


module.exports = router;