const Contact = require("../models/contact.model");
const sendEmail = require("../services/email.services");

const contactController = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({success: false, message: "All fields required"});
    }
    const savedContact = await Contact.create({name, email, phone, message});
    await sendEmail({ name, email, phone, message });
    res.status(200).json({success: true, message: "Success", data: savedContact});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, error: error.message});
  }
};
module.exports = contactController;
