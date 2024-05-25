import mongoose, {Schema, Document} from "mongoose" ;

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    }

}) 

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    messages:[];
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        requierd:true,
        unique:true,
        trim:true,
        
    },
    email:{
        type:String,
        requierd:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        requierd:true,
        unique:true,
    },
    verifyCode:{
        type:String,
        requierd:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
        default:Date.now
    },
    isVerified:{
        type: boolean,
        required:true,
        
    },
    messages:[MessageSchema]
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;

