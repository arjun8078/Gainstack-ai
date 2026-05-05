const express=require('express');
require('dotenv').config(); 
const connectDB=require('./src/config/database')
const cors=require('cors');

const app=express();

connectDB();

const corsOptions = {
  origin: [
    'http://localhost:4200',
    'http://gainstack-frontend.s3-website-us-east-1.amazonaws.com',  // Your S3 URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());

// app.get('/hello',(req,res)=>{
//     res.send('Hello world');
// })
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to TaskFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      workspaces: '/api/workspaces'
    }
  });
});


app.use('/api/auth',require('./src/routes/auth'));
app.use('/api/workouts',require('./src/routes/workoutRoutes'))
app.use('/api/ai',require('./src/routes/aiRoutes'))


app.listen(5000,()=>{
    console.log("Api is running on port 5000");
    
})