import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request:Request){
    const { searchParams, pathname } = new URL(request.url);
  const segments = pathname.split("/");
  const messageId = segments[segments.length - 1];
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:400})
    }

    try {
        const updatedResult=await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )

        if(updatedResult.modifiedCount==0){
            return Response.json({
            success:false,
            message:"Message not found or already deleted"
        },{status:404})
        }
        
        return Response.json({
            success:true,
            message:"message deleted"
        },{status:200})

    } catch (error) {
        console.error("Error occured while deleting message",error)
        return Response.json({
            success:false,
            message:"Error occured while deleting message"
        },{status:400})
    }
}