// express and router
var express = require('express');
var router = express.Router();
// controller for course
var userCtrl = require('./../controllers/userController');
// controller for user record
var userRecordCtrl = require('./../controllers/userRecordController');
// Joi schema for validaton
const joiSchema = require('./../middleware/validationSchema');
const validate = require('../middleware/validator');
const roleCtrl = require('../controllers/roleControllers');
const userTypeCtrl = require('../controllers/userTypeController');
const departmentCtrl = require('../controllers/departmentController');

//const roleCtrl = require('./../controllers/roleControllers');

router.post('/authenticate', validate(joiSchema.authenticate),userCtrl.authenticate);

// get all users sorted by title
router.get('/', userCtrl.get_all_users);

// get a specific user by id
router.get('/:id', userCtrl.get_user);

// create a new user
router.post('/', validate(joiSchema.user_schema_post),userCtrl.create_user);

// update an existing user
router.put('/:id', validate(joiSchema.user_schema_put), userCtrl.update_user);

// delete a user from database (not recommanded)
router.delete('/:id', userCtrl.delete_user);

router.post('/assign_course', userCtrl.assign_course);

router.post('/submitAnswer', userCtrl.submit_answer);

// add course record (courseID)
router.put('/:userId/courseRecord', userRecordCtrl.add_courseRecord);

// update currentChapter by update existing course record
router.put('/:userId/updateCurrent', userRecordCtrl.update_current);

// get current course and chapter for a user
router.get('/:userId/getCurrent', userRecordCtrl.get_current);

// add quiz record by update existing course record
router.put('/:userId/courseRecord/:courseId/addQuiz', userRecordCtrl.add_quizRecord);

// get user Progress
router.get('/:userId/courseRecord/:courseId/', userRecordCtrl.get_record);

// delete a course record
router.delete('/:userId/courseRecord/:learnedCourseId', userRecordCtrl.delete_learnedCourses);

// calculate score
// router.get('/:')


/**
 *  Role Models
 */
//router.post('/role', validate(joiSchema.create_role), roleCtrl.create_role);
//router.get('/roles', roleCtrl.get_all_roles);
module.exports = router;