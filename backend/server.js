const express=require('express');
require('dotenv').config(); 
const connectDB=require('./src/config/database')
const cors=require('cors');
const redisService=require('./services/redisService');

const app=express();


async function startServer() {
  try {
   
    await connectDB();
    redisService.connect().then(() => {
      console.log('✅ Redis connected');
    }).catch((err) => {
      console.warn('⚠️ Redis failed, continuing without cache:', err.message);
    });

    const corsOptions = {
      origin: [
        'http://localhost:4200',
        'http://gainstack-frontend.s3-website-us-east-1.amazonaws.com',
        'https://dmtmj3flxt5g7.cloudfront.net'
      ],
      credentials: true,
      optionsSuccessStatus: 200
    };

    app.use(cors(corsOptions));
    app.use(express.json());

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

    app.use('/api/auth', require('./src/routes/auth'));
    app.use('/api/workouts', require('./src/routes/workoutRoutes'))
    app.use('/api/ai', require('./src/routes/aiRoutes'))

    app.listen(process.env.PORT || 5000, () => {
      console.log("✅ Server running on port " + (process.env.PORT || 5000));
      console.log("✅ MongoDB connected");
      console.log("✅ Redis connected");
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}


startServer();