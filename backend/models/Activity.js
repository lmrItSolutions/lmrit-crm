const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Call', 'Email', 'Meeting', 'Note', 'Task', 'SMS', 'WhatsApp'],
    required: [true, 'Activity type is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['Lead', 'Client', 'Deal'],
      required: [true, 'Related entity type is required']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Related entity ID is required']
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Activity must be assigned to a user']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Activity creator is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    min: [0, 'Duration cannot be negative']
  },
  location: {
    type: String,
    trim: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: Number,
    mimeType: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Specific fields for different activity types
  callDetails: {
    phoneNumber: String,
    duration: Number,
    outcome: {
      type: String,
      enum: ['Answered', 'No Answer', 'Busy', 'Voicemail', 'Wrong Number', 'Not Interested']
    },
    recordingUrl: String
  },
  emailDetails: {
    to: [String],
    cc: [String],
    bcc: [String],
    subject: String,
    body: String,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  meetingDetails: {
    startTime: Date,
    endTime: Date,
    meetingType: {
      type: String,
      enum: ['In Person', 'Video Call', 'Phone Call']
    },
    agenda: String,
    minutes: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ type: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ assignedTo: 1 });
activitySchema.index({ createdBy: 1 });
activitySchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
activitySchema.index({ dueDate: 1 });
activitySchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
activitySchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Activity', activitySchema); 