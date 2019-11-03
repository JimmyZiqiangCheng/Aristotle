const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const questionContent = new Schema({
    position: { 
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    questions: [],
    answer: {
        type: String,
        required: true
    }
});
const question = new Schema({
    type: {
        type: Number,
        required:true,
        default: 1,
        enum: {Single:1, Multiple:2}
    },
    contents: [questionContent],
    createdAuthor: {
        type: String,
        required: true
    }, //change this to ObjectId later
    note: String,
    disable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
module.exports = new mongoose.model("Question", question);