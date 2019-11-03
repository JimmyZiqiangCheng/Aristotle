/*jshint esversion: 8 */ 

/** 
 * @module repositories/restful-api 
 * */

const Restful = require('./request-methods');
const bcrypt = require('bcrypt');

var BACKEND_API_ENDPOINT = process.env.BACKEND_API_ENDPOINT || "http://localhost:8000";
console.log("backend connected at",BACKEND_API_ENDPOINT);
const API_ROUTES = {
    Course: "/api/courses",
    User: "/api/users",
    Department: "/api/departments",
    Type: "/api/types",
    Role: "/api/roles"
};

const PASS_SALT_ROUNDS = 5;

const userRoute =  `${BACKEND_API_ENDPOINT}${API_ROUTES.User}`;
const courseRoute = `${BACKEND_API_ENDPOINT}${API_ROUTES.Course}`;
const typeRoute = `${BACKEND_API_ENDPOINT}${API_ROUTES.Type}`;
const depratmentRoute = `${BACKEND_API_ENDPOINT}${API_ROUTES.Department}`;
const roleRoute = `${BACKEND_API_ENDPOINT}${API_ROUTES.Role}`;

//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A L L   A B O U T   C O U R S E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//



/**
 * Get all the courses
 * 
 * @returns A Promise
 */
module.exports.getAllCourses = () => {
    const uri = courseRoute;
    return Restful.get(uri);
};


/**
 * Get course with course ID
 *
 * @param {String} courseId ID of the course
 * @returns A Promise
 * @example
 * getCourse('5d9c5b6cbae0dc2a4dda48f9').then((data) => {
 *  // successfully get the course
 * }).catch((error) => {
 *  // Fail to get the course with error
 * });
 */
module.exports.getCourse = (courseId) => {
    const uri = `${courseRoute}/${courseId}`;
    return Restful.get(uri);
};

/**
 * Create a new course
 *
 * @param {String} title title of the course
 * @param {String} description description of the course
 * @param {String} createdAuthor creating author of the course
 * @param {String} departmentId department (id) assigned for the course
 * @returns A Promise
 */
module.exports.createNewCourse = (title, description, createdAuthor, departmentId) => {
    const uri = courseRoute;
    const payload = {
        title: title,
        description: description,
        createdAuthor: createdAuthor,
        department: departmentId
    };
    return Restful.post(uri, payload);
};


/**
 * Updated an existing course
 *
 * @param {String} courseId _id for the course
 * @param {*} title title of the course
 * @param {*} description description of the course
 * @param {*} createdAuthor creating author of the course
 * @param {*} departmentId department (id) assigned for the course
 * @param {*} disable disable/enable the course (true: disable, false: enable)
 * @returns A Promise
 */
module.exports.updateCourse = (courseId, title, description, createdAuthor, departmentId, disable) => {
    const uri = `${courseRoute}/${courseId}`;
    const payload = {
        title: title,
        description: description,
        createdAuthor: createdAuthor,
        department: departmentId,
        disable: disable
    };
    return Restful.put(uri, payload);
};

//
// ─── COURSE CHAPTERS ────────────────────────────────────────────────────────────
//


/**
 * Create a chapter of the course in terms of Chapter Contents
 *
 * @param {*} courseId _id of the course
 * @param {*} title title of the chapter
 * @param {*} description description of the chapter
 * @param {*} createdAuthor creating author of the chapter
 * @param {*} contents contents of the chapter (Any kind)
 * @param {*} position position of the chapter in chapter list
 * @returns A promise
 */

module.exports.getChapter = (courseId, chapterId) => {
    const uri = `${courseRoute}/${courseId}/chapters/${chapterId}`;
    return Restful.get(uri);
};

module.exports.getAllChapters = (courseId) => {
    const uri = `${courseRoute}/${courseId}/chapters`;
    return Restful.get(uri);
};

module.exports.createChapterOfContent = (courseId, title, description, createdAuthor, contents) => {
    const uri = `${courseRoute}/${courseId}/chapters`;
    const payload = createChapterPayload('chapterContents', title, description, createdAuthor, contents);
    return Restful.put(uri, payload);
};

/**
 * Create a chapter of the course in terms of Quiz
 *
 * @param {*} courseId _id of the course
 * @param {*} title title of the chapter
 * @param {*} description description of the chaper
 * @param {*} createdAuthor creating author of the cahpter
 * @param {*} contents contents (quiz) of the chapter (Any kind)
 * @param {*} position position of the chapter in chapter list
 * @returns A Promise
 */
