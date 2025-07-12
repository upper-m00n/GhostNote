import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";




export async function POST(request :  Request){
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User=session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId=user._id;

    const {acceptMessages}=await request.json()

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true});

        if(!updatedUser){
            console.log("Failedto update user")
            return Response.json({
                success:false,
                message:"failed to update user"
            },{status:401})
        }

        return Response.json({
                success:true,
                message:"Message acceptance status updated",
                updatedUser
            },{status:200})
       
        
    } catch (err) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:500})
    }

}

export async function GET(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions);
    const user:User= session?.user as User;
    const userId= user?._id;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401}
        )
    }

    try {

        const user= await UserModel.findById(userId)

        if(!user){
            return Response.json({
                success:false,
                message:"failed to find the user"
            },{status:401})
        }

        return Response.json({
            success:true,
            isAcceptingMessages: user.isAcceptingMessage

        },{status:200})
        
    } catch (err) {
        console.error("Failed to fetch accepting messages status",err)
        return Response.json({
                success:false,
                message:"failed to fetch user accepting messages statusr"
            },{status:500})
    }


}