const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AdminController {

    // Register
    static register = async (req, res) => {
        try {

            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const adminExists = await Admin.findOne({ email });

            if (adminExists) {
                return res.status(400).json({
                    success: false,
                    message: "Admin already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await Admin.create({
                name,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                admin: result
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // Login
   static login = async (req, res) => {
        try {

            const { email, password } = req.body;

            const adminExists = await Admin.findOne({ email });

            if (!adminExists) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                adminExists.password
            );

            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            const token = jwt.sign(
                { id: adminExists._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
});

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                admin: {
                    _id: adminExists._id,
                    name: adminExists.name,
                    email: adminExists.email
                }
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // Logout
    static logout = async (req, res) => {
        try {

            res.clearCookie("token");

            res.status(200).json({
                success: true,
                message: "Logout successful"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // Get Profile
    static getProfile = async (req, res) => {
        try {

            const adminData = await Admin
                .findById(req.admin._id)
                .select("-password");

            if (!adminData) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            res.status(200).json({
                success: true,
                admin: adminData
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // Update Profile
    static updateProfile = async (req, res) => {
        try {

            const { name, email } = req.body;

            const adminExists = await Admin.findById(req.admin._id);

            if (!adminExists) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            adminExists.name = name || adminExists.name;
            adminExists.email = email || adminExists.email;

            await adminExists.save();

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                admin: adminExists
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // Change Password
    static changePassword = async (req, res) => {
        try {

            const {
                oldPassword,
                newPassword,
                confirmPassword
            } = req.body;

            const adminExists = await Admin.findById(
                req.admin._id
            ).select("+password");

            if (!adminExists) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            const isPasswordValid = await bcrypt.compare(
                oldPassword,
                adminExists.password
            );

            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Old password is incorrect"
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Passwords do not match"
                });
            }

            adminExists.password = await bcrypt.hash(
                newPassword,
                10
            );

            await adminExists.save();

            res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = AdminController;