const aiController = require('../controllers/aiController');
const express = require('express');
const router = express.Router();
const {protect}= require('../middleware/auth');

router.use(protect); // Protect all routes in this router

router.post('/ask',protect,aiController.askAI);

module.exports=router;