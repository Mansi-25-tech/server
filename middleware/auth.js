const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const adminData = await Admin
            .findById(decodedToken.id)
            .select("-password");

        if (!adminData) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        req.admin = adminData;

        next();

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = auth;