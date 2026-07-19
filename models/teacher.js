const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
         type: String,
        required: true,
    },
    image: {
        type: String, // Cloudinary secure_url
        required: [true, "Project image is required"]
    },

    public_id: {
        type: String, // Cloudinary public_id

    },
 


});
module.exports = mongoose.model("Teacher", TeacherSchema);