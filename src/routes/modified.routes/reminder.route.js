const express = require('express');
const router = express.Router();
const {
    addReminder,
    getAllReminder,
    getReminderByDate,
    deleteReminder

} = require("../../controllers/Modified.Controllers/reminder.controller")

router.post("/add",addReminder);
router.get("/get-All",getAllReminder);
router.get("/get/:date",getReminderByDate);
router.delete("/delete/:id",deleteReminder);

module.exports= router;

