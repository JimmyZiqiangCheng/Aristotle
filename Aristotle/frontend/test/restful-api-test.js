const Repositories = require('./../repositories/restful-api');

//Repositories.getAllCourses().then(data => console.log(data)).catch(err => console.log(err));

// Repositories.createNewCourse("java Setup","testtesttestJavaSetu3p","Zuny3i","5d959ebe12ae4f13227f9251").then(function (data) {
//     console.log(data);
// }).catch(function (error) {
//     console.log(error);
// });

// Repositories.createNewCourse({
//     title: "Setup a working environment at the office machine.",
//     description: "Help everyone onboard as soon as possible.",
//     createdAuthor: "Simple Guy"
// }).then(result => console.log(result)).catch(err => console.log(err));


// Repositories.updateCourse('5d833517e9bc463d6ab0f5fa', {
//     title: 'Setup a working environment at the office machine. Updated Version',
//     description: "Help everyone onboard as soon as possible. And Much more than that",
//     disable: false
// }).then(result => console.log(result)).catch(err => console.log(err));

//Repositories.getCourse('5d833517e9bc463d6ab0f5fa').then(result => console.log(result)).catch(err => console.log(err));


// Repositories.register("5daba0473b8cb903dfe795d0", "5daba4e8b102660558f388a8", "5daba86d80cbe60588d86ed0", "jimmy", "abcd1234", "Jimmy", "Cheng", "jc@126.com", "+044444444").then(data => console.log(data)).catch(err => console.log(err));
// Repositories.addUserQuizRecord ("johndoe", "5daba8ad80cbe60588d86ed2", "5dacffa8955bca0489f29f66",  [2,0]).then(data=>{
//     console.log(data)
// }).catch(err =>  console.log(err));

//Repositories.getAllRoles("Employee").then(data => console.log(data)).catch(err => console.log(err));

//Repositories.authenticate("tonnyrobin", "password123!").then(data => console.log(data)).catch(err => console.log(err));
//Repositories.createDepartment("Community").then(data => console.log(data)).catch(err => console.log(err));

// get all courses
/*
Repositories.getAllCourses().then((data) => {
    if(data.body) {
        data.body.forEach(course => {
            console.log(course);
        });
    }
}).catch(error => console.log(error));

*/
// get a course with course id
/*
Repositories.getCourse('5d9c5b6cbae0dc2a4dda48f9').then((data) => {
    console.log(data.body);
}).catch(error => console.log(error));
*/

// create a new course
/*
Repositories.createNewCourse('Fullstack with NodeJs', 'A full courses to become a fullstack web developer with nodejs', 'IT Lead', '5d9c5b5abae0dc2a4dda48f8').then(data => console.log(data)).catch(error => console.log(error));
*/

// create a chapter of contents
// Repositories.createChapterOfContent('5d9c6641ad8cc03f277727ba', 'Chapter 2: Data Types', 'Data Types in Scala Programming', 'Developer A', 'These are plenty of data types for Scala').then((data) => console.log(data)).catch(err => console.log(err));

// create a chapter of quiz
/*
Repositories.createChapterOfQuiz('5d9c6641ad8cc03f277727ba', 'Quiz of Chapter 1', 'All questions will cover the material in chapter 1 of the course', 'Developer A', [
    {
        description: 'Which platform does Scale support?',
        contents: ['MacOS', 'Window', '*nix', 'Any Platform'],
        answer: 3
    }, {
        description: 'Can Scale run in JVM?',
        contents: ['Yes', 'No'],
        answer: 0
    }
]).then(data => console.log(data)).catch(err => console.log(err));
*/

Repositories.register("5db59dd4366a5424e0003d77", "5db59dd4366a5424e0003d7b", "5db59dd4366a5424e0003d7e", "admin", "12345", "Zunyi", "Liu", "tonny@robin.com", "+107891231123").then(data => console.log(data)).catch(err => console.log(err));
Repositories.register("5db59dd4366a5424e0003d77", "5db59dd4366a5424e0003d7c", "5db59dd4366a5424e0003d7f", "manager", "12345", "Zitong", "Lu", "tonny@robin.com", "+107891231123").then(data => console.log(data)).catch(err => console.log(err));
