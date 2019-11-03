const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizRecordSchema = new Schema ({
    chapter: Number,
    //times: Number,
    score: Number
}, {
    timestamps: true 
});

module.exports = mongoose.model("QuizRecord",quizRecordSchema);;