var express = require("express");
var router  = express.Router();
const middleware = require('./middleware');
const { StringDecoder } = require('string_decoder');
const Repositories = require('../repositories/restful-api');
const flatCache = require('flat-cache');


//get employee homepage
router.get("/", middleware.isEmployee(),async function(req,res){
    //console.log(req.payload['username'],req.payload.type);
    const username = req.payload.username;
    //const decoder = new StringDecoder('utf8');
    
    const type = req.payload.type;

    try{
        const allCourses = await Repositories.getAllCourses();
        const courses = allCourses.body;
        const current = await Repositories.getCurrent(username)
        console.log("Current Course:", current);
        const currentCourseChapter = current.body;
        const filteredCourses = await filterCourseByDepartmentId(username, courses);
        let currentCourse = courses[0]._id;
        let currentChapter = courses[0].chapters[0]._id;
        if (currentCourseChapter){
            currentCourse = currentCourseChapter.currentCourse;
            currentChapter = currentCourseChapter.currentChapter;
        }
        res.render("employee/employee_home.ejs",{username: username, type: type, courses:filteredCourses, currentCourse: currentCourse, currentChapter: currentChapter});
    }catch(error) {
        console.log("Current Course error: ", current);
        console.log(error);
    }
});  


// filter course by Department
async function filterCourseByDepartmentId(username, allCourses){
    
    const data= await Repositories.getUser(username);
    const user = data.body
    const departmentId = user.department;
    const courseList = [];
    for (course of allCourses){
        
        if (course.department._id.toString() === departmentId){
            courseList.push(course);
        }
    }
    return courseList;
}

//update course learnt when log onto home page or click on a course


//get employee course
router.get("/:courseId/chapters/:chapterId", middleware.isEmployee(), async function(req,res){
    const username = req.payload.username;
    const type = req.payload.type;

    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;
    
    try{
        let result = await Repositories.addUserCourseRecord(username, req.params.courseId);
        let result2 = await Repositories.updateCurrent(username, req.params.courseId, req.params.chapterId);
        let allCourses = await Repositories.getAllCourses();
        let currentCourse = await Repositories.getCourse(req.params.courseId);
        let chapters = await Repositories.getAllChapters(req.params.courseId);
        let currentChapter = await Repositories.getChapter(req.params.courseId, req.params.chapterId);
        let currentUser = await Repositories.getUser(username);
        let filteredCourses = await filterCourseByDepartmentId(username, allCourses.body);

        const courses = filteredCourses;
        chapters = chapters.body;
        const currentC = currentCourse.body;
        const currentCh = currentChapter.body;
        const currentU = currentUser.body;

        if (currentCh.type == 'chapterContents'){
            res.render("employee/employee_chapter.ejs",{username: username, type: type, courses:courses, chapters:chapters, currentCourse:currentC, currentChapter:currentCh});
        }
        if (currentCh.type == 'quiz'){
            const quizMark = getQuizMark(currentU.learnedCourses,courseId,chapterId);
            res.render("employee/employee_quiz.ejs",{username: username, type: type, courses:courses, chapters:chapters, currentCourse:currentC, currentChapter:currentCh,quizMark:quizMark});     
        }
    }catch(err){
        console.log(err);
    }  
});

//show quiz result
router.get("/:courseId/:chapterId/quiz_mark", middleware.isEmployee(), async function(req,res){
    try{
        let username = req.payload.username;
        let allCourses = await Repositories.getAllCourses();
        let currentCourse = await Repositories.getCourse(req.params.courseId);
        let chapters = await Repositories.getAllChapters(req.params.courseId);
        let currentChapter = await Repositories.getChapter(req.params.courseId, req.params.chapterId);
        let currentUser = await Repositories.getUser(username);
        let courseId = req.params.courseId;
        let chapterId = req.params.chapterId;
        let filteredCourses = await filterCourseByDepartmentId(username, allCourses.body);
        let passed = 0; //0--nextChapter, 1--currentChapter, 2--homepage
        let nextChapterId = -1;
        
        const courses = filteredCourses;
        chapters = chapters.body;
        const currentC = currentCourse.body;
        const currentCh = currentChapter.body;
        const currentU = currentUser.body;
        
        let quizMark = await getQuizMark(currentU.learnedCourses,courseId,chapterId);
        let latestQuizMark = await getLatestQuizMark(currentU.learnedCourses,courseId,chapterId);
        
        if (currentCh.type == 'quiz'){
            //has passed the quiz
            if(latestQuizMark==3){
                //passed the quiz and the course has next chapter
                if(getNextChapterId(chapterId,currentC.chapters)!=-1){
                    passed = 0;
                    nextChapterId = getNextChapterId(chapterId,currentC.chapters);
                }else{ // passed the quiz but the course has no more chapter
                    passed = 2;
                }
                
            }else{ //fail the quiz
                passed = 1;
            }
            res.render("employee/employee_quiz_mark.ejs",
            {
                latestQuizMark : latestQuizMark, passed : passed, nextChapterId : nextChapterId,
                username: username, courses:courses, chapters:chapters, currentCourse:currentC, currentChapter:currentCh,quizMark:quizMark
            });
        }
    }catch(error){
        console.log(error);
    }
});

//submit a quiz
router.post("/:courseId/:chapterId/submit",middleware.isEmployee(),function(req,res){
    const username = req.payload.username;
    const courseId = req.params.courseId;
    const chapterId = req.params.chapterId;
    
    const answer =[
        parseInt(req.body.answer1),
        parseInt(req.body.answer2),
        parseInt(req.body.answer3)
        ] 
    //res.send(answer);
    Repositories.addUserQuizRecord(username, courseId, chapterId, answer).then(function (data) {
    
        //jump back to current quiz and show result on right top side of the page    
        const URL = "/employee/"+courseId+"/"+chapterId+"/quiz_mark";
        res.redirect(URL);

    }).catch(function (error) {

        console.log(error);
    });
});

async function getQuizMark(learnedCourses,courseId,chapterId){
    var max = 0;
    for(var i=0;i<learnedCourses.length;i++){
        
        if(learnedCourses[i].courseId === courseId){
            
            for(var j=0;j<learnedCourses[i].quizRecords.length;j++){
                if(learnedCourses[i].quizRecords[j].quizId == chapterId){
                    console.log("quiz found");
                    if(max<learnedCourses[i].quizRecords[j].score){
                        max = learnedCourses[i].quizRecords[j].score;
                    }
                }
            }
            
        }
        
    }
    return max;
}

async function getLatestQuizMark(learnedCourses,courseId,chapterId){
    var latest = 0;
    for(var i=0;i<learnedCourses.length;i++){
        
        if(learnedCourses[i].courseId === courseId){
            
            for(var j=0;j<learnedCourses[i].quizRecords.length;j++){
                if(learnedCourses[i].quizRecords[j].quizId == chapterId){
                    console.log("quiz found");
                    latest = learnedCourses[i].quizRecords[j].score;
                }
            }   
        }      
    }
    return latest;
}

function getNextChapterId(chapterId,chapters){
    for(var i=0;i<chapters.length;i++){
        if(chapterId == chapters[i]._id){
            if(i<chapters.length-1){
                return chapters[i+1]._id;
            }
        }
    }
    return -1;
}
module.exports = router;