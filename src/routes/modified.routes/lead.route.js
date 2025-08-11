const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getActiveLeads,
  deactivateLead,
  activateLead,
  findLeadByAssignedTo,
} = require('../../controllers/Modified.Controllers/lead.controller');

const express = require('express');
const router = express.Router();

router.post('/create', createLead);
router.get('/get-All', getAllLeads);
router.get("/get-active-lead",getActiveLeads);
router.put("/deactivate-lead/:id",deactivateLead);
router.put('/activate-lead/:id',activateLead);
router.get('/get-By-Id/:id', getLeadById);
router.put('/update/:id', updateLead);
router.delete('/delete/:id', deleteLead);
router.get('/get-assign/:assignedToId', findLeadByAssignedTo);

module.exports = router;