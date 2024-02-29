const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = 5000; // You can change this to any port you prefer
app.use(cors());
// MongoDB Connection

const mongoURI = 'mongodb+srv://sheikhfaizaan608:vmRMDYIMo6Ah6JI7@cluster0.wmjgu40.mongodb.net/';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.log('MongoDB Connection Error: ', err);
});

// Models
const User = require('./models/User');

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password,cpassword } = req.body;
    // Create a new user
    const user = new User({ username, email, password,cpassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Password is correct
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get('/users',async (req,res) => {
    try {
        const users = await User.find({},'username email')
        res.status(200).json(users)
    }catch{
        res.status(500).json({error:'Internal server error'})
    }
})
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
