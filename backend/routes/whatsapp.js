const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/whatsapp
// @desc    Get all WhatsApp conversations
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Active', 'Archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // This would typically query a WhatsApp conversations collection
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      count: 0,
      total: 0,
      page: parseInt(page),
      pages: 0,
      conversations: []
    });
  } catch (error) {
    console.error('Get WhatsApp conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/whatsapp/send
// @desc    Send WhatsApp message
// @access  Private
router.post('/send', protect, [
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('leadId')
    .optional()
    .isMongoId()
    .withMessage('Invalid lead ID'),
  body('clientId')
    .optional()
    .isMongoId()
    .withMessage('Invalid client ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phoneNumber, message, leadId, clientId } = req.body;

    // This would typically integrate with WhatsApp Business API
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      messageId: 'placeholder_message_id',
      phoneNumber,
      message,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Send WhatsApp message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during message sending'
    });
  }
});

// @route   GET /api/whatsapp/conversation/:phoneNumber
// @desc    Get conversation history for a phone number
// @access  Private
router.get('/conversation/:phoneNumber', protect, async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // This would typically query conversation history
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      phoneNumber,
      messages: []
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 