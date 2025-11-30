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

  return (
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
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      
      <div className="container relative h-full flex flex-col justify-end pb-12 md:pb-24">
        <div className="max-w-lg text-foreground">
          <p className='text-accent font-semibold mb-2'>New Episode</p>
          <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">
            {anime.title}
          </h1>
          {anime.releasedOn && (
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              Episode {anime.episodes} released {anime.releasedOn}.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link href={`/anime/${anime.animeId}`}>
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
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
