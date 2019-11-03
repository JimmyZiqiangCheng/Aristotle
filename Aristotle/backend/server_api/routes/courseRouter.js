// express and router
const express = require('express');
const router = express.Router();
// controller for course
const courseCtrl = require('./../controllers/courseController');
// controller for chapter
const chapterCtrl = require('./../controllers/chapterController');
// controller for Question
// const qustionCtrl = require('./../controllers/questionController');
// Joi schema for validaton
const joiSchema = require('./../middleware/validationSchema');
const validate = require('../middleware/validator');

// ---------------------------------------------------------------------------
// courses
// ---------------------------------------------------------------------------

// get all courses sorted by title
router.get('/', courseCtrl.get_all_courses);

// get a specific course by id
router.get('/:id', courseCtrl.get_course);

// create a new course
router.post('/', validate(joiSchema.schema_course),courseCtrl.create_course);

// update an existing course
router.put('/:id', validate(joiSchema.schema_course), courseCtrl.update_course);

// delete a course from database (not recommanded)
router.delete('/:id', courseCtrl.delete_course);

// ---------------------------------------------------------------------------
// chapters
// ---------------------------------------------------------------------------

// get all chapters from the targeted course sorted by position
router.get('/:courseId/chapters/', chapterCtrl.get_all_chapters);

// get a sepcific chapter from the targeted course
router.get('/:courseId/chapters/:chapterId', chapterCtrl.get_chapter);

// add a new chapter in the targeted course
router.put('/:courseId/chapters/', validate(joiSchema.schema_chapter),chapterCtrl.create_chapter);

//router.post('/:courseId/chapters', chapterCtrl.create_chapter);

// add a new quiz in the targeted course
//router.put('/:courseId/chapters/1', validate(joiSchema.schema_quiz),chapterCtrl.create_quiz);

// update an existing chapter in the targeted course
router.put('/:courseId/chapters/:chapterId', validate(joiSchema.schema_chapter_put), chapterCtrl.update_chapter);

// delete a chapter from the targeted course
router.delete('/:courseId/chapters/:chapterId', chapterCtrl.delete_chapter);

router.get('/:courseId/count', chapterCtrl.count_chapter);

// ---------------------------------------------------------------------------
// questions
// ---------------------------------------------------------------------------
// get all questions from a targeted chapter
// router.get('/:courseId/chapters/:chapterId', qustionCtrl.get_all_questions);




module.exports = router;