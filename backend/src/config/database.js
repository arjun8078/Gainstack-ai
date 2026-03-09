const mongoose=require('mongoose');


const connectDB=async()=>{
    try {

        const conn=await mongoose.connect(process.env.MONGODB_URI)

        console.log("Mongodb is connected");
        
        
    } catch (error) {

        console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit if can't connect
        
    }
}

module.exports=connectDB;