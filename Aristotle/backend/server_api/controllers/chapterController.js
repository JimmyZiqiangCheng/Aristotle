const Course = require('./../models/courseModel');
const mongoose = require('mongoose');
// add a new chapter
exports.create_chapter = async (req, res) => {
    // create a new chapter  
    try{
        // find the size of chapters
        await countChapterInCourse(req.params.courseId).then(async (chapters) => {
            // size of current chapters of the course
            let index = 0
            if (chapters) {
                index = chapters.count;
            }
            // push a new chapter to the chapter list
            const courseUpdated = await Course.updateOne({_id: req.params.courseId},{
                $push: {
                    "chapters":{
                        position: index,
                        title: req.body.title,
                        description: req.body.description,
                        createdAuthor: req.body.createdAuthor,
                        contents: req.body.contents,
                        note: req.body.note,
                        type: req.body.type,
                        disable: req.body.disable
                    }
                }
            });
            res.status(200).json({message: "Course updated ...", body: courseUpdated});
        }).catch((err) => {
            res.status(500).json({message: err.message});
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

async function countChapterInCourse(courseId) {
    return await Course.aggregate([{
        $match: {
            _id: mongoose.Types.ObjectId(courseId)
        }
    },
    {
        $project: {
            count: {
                $size: "$chapters"
            }
        }
    }
    ]);
};

exports.count_chapter = async (req, res) => {
    await countChapterInCourse(req.params.courseId).then(
        (chapters) => {
            console.log(chapters)
            res.status(200).json({
                message: 'OK',
                body: chapters[0].count
            });
        }
    ).catch((err) => {
        res.status(500).json({
            message: err.message
        });
    });
};

exports.create_quiz = async (req, res) => {
    // create a new quiz
    try{ 
        const courseFound = await Course.findById(req.params.courseId);
        const index = courseFound.chapters.length;
        const courseUpdated = await Course.updateOne({_id: req.params.courseId},{
            $push: {
                "chapters":{
                    position: index,
                    title: req.body.title,
                    description: req.body.description,
                    createdAuthor: req.body.createdAuthor,
                    contents: [{
                        position: 0,
                        description: 'What is the time complexity of merge sort?',
                        contents:['O(n)', 'O(n^2)', 'O(nlogn)', 'O(2n)'],
                        answer: '2'
                    },{
                        position: 1,
                        description: 'What is the most trending programming language in 2019?',
                        contents:['Python', 'c++', 'JavaScript', 'Java'],
                        answer: '0'
                    }],
                    type: 'quiz'
                }
            }
        });
        res.status(200).json({message: "Course updated ...", body:courseUpdated});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

// get all chapters
exports.get_all_chapters = async (req, res) => {
    let courseFound;
    try{
        courseFound = await Course.findById(req.params.courseId);
        const chapters = courseFound.chapters;
        res.status(200).json({message: "All chapters found under this id ...", body:chapters});
    } catch (err){
        res.status(404).json({message: err.message});
    }
}

// get a specific chapter
exports.get_chapter = async (req, res) => {
    try{
        const courseFound = await Course.findById(req.params.courseId);
        try{
            const chapterToFind = courseFound.chapters.find(chapter=> {
                return chapter._id.equals(req.params.chapterId);
            })
            if (chapterToFind) res.status(200).json({message: "chapter found...", body: chapterToFind}); 
            else return res.status(404).json({message: "no chapter under this id in this course", body:courseFound});
        } catch(err){
            res.status(500).json({message: err.message});
        }
    } catch (err){
        res.status(404).json({message: err.message});
    }
}

// update an existing chapter
exports.update_chapter = async (req, res) => {
    try{ 
        const result = await Course.updateOne({_id: req.params.courseId, chapters: {
            $elemMatch: {
                _id: req.params.chapterId
            }
            }},{
            $set: {               
                "chapters.$.title": req.body.title,
                "chapters.$.description": req.body.description,
                "chapters.$.createdAuthor": req.body.createdAuthor,
                "chapters.$.contents": req.body.contents               
            }
        });
        if (!result){
            return res.status(404).json({message: "chapter not found..."});
        }
        res.status(200).json({message: "Course updated ...", body:result});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
// delete an existing chapter
exports.delete_chapter = async (req, res) => {
    try{ 
        const result = await Course.update({_id: req.params.courseId}, {
            $pull: {               
                chapters: { _id: req.params.chapterId}         
            }
        });
        if (!result){
            return res.status(404).json({message: "chapter not found..."});
        }
        res.status(200).json({message: "Course updated ...", body:result});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

