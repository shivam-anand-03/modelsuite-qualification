const Task = require('../models/Task');

// Returns an error message if the due date is invalid or in the past, else null.
// Due dates are calendar days (YYYY-MM-DD from the form) — a task due today is
// still actionable, so only days strictly before today are rejected.
const validateDueDate = (dueDate) => {
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) {
    return 'Invalid due date';
  }
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (due.getTime() < startOfToday.getTime()) {
    return 'Due date cannot be in the past';
  }
  return null;
};

// @desc  Get all tasks
// @route GET /api/tasks
// @access Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single task
// @route GET /api/tasks/:id
// @access Admin
const getTaskById = async (req, res) => {
  try {
    // — will throw a CastError from Mongoose instead of a clean 400
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a task
// @route POST /api/tasks
// @access Admin
const createTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;

  try {
    if (dueDate) {
      const dueDateError = validateDueDate(dueDate);
      if (dueDateError) {
        return res.status(400).json({ message: dueDateError });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assignedTo || null,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Editing a task must not move its due date into the past either.
    // Only validate a CHANGED due date so older tasks stay editable.
    if (req.body.dueDate && req.body.dueDate !== task.dueDate) {
      const dueDateError = validateDueDate(req.body.dueDate);
      if (dueDateError) {
        return res.status(400).json({ message: dueDateError });
      }
    }
    // including internal fields like createdBy or __v
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // — orphaned Submission documents remain in DB after task deletion
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
