const mongoose=require('mongoose');

const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        minlength:[2,'Name must be at least 2 characters'],
        maxlength:[50,'Name must be at most 50characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least 6 characters'],
        select:false
    },
    avatar:{
        type:String,
        default:'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=200'
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


// userSchema.pre('save',async function(next){
//     if(!this.isModified('password')){
//         return next();
//     }

//     try {
//         //Generate salt
//         const salt=await bcrypt.genSalt(10);

//         this.password=await bcrypt.hash(this.password,salt);
//         next();
//     } catch (error) {
//         next(error);
        
//     }
    
// })
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword=async function(candidatePassword){
    try {
        return await bcrypt.compare(candidatePassword,this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
    
}

userSchema.methods.toJSON=function(){
    const user=this.toObject();
    delete user.password;
    delete user.__v;
    return user;
}

const User=mongoose.model('User',userSchema);
module.exports=User;