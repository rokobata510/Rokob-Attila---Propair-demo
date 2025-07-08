const express = require('express');
const router = express.Router();
const protect = require('../middleware/Auth');
const { getTitleSuggestion } = require('../controllers/aiController');

router.use(protect);
router.post('/suggest-title', getTitleSuggestion);

module.exports = router;