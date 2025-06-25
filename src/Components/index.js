// server.js
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './User.js';
import Performance from './Performance.js';
dotenv.config();
import Admin from './Admin.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://d2quiz.netlify.app',
  // origin: 'http://localhost:5173',
    credentials: true,
  };

app.use(cors(corsOptions));
app.use(cookieParser());

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
 
  if (!token) return res.status(401).send("fail");
  try {
    
    const decoded = jwt.verify(token, "divyansh");
   console.log(decoded)
    req.user = decoded;
   
    next();
  } catch (error) {
   
    res.send("fail");
  }
};
app.get('/history', jwtMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).populate('performance');
console.log(user)
    if (!user) return res.status(404).json({ error: 'User not found' });
console.log(user.performance)
    res.json(user.performance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/saveperformance', jwtMiddleware, async (req, res) => {
  const { score, total } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ username: req.user.username });
    

    if (!user) return res.status(404).json({ error: 'User not found' });

    const performance = new Performance({ score, total });
    const saved = await performance.save();

    user.performance.push(saved._id);
    const y=await user.save();

    res.status(200).json({ message: 'Performance saved and linked to user!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/adminlogin', async (req, res) => {
  const { admin, password } = req.body;

  try {
    const foundAdmin = await Admin.findOne({ username: admin });

    if (!foundAdmin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    if (foundAdmin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token2 = jwt.sign(
      { adminId: foundAdmin._id, username: foundAdmin.username },
      "divyansh",
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'success',
      adminId: foundAdmin._id,
      username: foundAdmin.username,
      token2 // add token2 to the response
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post("/login", async (req, res) => {

  const { username, password } = req.body;
 
  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: "Invalid username or password" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid username or password" });
    const token = jwt.sign({ username }, "divyansh", { expiresIn: "1h" });
  
    
    res.json({ message: "success", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




  
 // Backend Example using Express.js
app.get('/getusername',jwtMiddleware, (req, res) => {


    // Assuming the decoded token has the username
     res.json({ username: req.user.username });
 
});
app.get("/api/users",async(req,res)=>{

    try {
      const users = await User.find().populate('performance').exec();
      res.json(users);  // Send the data to the frontend
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Failed to fetch users' });
    }})


  

const jwtMiddleware2 = (req, res, next) => {
  const token = req.cookies?.token2 || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const decoded = jwt.verify(token, "divyansh");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("fail");
  }
};

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.send("success");
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// GET /available-donations


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', adminId: admin._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all available food





// let y=async()=>{
//   const admin = new Admin({ username: "divyansh2", password: "quiz" });
//     const result = await admin.save();
//     console.log(result)

// }
// y()
app.get('/api/random-question', async (req, res) => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = response.data.results[0];
  
      const allOptions = [...data.incorrect_answers, data.correct_answer];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
  
      const formattedQuestion = {
        _id: Date.now().toString(), // Temporary ID for tracking
        text: data.question,
        options: shuffledOptions,
        correctAnswer: data.correct_answer
      };
  
      res.json(formattedQuestion);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch question from external API.' });
    }
  });

// mongoose.connect(process.env.VITE_URL)
// mongoose.connect("mongodb://localhost:27017/quiz")

mongoose.connect(process.env.VITE_B_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error", err));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});