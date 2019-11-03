const assert = require('assert');
const mongoose = require('mongoose');
const Course = require('./../models/courseModel');

// post a new course
exports.create_course = async (req, res) => {
    const newCourse = new Course(req.body);
    try{ 
        const courseAdded = await newCourse.save();
        res.status(200).json({message: "OK", body: courseAdded});
    } catch (err){
        res.status(500).json({message: err.message});
    }
};

// get all courses 
exports.get_all_courses = async(req, res) => {
    // query all courses
    try{
        const courses =  await Course
        .find({})
        .populate('department', {_id: 1, title: 1})
        .sort({ createdAt: 1});
        res.status(200).json({message: "OK", body: courses});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

// get one course by id
exports.get_course = async(req, res) => {
    console.log(req.params.id);
    try {
        const courseFound = await Course.findById(req.params.id);
        res.status(200).json({message: "OK", body: courseFound});
    } catch (err){
        res.status(404).json({message: err.message});
    }
};

// update an existing course
exports.update_course = async (req,res) => {
    try{
        const courseUpdated = await Course.updateOne({_id: req.params.id},{
            $set: { 
                disable: req.body.disable,
                title: req.body.title,
                description: req.body.description,
                createdAuthor: req.body.createdAuthor,
                department: req.body.department
            }
        });
        res.status(200).json({message: "OK", body: courseUpdated});
    }catch(err){
        res.status(404).json({message: err.message});
    }
};

// delete a course
exports.delete_course = async (req,res) => {
    try{
        const courseRemoved = await Course.remove({_id: req.params.id});
        res.status(200).json({message:"OK", body: courseRemoved});
    }catch(err){
        res.status(404).json({message: err.message});
    }
};

