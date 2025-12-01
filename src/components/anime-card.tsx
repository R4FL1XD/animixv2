"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/lib/types';
import { PlayCircle, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAnimeDetails } from '@/lib/api';

interface AnimeCardProps {
  anime: Anime;
}

function AnimeCard({ anime }: AnimeCardProps) {
    const router = useRouter();
    const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;
    
    const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      // For recommended episodes, the correct episodeId is in the href.
      if (anime.episodeId && anime.href) {
        const id = anime.href.split('/').pop();
        if(id) {
          router.push(`/episode/${id}`);
        }
        return;
      }

      // For regular anime, find the latest episode and navigate to it.
      if (anime.animeId) {
          try {
              const animeDetails = await getAnimeDetails(anime.animeId);
              if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
                  router.push(`/episode/${animeDetails.data.episodeList[0].episodeId}`);
              } else {
                  // Fallback to anime detail page if no episodes are found
                  router.push(`/anime/${anime.animeId}`);
              }
          } catch (error) {
              console.error("Failed to get anime details for navigation:", error);
              // Fallback in case of API error
              router.push(`/anime/${anime.animeId}`);
          }
      }
    };

    return (
        <div onClick={handleClick} className="group block outline-none cursor-pointer w-full h-full" aria-label={`Play ${anime.title}`}>
            <Card className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:-translate-y-1 group-focus-visible:shadow-primary/20 group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary ring-offset-2 ring-offset-background">
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

                    <div className="absolute inset-0 top-auto h-2/3 bg-gradient-to-t from-black/90 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {anime.genreList && anime.genreList.length > 0 && (
                             <div className="flex flex-wrap gap-1.5 mb-2">
                                {anime.genreList.slice(0, 3).map((genre) => (
                                    <Badge key={genre.genreId} variant="secondary" className="text-xs backdrop-blur-sm bg-white/10 border-white/20">
                                        {genre.title}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <h3 className="font-headline text-base font-bold text-white drop-shadow-md leading-tight truncate">
                            {anime.title}
                        </h3>
                    </div>

                    <div className="absolute bottom-0 left-0 p-3 w-full group-hover:opacity-0 transition-opacity duration-300">
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
        </div>
    );
}

export default AnimeCard;
