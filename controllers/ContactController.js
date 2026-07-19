const Contact = require("../models/contact");

class ContactController {

    // Create Contact Form
    static createContact = async (req, res) => {

        try {

            const { name, email, subject, message } = req.body;

            // Validation
            if (!name || !email || !subject || !message) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            // Save Contact
            const result = new Contact({
                name,
                email,
                subject,
                message,
            });

            await result.save();

            return res.status(201).json({
                success: true,
                message: "Message sent successfully",
                result
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }


    // Get All Contact Forms
    static getAllContact = async (req, res) => {

        try {

            const contacts = await Contact.find().sort({
                createdAt: -1
            });

            return res.status(200).json({
                success: true,
                total: contacts.length,
                contacts
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    // Delete Contact
static deleteContact = async (req, res) => {

    try {

        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        await contact.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}
}

module.exports = ContactController;