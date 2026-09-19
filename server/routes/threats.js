const express = require('express');
const router = express.Router();

// Get Live Threats Stream Confirmation
router.get('/live', (req, res) => {
    res.json({ message: 'Live threats stream established via WebSocket' });
});

module.exports = router;
