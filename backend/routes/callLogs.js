const express = require('express');
const { body, validationResult, query } = require('express-validator');
const CallLog = require('../models/CallLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/call-logs
// @desc    Get all call logs with filtering and pagination
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Initiated', 'Ringing', 'Answered', 'Completed', 'Failed', 'Busy', 'No Answer', 'Cancelled']).withMessage('Invalid status'),
  query('direction').optional().isIn(['Inbound', 'Outbound']).withMessage('Invalid direction'),
  query('agent').optional().isMongoId().withMessage('Invalid agent ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status, direction, agent } = req.query;

    const filter = { isActive: true };

    if (status) filter.status = status;
    if (direction) filter.direction = direction;
    if (agent) filter.agent = agent;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const callLogs = await CallLog.find(filter)
      .populate('agent', 'firstName lastName email')
      .populate('relatedTo.id', 'name email company')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CallLog.countDocuments(filter);

    res.json({
      success: true,
      count: callLogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      callLogs
    });
  } catch (error) {
    console.error('Get call logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/call-logs/:id
// @desc    Get single call log
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const callLog = await CallLog.findById(req.params.id)
      .populate('agent', 'firstName lastName email')
      .populate('relatedTo.id', 'name email company')
      .populate('notes.createdBy', 'firstName lastName');

    if (!callLog) {
      return res.status(404).json({
        success: false,
        message: 'Call log not found'
      });
    }

    res.json({
      success: true,
      callLog
    });
  } catch (error) {
    console.error('Get call log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/call-logs/:id/notes
// @desc    Add note to call log
// @access  Private
router.post('/:id/notes', protect, [
  body('content')
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ max: 1000 })
    .withMessage('Note content cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const callLog = await CallLog.findById(req.params.id);
    if (!callLog) {
      return res.status(404).json({
        success: false,
        message: 'Call log not found'
      });
    }

    callLog.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });

    await callLog.save();
    await callLog.populate('notes.createdBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Note added successfully',
      callLog
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during note addition'
    });
  }
});

module.exports = router; 