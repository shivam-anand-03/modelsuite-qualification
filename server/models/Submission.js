const mongoose = require('mongoose');
// Each submission attempt is stored as its own document so that
// re-submissions never overwrite earlier data (full audit trail)
const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fileUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
    attempt: {
      type: Number,
      default: 1,
    },
    reviewStatus: {
      type: String,
      default: 'Pending',
      // Should be: enum: ['Pending', 'Approved', 'Rejected']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
