
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/lib/types';
import { PlayCircle, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAnimeDetails } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

interface AnimeCardProps {
  anime: Anime;
}

function AnimeCard({ anime }: AnimeCardProps) {
    const router = useRouter();
    const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;
    
    // Fallback link to the anime detail page. The play button will override this.
    const linkHref = `/anime/${anime.animeId}`;

    const handlePlayClick = async (e: React.MouseEvent) => {
        // Prevent the underlying Link from navigating
        e.preventDefault();
        e.stopPropagation();

        // If the href contains '/episode/', it's a direct episode link (like from recommendations)
        if (anime.href && anime.href.includes('/episode/')) {
             const episodeId = anime.href.split('/').pop();
             if (episodeId) {
                router.push(`/episode/${episodeId}`);
             }
             return;
        }

        // Otherwise, it's a general anime. Fetch details to find the latest episode.
        try {
            const animeDetails = await getAnimeDetails(anime.animeId);
            // The latest episode is usually the first in the list
            if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
                const latestEpisodeId = animeDetails.data.episodeList[0].episodeId;
                router.push(`/episode/${latestEpisodeId}`);
            } else {
                router.push(linkHref); // Fallback to detail page if no episodes found
            }
        } catch (error) {
            console.error("Failed to get anime details:", error);
            router.push(linkHref); // Fallback on error
        }
    };

    return (
        <Link href={linkHref} className="group block outline-none cursor-pointer w-full h-full" aria-label={`View details for ${anime.title}`}>
            <Card className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:-translate-y-1 group-focus-visible:shadow-primary/20 group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary ring-offset-2 ring-offset-background">
                <CardContent className="p-0 relative">
                    {anime.poster ? (
                        <Image
                            src={anime.poster}
                            alt={anime.title}
                            width={300}
                            height={450}
                            className="object-cover w-full h-auto aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                        />
                    ) : (
                        <Skeleton className="w-full h-auto aspect-[2/3]" />
                    )}
                    
                    {/* Clickable Play Button Overlay */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-black/40"
                        onClick={handlePlayClick}
                        aria-label={`Play latest episode of ${anime.title}`}
                        role="button"
                    >
                        <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg pointer-events-none" />
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute inset-0 top-auto h-2/3 bg-gradient-to-t from-black/90 to-transparent p-3 flex flex-col justify-end pointer-events-none">
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
                <CardFooter className="p-2.5 bg-card/80 text-xs text-muted-foreground border-t flex justify-between items-center pointer-events-none">
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

export default AnimeCard;

