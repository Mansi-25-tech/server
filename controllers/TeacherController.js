const Teacher = require("../models/teacher");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class TeacherController {

    // CREATE TEACHER
    static createTeacher = async (req, res) => {
        try {
            console.log(req.body);
console.log(req.file);

            const { name, age } = req.body;

            if (!name || !age) {
                return res.status(400).json({
                    success: false,
                    message: "Name and Age are required"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required"
                });
            }

            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "teachers"
                }
            );

            const teacher = await Teacher.create({
                name,
                age,
                image: result.secure_url,
                public_id: result.public_id
            });

            fs.unlinkSync(req.file.path);

            res.status(201).json({
                success: true,
                message: "Teacher created successfully",
                teacher
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET ALL TEACHERS
    static getAllTeachers = async (req, res) => {
        try {

            const teachers = await Teacher.find();

            res.status(200).json({
                success: true,
                teachers
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET SINGLE TEACHER
    static getSingleTeacher = async (req, res) => {
        try {

            const teacher = await Teacher.findById(req.params.id);

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            res.status(200).json({
                success: true,
                teacher
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // UPDATE TEACHER
    static updateTeacher = async (req, res) => {
        try {
            console.log("BODY =>", req.body);
console.log("FILE =>", req.file);

            const { name, age } = req.body;

            const teacher = await Teacher.findById(req.params.id);

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            let image = teacher.image;
            let public_id = teacher.public_id;

            if (req.file) {

                if (teacher.public_id) {
                    await cloudinary.uploader.destroy(
                        teacher.public_id
                    );
                }

                const result =
                    await cloudinary.uploader.upload(
                        req.file.path,
                        {
                            folder: "teachers"
                        }
                    );

                image = result.secure_url;
                public_id = result.public_id;

                fs.unlinkSync(req.file.path);
            }

            const updatedTeacher =
                await Teacher.findByIdAndUpdate(
                    req.params.id,
                    {
                        name,
                        age,
                        image,
                        public_id
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            res.status(200).json({
                success: true,
                message: "Teacher updated successfully",
                updatedTeacher
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE TEACHER
    static deleteTeacher = async (req, res) => {
        try {

            const teacher = await Teacher.findById(
                req.params.id
            );

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            if (teacher.public_id) {
                await cloudinary.uploader.destroy(
                    teacher.public_id
                );
            }

            await Teacher.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Teacher deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = TeacherController