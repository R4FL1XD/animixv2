"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/lib/types';
import { PlayCircle, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const router = useRouter();
  
  const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;

  // This handles recommended episodes which have episodeId
  if (anime.episodeId) {
      // The API returns incorrect episodeId for recommended items, so we extract it from href.
      const correctEpisodeId = anime.href.split('/').pop();
      if (!correctEpisodeId) {
          // Fallback to anime detail page if we can't parse for some reason
          return <AnimeCardLink anime={anime} href={`/anime/${anime.animeId}`} />;
      }
      return <AnimeCardLink anime={anime} href={`/episode/${correctEpisodeId}`} />;
  }
  
  // For anything else, go to the anime detail page.
  const targetId = anime.animeId;
  if (!targetId) {
      return null;
  };

  return <AnimeCardLink anime={anime} href={`/anime/${targetId}`} />;
}

function AnimeCardLink({ anime, href }: { anime: Anime; href: string }) {
    const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;
    return (
        <Link href={href} className="group block outline-none cursor-pointer" tabIndex={0}>
        <Card className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:-translate-y-1 focus-visible:shadow-primary/20 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 ring-offset-background">
            <CardContent className="p-0 relative">
            <Image
                src={anime.poster}
                alt={anime.title}
                width={300}
                height={450}
                className="object-cover w-full h-auto aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
                unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-black/40">
                <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-0 left-0 p-3 w-full">
                <h3 className="font-headline text-base font-bold text-white drop-shadow-md leading-tight truncate">
                {anime.title}
                </h3>
            </div>
            {anime.episodes && (
                <Badge variant="destructive" className="absolute top-2 right-2 bg-accent text-accent-foreground shadow-lg">
                    Ep {anime.episodes}
                </Badge>
            )}
            {anime.type && !anime.episodes && (
                <Badge variant="secondary" className="absolute top-2 left-2 shadow-lg">
                    {anime.type}
                </Badge>
            )}
            </CardContent>
            <CardFooter className="p-2.5 bg-card/80 text-xs text-muted-foreground border-t flex justify-between items-center">
                {(anime.releasedOn || anime.releaseDate || anime.status) && (
                    <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{anime.releasedOn || anime.releaseDate || anime.status}</span>
                    </div>
                )}
                {scoreValue && (
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>{scoreValue}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
        </Link>
    );
}