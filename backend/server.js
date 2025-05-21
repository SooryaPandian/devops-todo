// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Connect to MongoDB
mongoose.connect("mongodb+srv://smartindiahackathon24:soorya@cluster0.aktmx.mongodb.net/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  link: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// API routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.status(201).json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '../frontend') });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
