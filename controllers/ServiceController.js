const Service = require('../models/Service')

class ServiceController {

    // Create Service
    static createService = async (req, res) => {
        try {

            const {
                title,
                description,
                icon
            } = req.body

            const service = await Service.create({
                title,
                description,
                icon
            })

            return res.status(201).json({
                success: true,
                message: "Service created successfully",
                service
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Get All Services
    static getAllServices = async (req, res) => {
        try {

            const services = await Service.find()

            return res.status(200).json({
                success: true,
                services
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Update Service
    static updateService = async (req, res) => {
        try {

            const updatedService = await Service.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: 'after' 
                }
            )

            if (!updatedService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Service updated successfully",
                updatedService
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Delete Service
    static deleteService = async (req, res) => {
        try {

            const deletedService = await Service.findByIdAndDelete(req.params.id)

            if (!deletedService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Service deleted successfully"
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

}

module.exports = ServiceController