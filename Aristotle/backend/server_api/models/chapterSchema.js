const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chapterSchema = new Schema ({
    position: Number,
    title: { type: String, required: true, index: true},
    description: { type: String, required: true, index: true },
    contents: { type: Schema.Types.Mixed },
    createdAuthor: { type: String, required: true }, //change this to ObjectId later
    note: String,
    type: {
        type: String,
        enum: ['chapterContents', 'quiz'],
        default: 'chapterContents'
    },
    disable: {type: Boolean, default: false} }, {
    timestamps: true });
module.exports = chapterSchema;