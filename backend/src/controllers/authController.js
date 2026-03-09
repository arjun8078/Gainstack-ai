const User=require('../models/User');
const jwt=require('jsonwebtoken');

//helper function to generate JWT
const generateToken=(userId)=>{

    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN || '7d'}
    )
}

exports.register=async (req,res)=>{

    try {
        const {name,email,password}=req.body;

        //validate input
        if(!name || !email || !password){
            return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and password'
      });
        }

        //check if user already exist
        const existingUser=await User.findOne({email});
        if(existingUser){
             console.log('❌ Email already registered:', email);
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
        }

        //create new user
        const user=await User.create({name,email,password,avatar: `https://ui-avatars.com/api/?name=${name.replace(/\s+/g, '+')}&background=667eea&color=fff&size=200`})
         // What happens here:
    // 1. Mongoose validates data (checks required fields, etc.)
    // 2. Triggers pre('save') hook (hashes password!)
    // 3. Saves to MongoDB
    // 4. Returns saved user object with _id


    //Now genereate token for this user

    const token=generateToken(user._id);

    res.status(201).json({
        status:'Success',
        token,
        data:{
            user:{
                id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
            }
        }
    })
    } catch (error) {
        // Error handling
    console.error('❌ Register error:', error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      // Example: "Name is required", "Email is invalid"
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages[0]  // Send first error message
      });
    }
    
    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
    }

}


exports.login=async(req,res)=>{

    try {
          const {email,password}=req.body;

          if(!email || !password){
            return res.status(400).json({
                status:'error',
                message:'Please provide email and password'
            })
          }

          const user=await User.findOne({email}).select('+password');

          if(!user){
             return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
          }

          if(!user.isActive){
            return res.status(403).json({
                status:'error',
                message:'Your account is deactivated. Please contact support.'
            })
          }

          const isPasswordValid=await user.comparePassword(password);

          if(!isPasswordValid){
             return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
          }

           console.log('✅ Login successful:', email);
    const token = generateToken(user._id);
    
    // Step 7: Send success response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
        
    } catch (error) {
        console.error('❌ Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
    }

  

}

exports.getMe=async (req,res)=>{
  try {
    // req.user is set by auth middleware (we'll create this next!)
    // The middleware extracts user ID from JWT token
    // and attaches it to req.user

    const user=await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

      res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
        console.error('❌ Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching user'
    });

  }
}