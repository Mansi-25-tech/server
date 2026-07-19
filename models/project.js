const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true
        },

        image: {
            type: String,
            required: [true, "Project image is required"]
        },

        public_id: {
            type: String
        },

        liveLink: {
            type: String,
            required: [true, "Live project link is required"],
            trim: true
        },

        githubLink: {
            type: String,
            required: [true, "GitHub repository link is required"],
            trim: true
        },

        technologies: [{
            type: String,
            trim: true
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);