const Repositories = require('./repositories/restful-api');

//Repositories.getAllCourses().then(data => console.log(data)).catch(err => console.log(err));


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

Repositories.register("5d8da0b65e14d62f70640ef2", "5d8d9fec5e14d62f70640eed", "5d8d9c673161702d61714f11", "tonnyrobin", "password123!", "Tonny", "Robin", "tonny@robin.me", "+107891231123").then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(error);
});