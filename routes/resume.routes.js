const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller.js')
// Configure multer
const multer = require('multer');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware.js');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-versions', resumeController.getAllResumeVersions);
// router.get('/get-resume/:version', resumeController.fetchResume);
router.post('/save-resume', authenticate, isAdmin, upload.single('file'), resumeController.saveResume);


module.exports = router;