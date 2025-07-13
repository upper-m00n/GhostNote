'use-client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import useForm from 'react-hook-form'
import { toast } from "sonner";
import * as z from "zod"


const page = ()=> {
    const [username,setUsername]= useState('');
    const [email,setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [isLogging, setIsLogging]= useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
            resolver: zodResolver(signInSchema),
            defaultValues:{
                email:'',
                password:'',
            }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>)=>{

        const result=await signIn('credentials',{
            redirect:false,
            email : data.email,
            password: data.password
        })

        if(result?.error){
            toast("Incorrect username or password.")
        }
        
        if(result?.url){
            router.replace('/dashboard')
        }


    }

    return(
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Sign In to GhostNote</h1>
                    <p className='mb-4'>Sign In to start your Ghost text Adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email/Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email/Username" {...field}
                                     />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field}
                                     />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>Sign In
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Don't have any account?{' '}
                        <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default page;