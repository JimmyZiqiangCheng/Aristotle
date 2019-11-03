const Department = require('../models/departmentSchema');

// post a new course
exports.create_department = async (req, res) => {
    const department = new Department(req.body);
    console.log(req.body);
    try {
        const createDpt = await department.save();
        res.status(200).json({
            message: "Added",
            body: createDpt
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
        //res.status(500).json({message: err.message});
    }
};

// get all departments
exports.get_all_departments = async (req, res) => {
    // get the query name 'type'
    // this is not a good practice anyway
    let isAdmin = (req.query.type == 'Administrator' || req.query.type == 'Admin');
    // select all attributes for Admin type
    let selector = {};
    if (!isAdmin) {
        // not admin, limit the selection attributes
        selector = {
            _id: 1,
            title: 1,
        };
    }
    // query all departments
    try {
        const dpts = await Department
            .find({})
            .select(selector)
            .sort({
                title: 1
            });
        res.status(200).json({
            message: "OK",
            body:dpts
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};