const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const CallLog = require('../models/CallLog');
const User = require('../models/User');

const router = express.Router();

// Aria API configuration
const ARIA_API_URL = process.env.ARIA_API_URL;
const ARIA_API_KEY = process.env.ARIA_API_KEY;

// Helper function to make Aria API calls
const makeAriaRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${ARIA_API_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARIA_API_KEY}`
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Aria API error: ${result.message || response.statusText}`);
    }

    return result;
  } catch (error) {
    console.error('Aria API request failed:', error);
    throw error;
  }
};

// @route   POST /api/aria/login
// @desc    Login to Aria dialer
// @access  Private
router.post('/login', protect, [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { username, password } = req.body;

    // Call Aria login API
    const ariaResponse = await makeAriaRequest('/Login', 'POST', {
      username,
      password
    });

    // Update user with Aria token
    const user = await User.findById(req.user.id);
    user.ariaToken = ariaResponse.token;
    user.ariaUserId = username;
    await user.save();

    res.json({
      success: true,
      message: 'Successfully logged in to Aria dialer',
      ariaToken: ariaResponse.token,
      ariaUserId: username
    });
  } catch (error) {
    console.error('Aria login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login to Aria dialer'
    });
  }
});

// @route   POST /api/aria/dial
// @desc    Dial a number using Aria dialer
// @access  Private
router.post('/dial', protect, [
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),
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
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phoneNumber, leadId, clientId } = req.body;

    // Get user with Aria token
    const user = await User.findById(req.user.id).select('+ariaToken');
    if (!user.ariaToken) {
      return res.status(400).json({
        success: false,
        message: 'Please login to Aria dialer first'
      });
    }

    // Call Aria dial API
    const ariaResponse = await makeAriaRequest('/DialNumber', 'POST', {
      UserID: user.ariaUserId,
      Number: phoneNumber,
      ClientID: leadId || clientId
    });

    // Create call log entry
    const callLog = await CallLog.create({
      callId: ariaResponse.callId || `call_${Date.now()}`,
      phoneNumber,
      direction: 'Outbound',
      status: 'Initiated',
      agent: req.user.id,
      relatedTo: {
        type: leadId ? 'Lead' : 'Client',
        id: leadId || clientId
      },
      ariaCallId: ariaResponse.callId,
      ariaUserId: user.ariaUserId,
      ariaClientId: leadId || clientId
    });

    res.json({
      success: true,
      message: 'Call initiated successfully',
      callId: callLog.callId,
      ariaResponse
    });
  } catch (error) {
    console.error('Aria dial error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate call'
    });
  }
});

// @route   GET /api/aria/call-status/:callId
// @desc    Get call status from Aria
// @access  Private
router.get('/call-status/:callId', protect, async (req, res) => {
  try {
    const { callId } = req.params;

    // Get call log
    const callLog = await CallLog.findOne({ callId });
    if (!callLog) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Get user with Aria token
    const user = await User.findById(req.user.id).select('+ariaToken');
    if (!user.ariaToken) {
      return res.status(400).json({
        success: false,
        message: 'Please login to Aria dialer first'
      });
    }

    // Call Aria status API
    const ariaResponse = await makeAriaRequest(`/CallStatus?callId=${callId}`);

    // Update call log with status
    callLog.status = ariaResponse.status || callLog.status;
    if (ariaResponse.duration) {
      callLog.duration = ariaResponse.duration;
    }
    if (ariaResponse.endTime) {
      callLog.endTime = new Date(ariaResponse.endTime);
    }
    if (ariaResponse.recordingUrl) {
      callLog.recordingUrl = ariaResponse.recordingUrl;
    }
    await callLog.save();

    res.json({
      success: true,
      callStatus: ariaResponse,
      callLog
    });
  } catch (error) {
    console.error('Aria call status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get call status'
    });
  }
});

// @route   POST /api/aria/end-call/:callId
// @desc    End a call
// @access  Private
router.post('/end-call/:callId', protect, async (req, res) => {
  try {
    const { callId } = req.params;

    // Get call log
    const callLog = await CallLog.findOne({ callId });
    if (!callLog) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Get user with Aria token
    const user = await User.findById(req.user.id).select('+ariaToken');
    if (!user.ariaToken) {
      return res.status(400).json({
        success: false,
        message: 'Please login to Aria dialer first'
      });
    }

    // Call Aria end call API
    const ariaResponse = await makeAriaRequest('/EndCall', 'POST', {
      CallID: callId
    });

    // Update call log
    callLog.status = 'Completed';
    callLog.endTime = new Date();
    await callLog.save();

    res.json({
      success: true,
      message: 'Call ended successfully',
      ariaResponse
    });
  } catch (error) {
    console.error('Aria end call error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to end call'
    });
  }
});

// @route   GET /api/aria/call-logs
// @desc    Get call logs for current user
// @access  Private
router.get('/call-logs', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, phoneNumber } = req.query;

    // Build filter
    const filter = { agent: req.user.id };
    if (status) filter.status = status;
    if (phoneNumber) {
      filter.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get call logs
    const callLogs = await CallLog.find(filter)
      .populate('relatedTo.id', 'name email company')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
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

// @route   POST /api/aria/logout
// @desc    Logout from Aria dialer
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Update user - remove Aria token
    const user = await User.findById(req.user.id);
    user.ariaToken = undefined;
    user.ariaUserId = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Successfully logged out from Aria dialer'
    });
  } catch (error) {
    console.error('Aria logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

module.exports = router; 