const Contact = require("../models/contact");
const asyncHandler = require("../utils/asyncHandler");

exports.getContacts = asyncHandler(async (_req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
});

exports.createContact = asyncHandler(async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
});

exports.deleteContact = asyncHandler(async (req, res) => {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
    }
    res.status(204).end();
});
