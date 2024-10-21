const express = require('express');
const router = express.Router();
const SkillController = require('../controllers/skill.controller.js');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware.js');

router.get('/fetch-skills',SkillController.getSkills);
router.delete('/delete-skill-by-id',authenticate, isAdmin,SkillController.deleteSkillById);


module.exports = router;