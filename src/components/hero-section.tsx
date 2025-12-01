"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Anime } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Info, Loader2 } from 'lucide-react';
import { getAnimeDetails } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeroSectionProps {
  anime: Anime;
}

export default function HeroSection({ anime }: HeroSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!anime) return null;

  const handlePlayClick = async () => {
    setIsLoading(true);
    const animeDetails = await getAnimeDetails(anime.animeId);
    if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
      const latestEpisodeId = animeDetails.data.episodeList[0].episodeId;
      router.push(`/episode/${latestEpisodeId}`);
    } else {
      // Fallback or show an error
      router.push(`/anime/${anime.animeId}`);
    }
    setIsLoading(false);
  };

  return (
    <section className="relative h-[50vh] md:h-[70vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={anime.poster}
          alt={`Poster for ${anime.title}`}
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>
      
      <div className="container relative h-full flex flex-col justify-center md:justify-end pb-12 md:pb-24">
        <div className="max-w-lg text-foreground">
          <p className='text-primary font-semibold mb-2 uppercase tracking-wider text-sm'>New Episode</p>
          <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg leading-tight">
            {anime.title}
          </h1>
          {anime.releasedOn && (
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              Episode {anime.episodes} • {anime.releasedOn}.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={handlePlayClick} disabled={isLoading} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full px-8">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
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
  );
}
