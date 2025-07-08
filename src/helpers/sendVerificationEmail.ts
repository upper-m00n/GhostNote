import {resend} from '@/lib/resend'
import { ApiResponse } from '@/types/ApiResponse'
import verificationEmail from "../../emails/verificationEmail"
import VerificationEmail from '../../emails/verificationEmail';

export async function  sendVerificationEmail(email:string,
    username:string,
    verifyCode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Anonymsg | Verification code ',
            react: VerificationEmail({username, otp:verifyCode}),
        });

        return {success:true, message:"successfull"}
        
    } catch (err) {
        console.error("Error sending verification email",err)
        return {success:false, message:"failed to send verification email"}
    }
}