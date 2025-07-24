import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userShcema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        minlength:[6,"The Minimum length of the Gmail."]
        
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[8,"Password Mst atleast 8 Characters"],
        select:false
    }

})

userShcema.statics.hashPassword = async function (password) {

    return await bcrypt.hash(password,10);
    
}

userShcema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userShcema.methods.JWt = function(){
    return jwt.sign({
        id_no:this._id,
        email:this.email
    },
    process.env.JWT_SECRET,
    { expiresIn:"1d"}
    );
}

const userModel = mongoose.model('user',userShcema);

export default userModel;