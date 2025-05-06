const mongoose = require('mongoose');
const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { user_id, title, event_date, start_time, end_time, description, category, reminder, notes } = req.body;

    const validCategories = ['work', 'school', 'sport', 'hobby', 'personal'];  
    const normalizedCategory = category ? category.toLowerCase() : ''; 

    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ message: `Invalid category. Valid options: ${validCategories.join(', ')}` });
    }

    let validUserId;
    try {
      validUserId = mongoose.Types.ObjectId(user_id);  
    } catch (error) {
      return res.status(400).json({ message: "Invalid user_id format" });
    }

    let reminderDate;
    if (reminder) {
      reminderDate = new Date(reminder);
      if (isNaN(reminderDate)) {
        return res.status(400).json({ message: "Invalid reminder date" });
      }
    }

    const newTask = new Task({
      user_id: validUserId,  
      title,
      event_date,
      start_time,
      end_time,
      description,
      category: normalizedCategory, 
      reminder: reminderDate,
      notes,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getTasksByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await Task.find({ user_id: mongoose.Types.ObjectId(id) });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
