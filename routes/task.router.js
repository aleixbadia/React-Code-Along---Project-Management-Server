//      routes/task-routes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/project.model");
const Task = require("../models/task.model");

// POST '/api/tasks'      => to create a new task
router.post("/tasks", (req, res) => {
  const { title, description, projectId } = req.body;

  Task.create({
    title,
    description,
    project: projectId,
  })
    .then((newTaskDocument) => {
      Project.findByIdAndUpdate(
        projectId,
        {
          $push: { tasks: newTaskDocument._id },
        },
        { new: true }
      )
        .then((updatedProject) => {
          res.status(201).json(updatedProject);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET '/api/tasks/:id'   => to retrieve a specific task
router.get("/tasks/:id", (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400) //  Bad Request
      .json({ message: "Specified id is not valid" });
    return;
  }

  Task.findById(id)
    .then((foundTask) => {
      res.status(200).json(foundTask); // OK
    })
    .catch((err) => {
      res.status(500).json(err); // Internal Server Error
    });
});

// PUT '/api/tasks/:id'    => to update a specific task
router.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(id, { title, description }, { new: true })
    .then((updatedTask) => {
      res.status(200).json(updatedTask);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE '/api/tasks/:id'     => to delete a specific task
router.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndRemove(id)
    .then(() => {
      res.status(202).send(`Document ${id} was removed successfully.`);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
