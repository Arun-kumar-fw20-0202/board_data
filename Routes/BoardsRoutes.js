const express = require("express");
const BoardRouter = express.Router();
const Board = require("../Models/board.model");
const Task = require("../Models/task.model");
const Subtask = require("../Models/subtask.model");

// GET all boards
BoardRouter.get("/boards", async (req, res) => {
  try {
    const boards = await Board.find().populate("tasks");
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new board
BoardRouter.post("/boards", async (req, res) => {
  const { name } = req.body;

  try {
    const board = new Board({ name });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tasks Routes

// GET all tasks
BoardRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("subtasks");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new task
BoardRouter.post("/tasks", async (req, res) => {
  const { title, description, status, boardId } = req.body;

  try {
    const newTask = new Task({ title, description, status });
    await newTask.save();

    const board = await Board.findById(boardId).populate("tasks");
    board.tasks.push(newTask._id);
    await board.save();

    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Subtasks Routes

// GET all subtasks
BoardRouter.get("/subtasks", async (req, res) => {
  try {
    const subtasks = await Subtask.find();
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new subtask
BoardRouter.post("/subtasks", async (req, res) => {
  const { title, isCompleted, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.push({ title, isCompleted });
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = BoardRouter;
