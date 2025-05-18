const express = require("express");
const router = express.Router();
const preferencesController = require("../controllers/preferencesController");

router.post("/", preferencesController.createPreferences);
router.get("/:id", preferencesController.getPreferencesByUserId);
router.put("/:id", preferencesController.updatePreferences);
router.delete("/:id", preferencesController.deletePreferences);
router.get("/single/:id", preferencesController.getPreferencesById);

module.exports = router;
