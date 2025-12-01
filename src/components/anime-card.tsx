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

function AnimeCardContent({ anime }: { anime: Anime }) {
    const scoreValue = typeof anime.score === 'string' ? anime.score : anime.score?.value;
    return (
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
    );
}


export default function AnimeCard({ anime }: AnimeCardProps) {
    const router = useRouter();

    const handleClick = async () => {
        // This handles recommended episodes which have episodeId
        if (anime.episodeId) {
            // The API returns incorrect episodeId for recommended items, so we extract it from href.
            const correctEpisodeId = anime.href.split('/').pop();
            if (correctEpisodeId) {
                router.push(`/episode/${correctEpisodeId}`);
                return;
            }
        }
        
        // For anything else, go to the latest episode page.
        if (anime.animeId) {
            const animeDetails = await getAnimeDetails(anime.animeId);
            if (animeDetails?.data?.episodeList?.[0]?.episodeId) {
                const latestEpisodeId = animeDetails.data.episodeList[0].episodeId;
                router.push(`/episode/${latestEpisodeId}`);
            } else {
                // Fallback to anime detail page if no episodes are found
                router.push(`/anime/${anime.animeId}`);
            }
        }
    };

    return (
        <div onClick={handleClick} className="group block outline-none cursor-pointer" tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
            role="button"
        >
            <AnimeCardContent anime={anime} />
        </div>
    );
}