module.exports.createChapterOfQuiz = (courseId, title, description, createdAuthor, contents) => {
    const uri = `${courseRoute}/${courseId}/chapters`;
    const payload = createChapterPayload('quiz', title, description, createdAuthor, contents);
    return Restful.put(uri, payload);
};

module.exports.updateChapter = (courseId, chapterId, title, description, createdAuthor, contents) => {
    const uri = `${courseRoute}/${courseId}/chapters/${chapterId}`;
    const payload = {
        title: title,
        description: description,
        createdAuthor: createdAuthor,
        contents: contents
    };

    return Restful.put(uri, payload);
};

function createChapterPayload(type, title, description, createdAuthor, contents, disable, position) {
    const payload = {
        title: title,
        description: description,
        createdAuthor: createdAuthor,
        contents: contents,
        type: type
    };
    if (disable) {
        payload.disable = disable;
    }
    if (position && (position instanceof Number)) {
        payload.position = position;
    }
    return payload;
}

//
// ────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: A L L   A B O U T   U S E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//
module.exports.getAllUsers = () => {
    const uri = userRoute;
    return Restful.get(uri);
};

module.exports.getUser = (userId) => {
 const uri = `${userRoute}/${userId}`;
 return Restful.get(uri);
};

module.exports.authenticateUser = (username) => {
    const uri = `${userRoute}/authenticate`;
    let payload = {
        id: username
    };
    return Restful.post(uri, payload);
};

// update user course record when user click on a course
module.exports.addUserCourseRecord = (userId, courseId) =>{
    const uri = `${userRoute}/${userId}/courseRecord`;
    let payload = {
        courseId: courseId
    };
    return Restful.put(uri, payload);
}

// update the user's current chapter when user click on a certain chapter or quiz
module.exports.updateCurrent = (userId, courseId, chapterId) =>{
    const uri = `${userRoute}/${userId}/updateCurrent`;
    let payload = {
        courseId: courseId,
        chapterId: chapterId
    };
    return Restful.put(uri, payload);
}

// get the current course and chapter combo {currentCourse, currentChapter}
module.exports.getCurrent = (userId) =>{
    const uri = `${userRoute}/${userId}/getCurrent`;
    return Restful.get(uri);
}

// update user quizRecord when user have completed a quiz
// answer is a list of numbers [0,1,3,2] = [a,b,d,c]
module.exports.addUserQuizRecord = (userId, courseId, chapterId, answer) =>{
    const uri = `${userRoute}/${userId}/courseRecord/${courseId}/addQuiz`;
    let payload = {
        chapterId: chapterId,
        answer: answer
    };
    return Restful.put(uri, payload);
}

// get user progress by userId and courseId
module.exports.getUserProgressByCourseId = (userId, courseId) =>{
    const uri = `${userRoute}/${userId}/courseRecord/${courseId}`;
    return Restful.get(uri);
}

/**
 * Authenticate the user account with username and password
 * This function will request password from backend and compare it with
 * the inputted username and password
 *
 * @param {string} username user's username
 * @param {string} password user's password
 * @returns {Promise} A Promsie
 * @example
 * authenticate(user001, password001).then().catch()
 * [then() is successed, catch() otherwise]
 * if authenticated:
 * return: {
 *  username: user001,
 *  type: Employee
 * }
 * 
 * if not authenticated:
 * return: {
 *  message: 'Incorrect Username or Password'
 * }
 * or an error
 */
