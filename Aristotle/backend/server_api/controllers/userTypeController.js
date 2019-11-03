const UserType = require('../models/typeSchema');

// post a new course
exports.create_user_type = async (req, res) => {
    const userType = new UserType(req.body);
    console.log(req.body);
    try{ 
        const createdUserType = await userType.save();
        res.status(200).json({message: "Added", createdUserType});
    } catch (err){
        res.status(500).json({message: err.message});
        //res.status(500).json({message: err.message});
    }
};

// get all types
exports.get_all_user_types = async (req, res) => {
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
    try {
        const types = await UserType
            .find({
                title: {
                    $nin: ['Admin', 'Administrator']
                }
            })
            .select(selector)
            .sort({
                title: 1
            });
        res.status(200).json({
            message: "OK",
            body: types
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};