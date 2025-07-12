import {resend} from '@/lib/resend'
import { ApiResponse } from '@/types/ApiResponse'
import VerificationEmail from '../../emails/verificationEmail';

export async function  sendVerificationEmail(
    email:string,
    username:string,
    verifyCode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'GhostNote | Verification code ',
            react: VerificationEmail({username, otp:verifyCode}),
        });

        return {success:true, message:" Verification Email sent successfully"}
        
    } catch (err) {
        console.error("Error sending verification email",err)
        return {success:false, message:"failed to send verification email"}
    }
}