module.exports.authenticate = async (username, password) => {
    const uri = `${userRoute}/authenticate`;
    let payload = {
        id: username
    };
    return new Promise((resolve, reject) => {
        Restful.post(uri, payload).then((data) => {
            if (data.body) {
                const passFromApi = data.body.password;
                const type = data.body.type;
                // compare password
                bcrypt.compare(password, passFromApi, (err, isValid) => {
                    if (err) {
                        reject(err);
                    }
                    if (isValid === true) {
                        resolve({
                            username: username,
                            type: type.title
                        });
                    } else {
                        reject({
                            message: 'Incorrect Username or Password'
                        });
                    }
                });
            } else {
                reject({
                    message: 'Incorrect Username or Password'
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
};


/**
 * To register a new user.
 * @param {string} dptId Department's Id (MongoDB ObjectId)
 * @param {string} rId Role's Id (MongoDB ObjectId)
 * @param {string} tId Type's Id (Mongo
 * @param {string} username Login's username
 * @param {string} password Login's password
 * @param {string} firstname User's firstname
 * @param {string} lastname User's lastname
 * @param {string} email User's email
 * @param {string} phone User's phone
 * @return {Object} A Promise
 * @example
 * Succeeded:
 *  {
 *      message: "OK"
 *  }
 * //Failed:
 *  {
 *      message: "NO"
 *  }
 * Error:
 */
module.exports.register = async (dptId, rId, tId, username, password, firstname, lastname, email, phone) => {
    const uri = userRoute;
    return new Promise(async (resolve, reject) =>{
        await bcrypt.hash(password, PASS_SALT_ROUNDS, function (err, hashPass) {
            if(err){
                reject(err);
            }
            console.log(hashPass);
            let payload = {
                id: username,
                password: hashPass,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                department: dptId,
                type: tId,
                role: rId
            };
            Restful.post(uri, payload).then(data => resolve(data)).catch(err => reject(err));
        });
    });
};

module.exports.updateUser = async (dptId, rId, tId, firstname, lastname, email, phone, _id) => {
    const uri = `${userRoute}/${_id}`;
    let payload = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                department: dptId,
                type: tId,
                role: rId
            };
    Restful.put(uri, payload).then(data => resolve(data)).catch(err => reject(err));
};

//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: A L L   A B O U T   R O L E S   -   D E P A R T M E N T S   -   U S E R   T Y P E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//


/**
 * Get all Roles
 *
 * @param {string} type the type of the user (Optional)
 * @returns {Promise} A Promise Object
 * @example
 * getAllRoles("Employee").then().catch()
 * 
 * // output:
 * {
 *  message: "OK",
 *  roles: [
 *      {
 *          _id: "5d8d9fe65e14d62f70640rwe",
 *          title: "Designer"
 *      },
 *      {
 *          _id: "5d8d9fd45e14d62f70640eeb",
 *           title: "Developer",
 *      }
 *  ]
 * }
 */
module.exports.getAllRoles = (type) => {
    const uri = roleRoute;
    if(type) {
        return Restful.get(uri, {
            type: type
        });
    } else {
        return Restful.get(uri);
    }
};


/**
 * Get all User Types
 *
 * @param {string} type the type of the user (Optional)
 * @returns {Promise} A Promise Object
 * @example
 * getAllTypes("Employee").then().catch()
 * 
 * //output:
 * {
 *  message: "OK",
 *  roles: [
 *      {
 *          _id: "5d8d9fe65124d62f70640rwe",
 *          title: "Employee"
 *      },
 *      {
 *          _id: "5d8d9fd4109d4d62f70640eeb",
 *           title: "Administrator",
 *      }
 *  ]
 * }
 */
module.exports.getAllTypes = (type) => {
    const uri = typeRoute;
    if(type) {
        return Restful.get(uri, {
            type: type
        });
    } else {
        return Restful.get(uri);
    }
};


/**
 * Get all deparments
 *
 * @param {string} type the type of the user (Optional)
 * @returns {Promise} A Promise Object
 * @example
 * getAllDepartments("Employee").then().catch()
 * 
 * //output:
 * {
 *  message: "OK",
 *  roles: [
 *      {
 *          _id: "148d9fe6510292f70640rwe",
 *          title: "Human Resources"
 *      },
 *      {
 *          _id: "910f9fd45e14d62f70640eeb",
 *           title: "IT",
 *      }
 *  ]
 * }
 */
module.exports.getAllDepartments = (type) => {
    const uri = depratmentRoute;
    if(type) {
        return Restful.get(uri, {
            type: type
        });
    } else {
        return Restful.get(uri);
    }
};


/**
 * Create a new department
 *
 * @param {string} title department's name/title
 * @returns A Promise
 * @example //output
 * {
 *   message: 'Added',
 *   createDpt: {
 *    _id: '5d9468bc6c5b9b5af915f3c4',
 *     title: 'Community',
 *     createdAt: '2019-10-02T09:07:08.525Z',
 *     updatedAt: '2019-10-02T09:07:08.525Z',
 *     __v: 0
 *   }
 * }
 */
module.exports.createDepartment = (title) => {
    const uri = `${BACKEND_API_ENDPOINT}/api/department`;
    return Restful.post(uri, {
        title: title
    });
};

/**
 * Create a new role
 *
 * @param {string} title role's name/title
 * @returns A Promise
 */
module.exports.createRole = (title) => {
    const uri = `${BACKEND_API_ENDPOINT}/api/role`;
    return Restful.post(uri, {
        title: title
    });
};

/**
 * Create a new type
 *
 * @param {string} title type's name/title
 * @returns A Promise
 */
module.exports.createType = (title) => {
    const uri = `${BACKEND_API_ENDPOINT}/api/type`;
    return Restful.post(uri, {
        title: title
    });
};