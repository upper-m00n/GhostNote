import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";




const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){

    if(request.method !== 'GET'){
        return Response.json({
            success:false,
            message:"Only GET method is allowed"
        },{status:405})
    }


    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams)

        if(!result.success){
            const usernameErrors= result.error.format()
            .username?._errors || []

            return Response.json({
                success:false,
                message:usernameErrors
            },{status:400})
        }

        const {username}= result.data

        const existingVerifiedUser= await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        return Response.json({
                success:true,
                message:"Username is available"
            },{status:400})



    } catch (err) {
        console.error("Error checking username",err)

        return Response.json({
            success: false,
            message: "Error checking username"
        },{status:500})
    }
}