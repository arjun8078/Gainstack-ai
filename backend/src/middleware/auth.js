const jwt=require('jsonwebtoken');
const User=require('../models/User');

//middleware to protect routes
exports.protect=async(req,res,next)=>{
    try {
        
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')  ){
            token = req.headers.authorization.split(' ')[1];

        }

         if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Please login.'
      });
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    // Step 4: Get user from database using ID from token
    const user = await User.findById(decoded.id);

     if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found. Token invalid.'
      });
    }
     // Step 5: Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account deactivated'
      });
    }
    
    req.user=user;
    next();


    
  
    } catch (error) {
         console.error('❌ Auth middleware error:', error.message);
    
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      // Token is malformed or invalid
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      // Token is expired (older than 7 days)
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
    }
    
    // Other errors
    res.status(401).json({
      status: 'error',
      message: 'Not authorized'
    });
    }
}


//Check if user have specific role
exports.authorize=(...routes)=>{
  return(req,res,next)=>{
    if(!routes.includes(req.user.role)){
      return res.status(403).json({
        status: 'error',
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  }
}