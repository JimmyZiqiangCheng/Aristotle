const assert = require('assert');
const User = require('../models/userSchema');
const mongoose = require('mongoose');

exports.authenticate = async (req, res) => {
    try {
        const userFound = await User.findOne({
            id: req.body.id
        }, {
            password: 1, _id: 0
        }).populate('type', {title: 1, _id: 0});
        if(userFound) {
            res.status(200).json({
                message: "OK",
                body: userFound
            });
        } else {
            res.status(200).json({
                message: "NO"
            });
        }
    } catch (err) {
        res.status(404).json({
            message: "No user found under this id... "
        });
    }
};

// post a new user
exports.create_user = async (req, res) => {
    const newUser = new User(req.body);
    try {
        const userAdded = await newUser.save();
        res.status(200).json({
            message: "OK",
            body:userAdded
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
        //res.status(500).json({message: err.message});
    }
};

// get all users
exports.get_all_users = async (req, res) => {
    // query all users
    const users = await User
        .find({})
        .populate('type', {_id: 1, title: 1})
        .populate('role', {_id: 1, title: 1})
        .populate('department', {_id: 1, title: 1})
        .select('-__v') //exclude the only version __v
        .sort({
            title: 1
        });
    res.status(200).json({
        message: "All users ...",
        body:users
    });
};

// get one user by id
exports.get_user = async (req, res) => {
    const searchData = req.params.id;
    try {
        var isValid = mongoose.Types.ObjectId.isValid(searchData);
        let userFound;
        if(isValid) {
            userFound = await User.findOne({_id: searchData});
        } else {
            userFound = await User.findOne({$or:[{id: searchData},{email:searchData}]});
        }
        res.status(200).json({
            message: "OK",
            body:userFound
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};
// update an existing user
exports.update_user = async (req, res) => {
    try {
        const userUpdated = await User.updateOne({
            _id: req.params.id
        }, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                department: req.body.department,
                role: req.body.role,
                type: req.body.type,
            }
        });
        res.status(200).json({
            message: "User updated ...",
            body:userUpdated
        });
    } catch(error) {
        res.status(404).json({
            message: "No user found under this id, fail to update... "
        });
    }
};

exports.submit_answer = async (req, res) => {

    var answer = new String;
    try {
        const courseFound = await Course.findById(req.params.courseId);
        try {
            const chapterToFind = courseFound.chapters.find(chapter._id.equals(req.params.chapterId));
            answer = chapterToFind.quizQuestions.answer;
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }

    try {
        const userFound = await User.findById(req.params.userId);
        try {
            const courseFound = await userFound.learnedCourses.find({
                _id: req.params.courseId
            });
            var realAnsArray = answer.split(",");
            var userAnsArray = (req.params.answer).split(",");
            var thisTimeScore = 0;
            for (let index = 0; index < realAnsArray.length; index++) {
                if (realAnsArray[index].equals(userAnsArray[index])) {
                    thisTimeScore++;
                }

            }
            const courseUpdated = await courseFound.learnedCourses.updateOne({
                _id: req.params.courseId
            }, {
                $push: {
                    "quizRecordSchema": {
                        chapter: req.params.courseId,
                        //times: Number,
                        score: thisTimeScore
                    }
                }
            });
            res.status(200).json({
                message: "Course updated ...",
                body:courseUpdated
            });
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }


}

exports.assign_course = async (req, res) => {

    var responseArray = new Array();
    for (let index = 0; index < (req.body.userId).length; index++) {
        const element = (req.body.userId)[index];
        try {
            const userNeedToBeAssigned = await User.findById(element);
            responseArray.push(userNeedToBeAssigned);
            (userNeedToBeAssigned.learnedCourses).push(req.params.courseId);
        } catch (err) {
            res.status(404).json({
                message: "No user found under this id, fail to assign courses... "
            }, element);
        }
    }
    res.status(200).json({
        message: "User assigned ...",
        body:responseArray
    });

};


// delete a user
exports.delete_user = async (req, res) => {
    try {
        const userRemoved = await User.remove({
            _id: req.params.id
        });
        res.status(200).json({
            message: "User deleted ...",
            body:userRemoved
        });
    } catch (err) {
        res.status(404).json({
            message: "No user found under this id, fail to delete... "
        });
    }
};

