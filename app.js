const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); 
const app = express();
const multer = require('multer');
const PORT = 5000; // You can change this to any port you prefer
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// MongoDB Connection
// mongodb+srv://sheikhfaizaan608:<password>@cluster0.wmjgu40.mongodb.net/
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
const Books = require('./models/Books')
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Uploads will be stored in the "uploads/" directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name will be timestamp + original name
  }
});

const upload = multer({ storage: storage });
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
        const users = await User.find({},'username email password')
        res.status(200).json(users)
    }catch{
        res.status(500).json({error:'Internal server error'})
    }
})
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
///books///
app.post('/addbooks', upload.single('images'),async (req, res) => {
  try {
    const { bookname, author, description,category,status,price } = req.body;
    console.log(req.body);
    console.log(req.file);
    // const file = req.file.path;

    // Create a new user
    const book = new Books({ bookname, author, description,category,status,price,images:req.file.path});
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  
});
app.put('/books/:id', upload.single('images'), async (req, res) => {
  const bookId = req.params.id;
  const updateFields = req.body;

  try {
    let updatedBook;
    if (req.file) {
      // If a file is uploaded, update the 'images' field in the updateFields
      updateFields.images = req.file.path;
    }

    // Find and update the book with the provided ID
    updatedBook = await Books.findByIdAndUpdate(bookId, updateFields, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(201).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/books',async (req,res) => {
  try {
      const users = await Books.find({},'bookname author description category status price images')
      res.status(200).json(users)
  }catch{
      res.status(500).json({error:'Internal server error'})
  }
})
app.get('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id; 
    const book = await Books.findById(bookId); 

    if (!book) {
     
      return res.status(404).json({ error: 'Book not found' });
    }

    
    res.status(200).json(book);
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete Book API (DELETE)
app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
