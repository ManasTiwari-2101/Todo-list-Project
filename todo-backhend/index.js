require('dotenv').config();
const Task = require('./models/Task');
const cors = require('cors');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
const auth = require('./middleware/auth');

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const express=require('express');
const app=express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const port=PORT;
app.use(express.json());

app.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/tasks', auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      title,
      user: req.userId
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },   // 🔐 ownership check
      { completed, title },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.userId   // 🔐 ownership check
    });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});
