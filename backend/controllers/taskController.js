// controllers/taskController.js
const mongoose = require('mongoose');
const Task    = require('../models/taskModel');
const User    = require('../models/userModel');
const ExpLog  = require('../models/expLogModel');

exports.createTask = async (req, res) => {
  try {
    const {
      user_id,
      title,
      event_date,
      start_time,
      end_time,
      description,
      category,
      reminder,
      notes,
      status,
    } = req.body;

    const validCategories = ['work', 'school', 'sport', 'hobby', 'personal'];
    const validStatuses   = ['started', 'completed'];

    const normalizedCategory = category ? category.toLowerCase() : '';
    const normalizedStatus   = status   ? status.toLowerCase()   : undefined;

    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        message: `Invalid category. Valid options: ${validCategories.join(', ')}`,
      });
    }
    if (normalizedStatus && !validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Invalid status. Use: ${validStatuses.join(', ')}`,
      });
    }

    let validUserId;
    try {
      validUserId = mongoose.Types.ObjectId(user_id);
    } catch {
      return res.status(400).json({ message: 'Invalid user_id format' });
    }

    let reminderDate = null;
    if (reminder) {
      reminderDate = new Date(reminder);
      if (isNaN(reminderDate)) {
        return res.status(400).json({ message: 'Invalid reminder date' });
      }
    }

    const newTask = new Task({
      user_id:   validUserId,
      title,
      event_date,
      start_time,
      end_time,
      description,
      category: normalizedCategory,
      reminder: reminderDate,
      notes,
      status:   normalizedStatus,
      completed: normalizedStatus === 'completed',
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
    const tasks  = await Task.find({ user_id: mongoose.Types.ObjectId(id) });
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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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


exports.completeTask = async (req, res) => {
  try {
    // 1) fetch the task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.completed) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // 2) mark it done
    task.completed = true;
    task.status    = 'completed';
    await task.save();

    // 3) compute EXP by category
    const CATEGORY_EXP = {
      school:   25,
      work:     20,
      sport:    15,
      hobby:    15,
      personal: 15,
    };
    const expAward     = CATEGORY_EXP[task.category] || 10;
    const LEVEL_THRESH = 100;

    // 4) load & update user points + levels
    const userBefore = await User.findById(task.user_id);
    let { points, level } = userBefore;
    points += expAward;

    let levelUps = 0;
    while (points >= LEVEL_THRESH) {
      points -= LEVEL_THRESH;
      level++;
      levelUps++;
    }

    const userAfter = await User.findByIdAndUpdate(
      task.user_id,
      { points, level },
      { new: true }
    );

    // 5) log the EXP award
    await ExpLog.create({
      user_id:  task.user_id,
      amount:   expAward,
      category: task.category,
      reason:   `Completed ${task.category}: ${task.title}`,
    });

    // 6) respond with EXP + new user stats
    res.json({
      message: 'Task completed, EXP awarded',
      exp:     expAward,
      levelUp: levelUps,
      user: {
        points: userAfter.points,
        level:  userAfter.level
      }
    });

  } catch (error) {
    console.error('completeTask error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};