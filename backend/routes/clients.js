const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Client = require('../models/Client');
const { protect, hasPermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients with filtering and pagination
// @access  Private
router.get('/', protect, hasPermission('read_clients'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Active', 'Inactive', 'Prospect', 'Former']).withMessage('Invalid status'),
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

    // Get clients with pagination
    const clients = await Client.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Client.countDocuments(filter);

    res.json({
      success: true,
      count: clients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      clients
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/clients/:id
// @desc    Get single client
// @access  Private
router.get('/:id', protect, hasPermission('read_clients'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('notes.createdBy', 'firstName lastName');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/clients
// @desc    Create new client
// @access  Private
router.post('/', protect, hasPermission('write_clients'), [
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
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Prospect', 'Former'])
    .withMessage('Invalid status'),
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
      industry,
      status = 'Active',
      assignedTo,
      address,
      website,
      description,
      tags
    } = req.body;

    // Check if client with same email already exists
    const existingClient = await Client.findOne({ email, isActive: true });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    // Create client
    const client = await Client.create({
      name,
      email,
      phone,
      company,
      industry,
      status,
      assignedTo,
      address,
      website,
      description,
      tags: tags || []
    });

    // Populate assignedTo field
    await client.populate('assignedTo', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during client creation'
    });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', protect, hasPermission('write_clients'), [
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
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Prospect', 'Former'])
    .withMessage('Invalid status'),
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

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check if email is being updated and if it already exists
    if (req.body.email && req.body.email !== client.email) {
      const existingClient = await Client.findOne({ email: req.body.email, isActive: true });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'Client with this email already exists'
        });
      }
    }

    // Update client
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Client updated successfully',
      client: updatedClient
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during client update'
    });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client (soft delete)
// @access  Private
router.delete('/:id', protect, hasPermission('write_clients'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Soft delete
    client.isActive = false;
    await client.save();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during client deletion'
    });
  }
});

// @route   POST /api/clients/:id/notes
// @desc    Add note to client
// @access  Private
router.post('/:id/notes', protect, hasPermission('write_clients'), [
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

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Add note
    client.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });

    await client.save();

    // Populate the note creator
    await client.populate('notes.createdBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Note added successfully',
      client
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