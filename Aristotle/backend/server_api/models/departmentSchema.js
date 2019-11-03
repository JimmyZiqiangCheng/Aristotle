const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema ({
    title:  {
        type: String,
        unique: true,
        index: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model("Department", departmentSchema);;