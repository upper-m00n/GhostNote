'use client'

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import {User} from 'next-auth'




const page =()=>{
    const[messages, setMessages]= useState<Message[]>([]);
    const [isLoading, setIsLoading]= useState(false)
    const [isSwitchLoading, setIsSwitchLoading]=useState(false)

    const handleDelteMessage = (messageId: string) =>{
        setMessages(messages.filter((message)=> message._id !== messageId))

    }

    const {data:session}= useSession()

    const form = useForm({
        resolver:zodResolver(acceptMessageSchema),
    })

    const {register, watch, setValue} = form;

    const acceptMessages = watch('acceptMessage')

    const fetchAcceptMessage = useCallback(async ()=>{
        setIsSwitchLoading(true);

        try {
            const response= await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessage', response.data.isAcceptingMessages as boolean)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message)
        }
        finally{
            setIsSwitchLoading(false)
        }

    },[setValue])

    const fetchMessages= useCallback(async(refresh: boolean = false)=> {
        setIsLoading(true);
        setIsSwitchLoading(false);

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])

            if(refresh){
                toast('Showing latest messages')
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message)
        }

        finally{
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    },[setIsLoading, setMessages])

    useEffect(()=>{
        if(!session || !session.user) return
        
        fetchMessages()
        fetchAcceptMessage()

    },[session, setValue, fetchAcceptMessage, fetchMessages])

    // handle switch change

    const handleSwitchChange = async()=>{
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })

            setValue('acceptMessage', !acceptMessages)

            toast(response.data.message)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message)
        }
    }

    const {username}=session?.user as User
    
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl= `${baseUrl}/u/${username}`
    const copyToClipboard= ()=>{
        navigator.clipboard.writeText(profileUrl)
        toast('Url copied')
    }

    if(!session || !session.user){
        return <div>Please login</div>
    }

    return(
        <div>

        </div>
    )

}

export default page;