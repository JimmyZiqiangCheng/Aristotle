const Question = require('./../models/questionModel');
const Course = require('./../models/courseModel');

// add a new chapter
exports.get_all_questions = async (req, res) =>{
    try{
        const courseId = req.params.courseId;
        const chapterId = req.params.chapterId;

        const quiz = await Question.findById(chapterId);
        try{
            const chapterToFind = courseFound.chapters.find(chapter=> {
                return chapter._id.equals(req.params.chapterId);
            })
            if (chapterToFind){
                const questions = chapterToFind.con
            }
            else return res.status(404).json({message: "no chapter under this id in this course", body:courseFound});
        } catch(err){
            res.status(500).json({message: err.message});
        }
    } catch (err){
        res.status(404).json({message: err.message});
    }
}

exports.create_a_questions = async (req, res) => {
    //const courseId = req.params.courseId;

};