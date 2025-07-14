'use client'

import React, { useEffect, useState } from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import Link from 'next/link'
import * as z from "zod"
import axios, { AxiosError } from "axios"
import {useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Loader2} from "lucide-react"

  

const Page= ()=>{
    const [username,setUsername]= useState('')
    const [usernameMessage, setUsernameMessage]= useState('')
    const [isCheckingUsername,setIsChekcingUsername]= useState(false)
    const [isSubmitting, setIsSubmitting]= useState(false)

    const debounced=useDebounceCallback(setUsername,500)
    const router = useRouter()

    //zoddd implementationn
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:'',
        }
    })

    useEffect(()=>{
        const checkUsernameUnique = async()=>{
            if(username){
                setIsChekcingUsername(true);
                setUsernameMessage('')

                try {
                    const res= await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(res.data.message)
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")

                }
                finally{
                    setIsChekcingUsername(false);
                }
            }
        }
        checkUsernameUnique()
    },[username])

    const onSubmit = async (data : z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true);
        try {
            const res=await axios.post<ApiResponse >('/api/sign-up',data)
            toast(res.data.message)

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (err) {
            console.error("error in signup of user",err)

            const axiosError = err as AxiosError<ApiResponse>;

            const errorMessage= axiosError.response?.data.message;
            toast(errorMessage);
            setIsSubmitting(false)
        }
    }


    return(
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-bold tracking-tight lg:text-5xl mb-6'>Join GhostNote</h1>
                    <p className='mb-4'>Sign up to start your Ghost text Adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field}
                                        onChange={(e)=>{
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                     />
                                     </FormControl>
                                     {isCheckingUsername && <Loader2 className='animate-spin'/>}
                                     <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500':'text-red-500'} `}>{usernameMessage}</p>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field}
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
                        <Button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                     <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please Wait
                                    </>
                                ) : ('SignUp')
                            }
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page

