const Role = require('../models/roleSchema');

// post a new course
exports.create_role = async (req, res) => {
    const role = new Role(req.body);
    console.log(req.body);
    try {
        const createRole = await role.save();
        res.status(200).json({
            message: "Added",
            body:createRole
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
        //res.status(500).json({message: err.message});
    }
};

// get all roles
exports.get_all_roles = async (req, res) => {
    // get the query name 'type'
    // this is not a good practice anyway
    let isAdmin = (req.query.type == 'Administrator' || req.query.type == 'Admin');
    // select all attributes for Admin type
    let selector = {};
    if (!isAdmin) {
        // not admin, limit the selection attributes
        selector = {
            _id: 1,
            title:1,
        };
    }
    // query all roles
    try {
        const roles = await Role
            .find({})
            .select(selector)
            .sort({
                title: 1
            });
        res.status(200).json({
            message: "OK",
            body:roles
        })
        }
        catch (err) {
            res.status(400).json({
                message: err.message
            });
        };
};