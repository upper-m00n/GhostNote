'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { message } from '@/schemas/messageSchema'
import * as z from 'zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from '@/components/ui/skeleton'

function Page() {
  const params = useParams<{ username: string }>();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating,setIsGenerating]= useState(false);

  const form = useForm<z.infer<typeof message>>({
    resolver: zodResolver(message)
  });

  const { setValue } = form;

  const onSubmit = async (data: z.infer<typeof message>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-messages`, {
        username: params.username,
        content: data.content
      });
      toast(response.data.message);
      form.reset(); // Clear input after sending
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
        setIsGenerating(true);
      const response = await axios.post<{ output: string }>('/api/suggest-messages');
      toast('Suggestions generated');
      const output = response.data.output;
      const parsedSuggestions = output.split('||').map(q => q.trim()).filter(Boolean);
      setSuggestions(parsedSuggestions);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || 'Failed to generate suggestions.');
    }
    finally{
        setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (msg: string) => {
    setValue("content", msg);
    toast("Message added to input");
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-10'>
      <div className='w-full max-w-2xl md:max-w-3xl lg:max-w-4xl'>
        <h1 className='text-3xl font-bold mb-5'>Get your message board</h1>
        <Button className='mb-5'>Create Your Account</Button>
        <Separator className='mb-5'/>
        <h1 className='text-3xl font-bold mb-5'>Public Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send anonymous message to @{params.username}</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your anonymous message..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </Form>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4">
          <Button variant="outline" className='bg-black text-white' onClick={fetchSuggestions}>
            Suggest Messages
          </Button>

          {isGenerating &&(
             <Card className='space-y-6'>
              <CardHeader className='mb-0'>
                <CardTitle className='mb-0'>Generating Suggestions.</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 mb-0">
                {[1,2,3].map((_,idx) => (
                  <div key={idx}className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    </div>
                ))}
              </CardContent>
            </Card>
            
          )}


          {!isGenerating && suggestions.length > 0 && (
            <Card className='space-y-6'>
              <CardHeader className='mb-0'>
                <CardTitle className='mb-0'>Suggested Messages</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 mb-0">
                {suggestions.map((msg, idx) => (
                  <Button
                    variant="secondary"
                    key={idx}
                    className="text-left justify-start whitespace-normal mt-0"
                    onClick={() => handleSuggestionClick(msg)}
                  >
                    {msg}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    </div>
  );
}

export default Page;
