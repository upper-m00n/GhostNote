import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}

export interface UserWithStringId extends Omit<User, '_id'> {
  _id: string;
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required:[true, "Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use a valid email address"]
    },
    password:{
        type: String,
        required:[true, "Passwrord is required"],
    },
    verifyCode:{
        type: String,
        required:[true, "Verification Code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true, "VerifyCodeExpiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel