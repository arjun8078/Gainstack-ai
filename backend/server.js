const express=require('express');
require('dotenv').config(); 
const connectDB=require('./src/config/database')
const cors=require('cors');

const app=express();

connectDB();

app.use(cors());


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


app.listen(5000,()=>{
    console.log("Api is running on port 5000");
    
})