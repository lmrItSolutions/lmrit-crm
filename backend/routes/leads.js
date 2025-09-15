const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Lead = require('../models/Lead');
const { protect, hasPermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/leads
// @desc    Get all leads with filtering and pagination
// @access  Private
router.get('/', protect, hasPermission('read_leads'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Converted']).withMessage('Invalid status'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status, search, assignedTo } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (status) {
      filter.status = status;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get leads with pagination
    const leads = await Lead.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      count: leads.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private
router.get('/:id', protect, hasPermission('read_leads'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('notes.createdBy', 'firstName lastName');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/leads
// @desc    Create new lead
// @access  Private
router.post('/', protect, hasPermission('write_leads'), [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Converted'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Social Media', 'Other'])
    .withMessage('Invalid source'),
  body('value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid assignedTo ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      company,
      status = 'New',
      source = 'Other',
      value,
      assignedTo,
      description,
      tags
    } = req.body;

    // Check if lead with same email already exists
    const existingLead = await Lead.findOne({ email, isActive: true });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }

    // Create lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status,
      source,
      value,
      assignedTo,
      description,
      tags: tags || []
    });

    // Populate assignedTo field
    await lead.populate('assignedTo', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lead creation'
    });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', protect, hasPermission('write_leads'), [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Converted'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Social Media', 'Other'])
    .withMessage('Invalid source'),
  body('value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignedTo ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if email is being updated and if it already exists
    if (req.body.email && req.body.email !== lead.email) {
      const existingLead = await Lead.findOne({ email: req.body.email, isActive: true });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: 'Lead with this email already exists'
        });
      }
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lead update'
    });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete lead (soft delete)
// @access  Private
router.delete('/:id', protect, hasPermission('write_leads'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Soft delete
    lead.isActive = false;
    await lead.save();

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lead deletion'
    });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Add note to lead
// @access  Private
router.post('/:id/notes', protect, hasPermission('write_leads'), [
  body('content')
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ max: 1000 })
    .withMessage('Note content cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Add note
    lead.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });

    await lead.save();

    // Populate the note creator
    await lead.populate('notes.createdBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Note added successfully',
      lead
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