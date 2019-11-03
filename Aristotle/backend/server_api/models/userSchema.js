const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        index: true
    },
    firstname: String,
    lastname: String,
    password: String,
    email: {
        type: String,
        required: true,
        index: true
    },
    phone: String,
    dob: Date,
    gender: Boolean,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }, 
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    },
    birthDate: Date,
    createdAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    learnedCourses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            },
            quizRecords: [
                {
                    quizId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Chapter'
                    },
                    score: Number
                }
            ],
        }
    ],
    
    currentCourse:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    },
    
    currentChapter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter' 
    },
    
    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var User = mongoose.model("User", userSchema);
// Pre Save for checking title
userSchema.pre('save', function (next) {
    return new Promise((resolve, reject) => {
        User.findOne({
            $or: [{
                email: this.email
            }, {
                id: this.id
            }]
        }, (err, user) => {
            if (err) {
                reject(err);
            }
            if (user) {
                reject(new Error("id or email has been exited"));
            } else {
                resolve(next);
            }
        });
    });
});

module.exports = User;