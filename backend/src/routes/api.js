const express = require('express');
const router = express.Router();
const multer = require('multer');
const analyzeController = require('../controllers/analyzeController');

// Configure multer to use memory storage so we can access the buffer directly
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // limit to 10MB
    }
});

router.post('/analyze', upload.single('file'), analyzeController.analyzeDocument);
router.post('/analyze-text', analyzeController.analyzeText);

module.exports = router;

