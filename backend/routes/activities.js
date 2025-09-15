const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Activity = require('../models/Activity');
const { protect, hasPermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities with filtering and pagination
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['Call', 'Email', 'Meeting', 'Note', 'Task', 'SMS', 'WhatsApp']).withMessage('Invalid activity type'),
  query('status').optional().isIn(['Pending', 'In Progress', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  query('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, type, status, assignedTo } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      count: activities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private
router.post('/', protect, [
  body('type')
    .isIn(['Call', 'Email', 'Meeting', 'Note', 'Task', 'SMS', 'WhatsApp'])
    .withMessage('Invalid activity type'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('relatedTo.type')
    .isIn(['Lead', 'Client', 'Deal'])
    .withMessage('Invalid related entity type'),
  body('relatedTo.id')
    .isMongoId()
    .withMessage('Invalid related entity ID'),
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid assignedTo ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const activity = await Activity.create({
      ...req.body,
      createdBy: req.user.id
    });

    await activity.populate('assignedTo', 'firstName lastName email');
    await activity.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during activity creation'
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email')
     .populate('createdBy', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Activity updated successfully',
      activity: updatedActivity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during activity update'
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    activity.isActive = false;
    await activity.save();

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during activity deletion'
    });
  }
});

module.exports = router; 