// controllers/skillController.js

const Skill = require('../models/Skill')

class SkillController {

    // Create Skill
    static createSkill = async (req, res) => {
        try {

            const {
                name,
                percentage,
                icon
            } = req.body

            const skill = await Skill.create({
                name,
                percentage,
                icon
            })

            return res.status(201).json({
                success: true,
                message: "Skill created successfully",
                skill
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Get All Skills
    static getAllSkills = async (req, res) => {
        try {

            const skills = await Skill.find()

            return res.status(200).json({
                success: true,
                skills
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Update Skill
    static updateSkill = async (req, res) => {
        try {

            const updatedSkill = await Skill.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: 'after'
                }
            )

            if (!updatedSkill) {
                return res.status(404).json({
                    success: false,
                    message: "Skill not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Skill updated successfully",
                updatedSkill
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Delete Skill
    static deleteSkill = async (req, res) => {
        try {

            const deletedSkill = await Skill.findByIdAndDelete(req.params.id)

            if (!deletedSkill) {
                return res.status(404).json({
                    success: false,
                    message: "Skill not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Skill deleted successfully"
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

}

module.exports = SkillController