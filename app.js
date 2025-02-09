// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for ToDos
let todos = [];
let currentId = 1;

// Helper function to find a ToDo by ID
const findTodoById = (id) => todos.find(todo => todo.id === id);

// CRUD Operations

// Create a new ToDo
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newTodo = {
        id: currentId++,
        title,
        description,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Read all ToDos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Read a specific ToDo by ID
app.get('/todos/:id', (req, res) => {
    const todo = findTodoById(parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ error: 'ToDo not found' });
    }
    res.json(todo);
});

// Update a ToDo by ID
app.put('/todos/:id', (req, res) => {
    const todo = findTodoById(parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ error: 'ToDo not found' });
    }

    const { title, description, completed } = req.body;
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

// Delete a ToDo by ID
app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'ToDo not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`ToDo app listening at http://localhost:${port}`);
});