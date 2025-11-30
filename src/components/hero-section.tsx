import Image from 'next/image';
import Link from 'next/link';
import type { Anime } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';

interface HeroSectionProps {
  anime: Anime;
}

export default function HeroSection({ anime }: HeroSectionProps) {
  if (!anime) return null;

  // Construct the episode ID from the anime ID and episode number
  const latestEpisodeId = anime.episodes ? `${anime.animeId}-episode-${anime.episodes}` : `${anime.animeId}`;

  // If there's an episode number, link to the episode page. Otherwise, link to the anime page.
  const linkHref = anime.episodes ? `/episode/${latestEpisodeId}` : `/anime/${anime.animeId}`;


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
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full px-8">
              <Link href={linkHref}>
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play Now
              </Link>
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
