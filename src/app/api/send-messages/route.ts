import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";



export async function POST(request:Request){
    await dbConnect();

    const {username, content}= await request.json()

    try {
        const user=await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success:false,
                message:"cannot find user"
            },{status:404})
        }

        //is user accepting the messages

        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User not accepting messages"
            },{status:403})
        }

        const newMessage = {content, createdAt:new Date()}

        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json({
                success:true,
                message:"Message is sent"
            },{status:200})
         
    } catch (err) {
        console.error("Cannot send the message",err);
        return Response.json({
                success:false,
                message:"cannot send the message"
        },{status:500})
    }
}