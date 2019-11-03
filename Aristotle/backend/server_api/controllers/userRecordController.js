const User = require('./../models/userSchema');
const Course = require('./../models/courseModel');
const mongoose = require('mongoose');

// user progress related functions
// update an existing user
exports.add_courseRecord = async (req, res) => {
    try {
        const userId = req.params.userId;
        const courseId = req.body.courseId;

        if (await isCourseInUserLearnedList(userId, courseId) == false) {
            const userUpdated = await User.updateOne({
                id: userId
            }, {
                $push: {
                    learnedCourses: {
                        "courseId": mongoose.Types.ObjectId(req.body.courseId)
                    }
                }
            });
            res.status(200).json({
                message: "course record added ...",
                body: userUpdated
            });
        } else {
            res.status(200).json({
                message: "course record is existed"
            });
        }
    } catch (error) {
        res.status(404).json({
            message: "No user found under this id, fail to update... "
        });
    }
};

// find whether a courseId has been in a user learned courses list
async function isCourseInUserLearnedList(userId, courseId) {
    try {
        // count the number of user when 'id == userId'
        // and 'any courseId in learnedCourses array is equal to courseId'
        const counter = await User.count({
            id: userId,
            learnedCourses: {
                $elemMatch: {
                    courseId: {
                        $eq: mongoose.Types.ObjectId(courseId)
                    }
                }
            }
        });
        // counter > 0 => existed
        if (counter > 0) {
            return true;
        }
        // otherwise => not existed
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.checkChapter = async function isChapterInUserLearnedList(userId, courseId, chapterId) {
    try {
        // count the number of user when 'id == userId'
        // and 'any courseId in learnedCourses array is equal to courseId'
        const counter = await User.count({
            id: userId,
            learnedCourses: {
                $elemMatch: {
                    courseId: {
                        $eq: mongoose.Types.ObjectId(courseId)
                    }
                },
                    $elemMatch: {
                        'quizRecords.quizId': {
                            $eq: mongoose.Types.ObjectId(chapterId)
                        }
                    }
            }
        });
        // counter > 0 => existed
        if (counter > 0) {
            return true;
        }
        // otherwise => not existed
        return false;
    } catch (error) {
        console.log(error);
        return Promise.reject(new Error(error.message));
    }
};

exports.update_current = async (req, res) => {
    try {
        const result = await User.updateOne({id: req.params.userId,}, {
            $set: {
                "currentCourse": mongoose.Types.ObjectId(req.body.courseId),
                "currentChapter": mongoose.Types.ObjectId(req.body.chapterId)
            }
        });
        if (!result) {
            return res.status(404).json({
                message: "learnedCourse not found..."
            });
        }
        res.status(200).json({
            message: "current chapter updated ...",
            body: result
        });
    } catch (error) {
        res.status(500).json({
            message: "No user or course found under such userId courseId combo, fail to update... "
        });
    }
}

// find whether a quizId exist
// async function isQuizInUserLearnedList(userId, courseId) {
//     try {
//         // count the number of user when 'id == userId'
//         // and 'any courseId in learnedCourses array is equal to courseId'
//         const counter = await User.count({
//             id: userId,
//             learnedCourses: {
//                 $elemMatch: {
//                     courseId: {
//                         $eq: mongoose.Types.ObjectId(courseId)
//                     },
//                     "quizRecords.quizId": mongoose.Types.ObjectId(req.body.chapterId)
//                 }
//             }
//         });
//         // counter > 0 => existed
//         if (counter > 0) {
//             return true;
//         }
//         // otherwise => not existed
//         return false;
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };

exports.add_quizRecord = async (req, res) => {
    // calculate score for the quiz
    let scoreTotal = 0
    try {
        const courseFound = await Course.findById(req.params.courseId);
        const chapterFound = courseFound.chapters.find(chapter => {
            return chapter._id.equals(req.body.chapterId);
        });
        for (let i = 0; i < chapterFound.contents.length; i++) {
            if (chapterFound.contents[i].answer === req.body.answer[i]) {
                scoreTotal += 1;
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
    // check if quiz already exists, if so update score if higher, if not push
    try {
        const result = await User.updateOne({
            id: req.params.userId,
            learnedCourses: {
                $elemMatch: {
                    "courseId": mongoose.Types.ObjectId(req.params.courseId),
                    // "quizRecords.quizId": {$ne: mongoose.Types.ObjectId(req.body.chapterId)}
                }
            },
        }, {
            $set: {
                "learnedCourses.$.quizRecords": {
                    "quizId": mongoose.Types.ObjectId(req.body.chapterId),
                    "score": scoreTotal
                }
            }
        });

        if (!result) {
            return res.status(404).json({
                message: "learnedCourse not found..."
            });
        }
        res.status(200).json({
            message: "quiz record added ...",
            body: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete_learnedCourses = async (req, res) => {
    try {
        const result = await User.updateOne({
            _id: req.params.userId
        }, {
            $pull: {
                learnedCourses: {
                    _id: req.params.learnedCourseId
                }
            }
        });
        if (!result) {
            return res.status(404).json({
                message: "user not found..."
            });
        }
        res.status(200).json({
            message: "learned course deleted ...",
            body: result
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
}

exports.get_current= async (req, res) => {
    try{
        const userFound = await User.find({id: req.params.userId});
        const currentCourse = userFound[0].currentCourse;
        const currentChapter = userFound[0].currentChapter;
        const current = {
            currentCourse:currentCourse,
            currentChapter:currentChapter
        }
        
        res.status(200).json({message: "currentCourseChapter found...", body: current}); 
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.get_record = async (req, res) => {
    try {
        const userFound = await User.findById(req.params.userId);
        const courseRecordFound = userFound.learnedCourses.find(learnedCourse => {
            return learnedCourse.courseId.equals(req.params.courseId);
        });

        const courseFound = await Course.findById(req.params.courseId);
        const progress = courseRecordFound.quizRecords.length * 2 / courseFound.chapters.length;
        const quizRecordsList = courseRecordFound.quizRecords;
        let scoreSum = 0;

        for (quiz of quizRecordsList) {
            scoreSum += quiz.score;
        }
        const scoreAverage = scoreSum / quizRecordsList.length;

        const record = {
            progress: progress,
            score: scoreAverage
        }
        res.status(200).json({
            message: "record found ...",
            body: record
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
}
