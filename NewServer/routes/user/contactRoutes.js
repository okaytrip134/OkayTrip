const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts, updateContactStatus, deleteContact } = require("../../controllers/contactformController");

router.post("/submit", submitContactForm);

router.get("/", getAllContacts);

router.put("/update/:id", updateContactStatus);

router.delete("/delete/:id", deleteContact) 

module.exports = router;
