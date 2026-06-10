const router = require("express").Router();
const Task = require("../models/Task");
const Activity = require("../models/Activity");

// Create Task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      projectId: req.body.projectId
    });

    await Activity.create({
      action: `Task "${task.title}" created`
    });

    res.json(task);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        assignedTo: req.body.assignedTo,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: req.body.status
      },
      {
        new: true
      }
    );

    await Activity.create({
      action: `Task "${task.title}" updated`
    });

    res.json(task);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Comment
router.post("/:id/comment", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    task.comments.push({
      author: req.body.author,
      message: req.body.message
    });

    await task.save();

    await Activity.create({
      action: `Comment added to "${task.title}"`
    });

    res.json(task);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    await Task.findByIdAndDelete(req.params.id);

    await Activity.create({
      action: `Task "${task.title}" deleted`
    });

    res.json({
      message: "Task Deleted"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;