const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  callId: {
    type: String,
    unique: true,
    required: [true, 'Call ID is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  direction: {
    type: String,
    enum: ['Inbound', 'Outbound'],
    required: [true, 'Call direction is required']
  },
  status: {
    type: String,
    enum: ['Initiated', 'Ringing', 'Answered', 'Completed', 'Failed', 'Busy', 'No Answer', 'Cancelled'],
    default: 'Initiated'
  },
  duration: {
    type: Number, // in seconds
    min: [0, 'Duration cannot be negative'],
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['Lead', 'Client'],
      required: [true, 'Related entity type is required']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Related entity ID is required']
    }
  },
  ariaCallId: {
    type: String,
    unique: true,
    sparse: true
  },
  ariaUserId: {
    type: String
  },
  ariaClientId: {
    type: String
  },
  recordingUrl: {
    type: String
  },
  transcript: {
    type: String
  },
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
  tags: [{
    type: String,
    trim: true
  }],
  outcome: {
    type: String,
    enum: ['Successful', 'No Answer', 'Busy', 'Wrong Number', 'Not Interested', 'Call Back', 'Meeting Scheduled', 'Sale Made'],
    default: 'Successful'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
callLogSchema.index({ callId: 1 });
callLogSchema.index({ phoneNumber: 1 });
callLogSchema.index({ agent: 1 });
callLogSchema.index({ status: 1 });
callLogSchema.index({ startTime: -1 });
callLogSchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
callLogSchema.index({ ariaCallId: 1 });

// Virtual for call duration in minutes
callLogSchema.virtual('durationMinutes').get(function() {
  return this.duration ? Math.round(this.duration / 60 * 100) / 100 : 0;
});

// Virtual for formatted duration
callLogSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return '0:00';
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Ensure virtual fields are serialized
callLogSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('CallLog', callLogSchema); 