var express = require("express");
var router  = express.Router();
const middleware = require('./middleware');
const Repositories = require('../repositories/restful-api');

router.get("/", middleware.isManager(), function(req,res){
    const username = req.payload.username;
    const allDepartments = Repositories.getAllDepartments();
    const allCourses = Repositories.getAllCourses();

    Promise.all([allCourses, allDepartments]).then((data) =>{
        const courses = data[0].body;
        const departments = data[1].body;

        res.render("manager/manager_homepage.ejs",{username: username, departments:departments,courses:courses});
    }).catch((error) => {
        console.log(error);
    });
});

router.get("/department/:departmentId", middleware.isManager(), async function(req,res){
    const username = req.payload.username;
    try{
        const allDepartments = await Repositories.getAllDepartments();
        const allCourses = await Repositories.getAllCourses();
        const allUsers = await Repositories.getAllUsers();
        const courses = allCourses.body;
        const departments = allDepartments.body;
        const users = allUsers.body;
        const filteredUsers = await filterUserByDepartment(users, req.params.departmentId);
        const progressList = await getProgressByDepartment(filteredUsers, courses, req.params.departmentId);
        
        res.render("manager/manager_department.ejs",{username: username, users:filteredUsers, departments:departments, courses:courses, record: progressList});
    }catch(error) {
        console.log(error);
    }
});

router.get("/course/:courseId", middleware.isManager(), async function(req,res){
    const username = req.payload.username;

    //not written yet
    //const roles = Repositories.getByCourse(req.params.departmentId);

    try {
        const allDepartments = await Repositories.getAllDepartments();
        const allCourses = await Repositories.getAllCourses();
        const allUsers = await Repositories.getAllUsers();

        const courses = allCourses.body;
        const departments = allDepartments.body;
        const users = allUsers.body;
        const filteredUsers = await filterUserByCourse(users, courses, req.params.courseId);
        const progressList = await getProgressesByUserId(filteredUsers, req.params.courseId);
        // record is a list of progressList for all users under this course
        res.render("manager/manager_courseOverview.ejs",{username: username, users:filteredUsers, departments:departments, courses:courses, record: progressList});
    } catch(error) {
        console.log(error);
    }
});

async function getProgressByDepartment(allUsers, courses, departmentId){
    var courseIdList = getCourseIdByDepartmentId(courses, departmentId);
    var progressList = [];
    
    for (courseId of courseIdList){
        
        var progressSubList = await getProgressesByUserId(allUsers, courseId);
        progressList = progressList.concat(progressSubList);
    }  
    return progressList;
}

function getCourseIdByDepartmentId(courses, departmentId){
    var courseIdList = [];
    for (var course of courses) {
        if (course.department._id.toString() === departmentId){
            courseIdList.push(course._id.toString());
        }
    }
    
    return courseIdList;
}

async function getProgressesByUserId(allUsers, courseId) {
    var progressList = [];
    for (var user of allUsers) {
        try{
            if (user.learnedCourses.length > 0){
                var iOfCourseRecord = 0;
                for (var i = 0; i<user.learnedCourses.length; i++){
                    if (user.learnedCourses[i].courseId.toString() === courseId){
                        iOfCourseRecord = i;
                        break;
                    }
                }
                    if (user.learnedCourses[iOfCourseRecord].quizRecords.length > 0) {
                    const progress = await Repositories.getUserProgressByCourseId(user._id, courseId);
                    const progressRecord = {
                        "userId": user._id,
                        "progressRecord": progress.body
                        }
                        progressList.push(progressRecord);
                    } else {
                        const progressRecord = {
                        "userId": user._id,
                        "progressRecord": null
                    }
                        progressList.push(progressRecord);
                    }
            } else {
                
                const progressRecord = {
                    "userId": user._id,
                    "progressRecord": null
                }
                progressList.push(progressRecord);
            }
        } catch(err){
            console.log(err);
        }
    }
    return progressList;
}

function filterUserByDepartment(allUsers, departmentId){
    var selectedUsers = [];
    for (var user of allUsers){
        if (user.department._id.toString() === departmentId){
            if (user.type.title === "Employee"){
                selectedUsers.push(user);
            }
        }
    }
    return selectedUsers;
}

function filterUserByCourse(allUsers, courses, courseId){
    var selectedCourse;
    for (var course of courses){
        if (course._id.toString() === courseId){
            selectedCourse = course;
        }
    }
    const departmentId = selectedCourse.department._id.toString();
    var selectedUsers = [];
    for (var user of allUsers){
        if (user.department._id.toString() === departmentId){
            selectedUsers.push(user);
        }
    }
    return selectedUsers;
}

module.exports = router;
