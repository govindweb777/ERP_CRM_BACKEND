const express= require("express");
const {
    createAdmin,

}= require("../../controllers/Modified.Controllers/user.controller");
const router = express.Router();

router.post("/create",createAdmin);
module.exports= router;