const User = require('../models/User');

// Simulated notification channel — delivers to the server console.
// Centralised here so it can be swapped for a real channel (email, push,
// websockets) later without touching any callers.
const deliver = (recipient, subject, body) => {
  console.log(
    `🔔 [NOTIFICATION] to ${recipient.name} <${recipient.email}> — ${subject}: ${body}`
  );
};

// @desc  Notify a talent that a task has been assigned to them.
// Never throws: a notification failure must not break the API request.
const notifyTaskAssigned = async (talentId, task) => {
  try {
    if (!talentId) return;

    const talent = await User.findById(talentId).select('name email');
    if (!talent) return;

    const due = task.dueDate ? ` (due ${task.dueDate})` : '';
    deliver(talent, 'New task assigned', `"${task.title || 'Untitled Task'}"${due}`);
  } catch (error) {
    console.error(`Failed to send assignment notification: ${error.message}`);
  }
};

module.exports = { notifyTaskAssigned };
