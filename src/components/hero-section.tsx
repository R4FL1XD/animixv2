"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Anime } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { getAnimeDetails } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";


interface HeroSectionProps {
  animes: Anime[];
}

export default function HeroSection({ animes }: HeroSectionProps) {
  const router = useRouter();
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

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
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full"
    >
      <CarouselContent>
        {animes.map((anime) => (
          <CarouselItem key={anime.animeId}>
            <section className="relative h-[60vh] md:h-[85vh] w-full">
              <div className="absolute inset-0">
                <Image
                  src={anime.poster}
                  alt={`Poster for ${anime.title}`}
                  fill
                  className="object-cover object-center"
                  priority
                  unoptimized
                />
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
    </Carousel>
  );
}
