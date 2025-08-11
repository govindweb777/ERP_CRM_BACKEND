const express= require("express");
const {
  createAdmin,
  getAllAdmin,
  enableAdmin,
  disableAdmin,
  
} = require('../../controllers/Modified.Controllers/user.controller');
const router = express.Router();

router.post("/create",createAdmin);
router.get("/get-All",getAllAdmin);
router.put("/enable/:adminId",enableAdmin);
router.put("/disable/:adminId",disableAdmin);

module.exports= router;