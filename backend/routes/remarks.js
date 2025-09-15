const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/remarks
// @desc    Get all remarks with filtering and pagination
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('entityType').optional().isIn(['Lead', 'Client', 'Activity']).withMessage('Invalid entity type'),
  query('entityId').optional().isMongoId().withMessage('Invalid entity ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, entityType, entityId } = req.query;

    // This would typically query a remarks collection
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      count: 0,
      total: 0,
      page: parseInt(page),
      pages: 0,
      remarks: []
    });
  } catch (error) {
    console.error('Get remarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/remarks
// @desc    Create new remark
// @access  Private
router.post('/', protect, [
  body('content')
    .notEmpty()
    .withMessage('Remark content is required')
    .isLength({ max: 1000 })
    .withMessage('Remark content cannot exceed 1000 characters'),
  body('entityType')
    .isIn(['Lead', 'Client', 'Activity'])
    .withMessage('Invalid entity type'),
  body('entityId')
    .isMongoId()
    .withMessage('Invalid entity ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { content, entityType, entityId } = req.body;

    // This would typically create a remark in a remarks collection
    // For now, we'll return a placeholder response
    res.status(201).json({
      success: true,
      message: 'Remark created successfully',
      remark: {
        id: 'placeholder_id',
        content,
        entityType,
        entityId,
        createdBy: req.user.id,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during remark creation'
    });
  }
});

module.exports = router; 