
import {z} from 'zod'

export const verifySchema= z.object({
    code:z.string().length(6,{message:"verfication code must be 6 digit long"})
} 
)