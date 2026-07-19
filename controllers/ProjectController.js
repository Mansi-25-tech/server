const Project = require("../models/project");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class ProjectController {

    // create project
     static createProject = async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.files);
            const { title, description, liveLink, githubLink, technologies } = req.body;
            if(!title || !description || !liveLink || !githubLink || !technologies){
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }
            if(!req.files || !req.files.image){
                return res.status(400).json({
                    success: false,
                    message: "Image is required"
                });
            }

            const file = req.files.image;
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "projects"
            });
            // console.log(result)

            const project = await Project.create({
                title,
                description,
                image: result.secure_url,
                public_id: result.public_id,
                liveLink,
                githubLink,
                technologies: technologies.split(",")
            });

            if(!project) {
                return res.status(400).json({
                    success: false,
                    message: "Project not created"
                });
            }
            return res.status(201).json({
                success: true,
                message: "Project created successfully",
                project
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // get all projects
  static getAllProjects = async (req, res) => {
        try {
            const projects = await Project.find().sort({ createdAt: -1 });
            if (!projects) {
                return res.status(404).json({
                    success: false,
                    message: "No projects found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Projects fetched successfully",
                projects
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    //get single project

   static getSingleProject = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "No project found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Project fetched successfully",
                project
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // update project
   static updateProject = async (req, res) => {
        try {

            const { id } = req.params;
        
            const {
                title,
                description,
                liveLink,
                githubLink,
                technologies
            } = req.body;

            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found"
                });
            }

            // Image Update
            if (req.files && req.files.image) {

                if (project.public_id) {
                    await cloudinary.uploader.destroy(
                        project.public_id
                    );
                }

                const imageFile = req.files.image;

                const uploadResult =
                    await cloudinary.uploader.upload(
                        imageFile.tempFilePath,
                        {
                            folder: "projects"
                        }
                    );

                fs.unlinkSync(imageFile.tempFilePath);

                project.image = uploadResult.secure_url;
                project.public_id = uploadResult.public_id;
            }

            project.title =title || project.title;

            project.description =description || project.description;

            project.liveLink =liveLink || project.liveLink;

            project.githubLink =githubLink || project.githubLink;

            if (technologies) {
                project.technologies =
                    JSON.parse(technologies);
            }

            await project.save();

            res.status(200).json({
                success: true,
                message: "Project updated successfully",
                project
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

static deleteProject = async (req, res) => {
    try {

        const { id } = req.params

        const project = await Project.findById(id)

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            })
        }


        // delete cloudinary image
        if(project.public_id){
            await cloudinary.uploader.destroy(project.public_id)
        }


        await project.deleteOne()


        res.json({
            success: true,
            message: 'Project deleted successfully'
        })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

}

module.exports = ProjectController;