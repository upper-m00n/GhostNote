'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import messages from '@/messages.json'

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the world of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore GhostNote. - where your identity remains a secret.</p>
      </section>

      <Carousel
      plugins={[AutoPlay({delay:2000})]}
      opts={{
        align: "start",
      }}
      className="w-full max-w-2xl "
    >
      <CarouselContent>
        {
          messages.map((message,index)=>(
            <CarouselItem key={index} className=" basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 px-2">
            <div className="p-1">
              <Card >
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </main>
  );
}
