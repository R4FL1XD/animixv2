"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Anime } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { getAnimeDetails } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

interface HeroSectionProps {
  animes: Anime[];
}

export default function HeroSection({ animes }: HeroSectionProps) {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)
 
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])


  if (!animes || animes.length === 0) return null;

  const handlePlayClick = async (animeId: string) => {
    try {
        const animeDetails = await getAnimeDetails(animeId);
        if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
            const latestEpisodeId = animeDetails.data.episodeList[0].episodeId;
            router.push(`/episode/${latestEpisodeId}`);
        } else {
            router.push(`/anime/${animeId}`);
        }
    } catch (error) {
        console.error("Failed to get anime details:", error);
        router.push(`/anime/${animeId}`); // Fallback
    }
  };

  return (
    <Carousel 
      setApi={setApi}
      opts={{ loop: true }}
      className="w-full"
    >
      <CarouselContent>
        {animes.map((anime) => (
          <CarouselItem key={anime.animeId}>
            <section className="relative h-[60vh] md:h-[85vh] w-full">
              <div className="absolute inset-0">
                {anime.poster ? (
                  <Image
                    src={anime.poster}
                    alt={`Poster for ${anime.title}`}
                    fill
                    className="object-cover object-center"
                    priority
                    unoptimized
                  />
                ) : <div className='w-full h-full bg-muted'/>}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
              </div>
              
              <div className="container relative h-full flex flex-col justify-center md:justify-end pb-12 md:pb-24">
                <div className="max-w-xl text-foreground">
                  <p className='text-primary font-semibold mb-2 uppercase tracking-wider text-sm'>
                    {anime.type === 'Movie' ? 'New Movie' : 'New Episode'}
                  </p>
                  <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg leading-tight">
                    {anime.title}
                  </h1>
                  {anime.episodes && (
                    <p className="mt-4 text-lg text-muted-foreground max-w-prose">
                      Episode {anime.episodes}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button onClick={() => handlePlayClick(anime.animeId)} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full px-8">
                        <Play className="mr-2 h-5 w-5 fill-current" />
                      Play Now
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="shadow-lg rounded-full px-8">
                      <Link href={`/anime/${anime.animeId}`}>
                        <Info className="mr-2 h-5 w-5" />
                        More Info
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {animes.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current ? 'w-4 bg-primary' : 'bg-muted/50'
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
}
