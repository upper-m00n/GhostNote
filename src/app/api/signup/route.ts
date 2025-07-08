import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod/v4";
import { message } from "@/schemas/messageSchema";

export async function POST(request : Request){
    await dbConnect()

    try {
        const {username, email, password}=await request.json()

        const existingUserVerifiedByUsername =await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message :"Username is alread taken"
            }, {status:400})
        }

        const existingUserVerifiedByEmail =await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "user already exist with this email"
                },{status:400})
            }
            else{
                const hashed = await bcrypt.hash(password,10)

                existingUserVerifiedByEmail.password = hashed
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry  =new Date(Date.now() + 3600000);

                await existingUserVerifiedByEmail.save();
            }
                
        }

        else{
            const hashed= await bcrypt.hash(password,10)
            const expireryDate = new Date()
            expireryDate.setHours(expireryDate.getHours() + 1)

            const newUser = new UserModel({
                    username,
                    email,
                    password: hashed,
                    verifyCode,
                    verifyCodeExpiry:expireryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages:[]
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status:500})
        } 

        return Response.json({
                success: true,
                message :"User Registered Successfully, please verify your email"
        }, {status:201})
    } 
    catch (err) {
        console.error("Error registering user",err)
        return Response.json({
            success:false,
            message:"Error registering user"
        },{status:500})
    }
}
