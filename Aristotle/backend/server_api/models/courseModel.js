const assert = require('assert');
const mongoose = require('mongoose');
const chapterSchema = require('./chapterSchema');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title: { 
        type: String,
        required: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        index: true
    },
    chapters: [chapterSchema],
    createdAuthor: String, // change this to objectId of User later
    department: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Department'
    },
    disable: {type: Boolean, default: false} 
}, {
    timestamps: true
});

// Pre Save for checking title
courseSchema.pre('save', function(next) {
    return new Promise((resolve, reject) => {
        Course.findOne({title: this.title}, (err, course) => {
            if(err) {
                reject(err);
            }
            if (course) {
                reject(new Error("title has been exited"));
            } else {
                resolve(next);
            }
        });
    });
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
