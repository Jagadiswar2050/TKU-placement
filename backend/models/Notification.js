const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    type: {
      type: String,
      enum: ['info', 'alert', 'success', 'urgent'],
      default: 'info',
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'company'],
      default: 'all',
    },
    senderName: {
      type: String,
      default: 'Placement Cell',
    },
    link: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
