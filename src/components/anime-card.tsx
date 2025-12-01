"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/lib/types';
import { PlayCircle, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAnimeDetails } from '@/lib/api';
import Link from 'next/link';
import React from 'react';

interface AnimeCardProps {
  anime: Anime;
}

// Sub-component to handle the click logic and navigation
function AnimeCardLink({ anime, children }: { anime: Anime, children: React.ReactNode }) {
    const router = useRouter();

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Prevent default link behavior to handle navigation manually
        e.preventDefault();

        // This handles recommended episodes, which have a different data structure
        if (anime.episodeId) {
            const correctEpisodeId = anime.href.split('/').pop();
            if (correctEpisodeId) {
                router.push(`/episode/${correctEpisodeId}`);
            }
            return;
        }

        // This handles regular anime cards
        if (anime.animeId) {
            try {
                const animeDetails = await getAnimeDetails(anime.animeId);
                // Navigate to the latest episode if it exists
                if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
                    const latestEpisodeId = animeDetails.data.episodeList[0].episodeId;
                    router.push(`/episode/${latestEpisodeId}`);
                } else {
                    // Fallback to anime detail page if no episodes are found
                    router.push(`/anime/${anime.animeId}`);
                }
            } catch (error) {
                console.error("Failed to get details for navigation", error);
                // Fallback navigation if API fails
                router.push(`/anime/${anime.animeId}`);
            }
        }
    };
    
    // The href is a fallback for right-click/middle-click functionality
    const fallbackHref = anime.episodeId 
        ? `/episode/${anime.href.split('/').pop()}` 
        : `/anime/${anime.animeId}`;

    return (
        <Link 
            href={fallbackHref}
            onClick={handleClick}
            className="group block outline-none cursor-pointer w-full h-full"
            aria-label={`Play ${anime.title}`}
        >
           {children}
        </Link>
    );
}


function AnimeCard({ anime }: AnimeCardProps) {
    const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;
    
    return (
        <AnimeCardLink anime={anime}>
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
                    
                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-black/40">
                        <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
                    </div>

                    {/* Genres on Hover */}
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

                    {/* Default Title View */}
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
        </AnimeCardLink>
    );
}

export default AnimeCard;
