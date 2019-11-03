const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema ({
    title:  {
        type: String,
        unique: true,
        index: true,
        
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model("Type",typeSchema);