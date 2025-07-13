'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {message} from '@/schemas/messageSchema'
import * as z from 'zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function Page() {
    const params = useParams<{username:string}>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof message>>({
        resolver:zodResolver(message)
    })

    const onSubmit = async(data: z.infer<typeof message>)=>{
        setIsSubmitting(true);

        try {
            const response=await axios.post<ApiResponse>(`/api/send-messages`,{
                username:params.username,
                content:data.content
            })
            toast(response.data.message);
        } catch (error) {
            console.error("error in signup of user",error)
            
            const axiosError = error as AxiosError<ApiResponse>;

            let errorMessage= axiosError.response?.data.message;
            toast(errorMessage);

            setIsSubmitting(false)
        }
    }

    const fetchSuggestions = async()=>{
        try {
            await axios.post('/api/')
        } catch (error) {
            
        }
    }

    return (
        <div className='min-h-screen flex flex-col justify-center p-8'>
            <div className='mb-10'>
                <h1 className='text-3xl font-bold mb-5'>Public Profile Link</h1>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                        <FormLabel>send anonymous message to @{params.username}</FormLabel>
                        <FormControl>
                            <Input placeholder="write your anonymous message here" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                        )}
                    />
            <Button type="submit">Send</Button>
        </form>
        </Form>
            </div>
            <Separator/>

            <Button>Suggest Messages</Button>


        </div>
    )
}

export default Page
