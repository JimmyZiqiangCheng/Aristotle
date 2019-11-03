const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCourseRecordSchema = new Schema ({
    id: Number,
    courses: String,
    user: String,
    quizRecords: [{type: mongoose.Schema.Types.ObjectId, ref: 'QuizRecord'}]
}, {
    timestamps: true 
});

module.exports = mongoose.model("UserCourseRecord",userCourseRecordSchema);;