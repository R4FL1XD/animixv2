import Image from 'next/image';
import Link from 'next/link';
import type { TopAnime } from '@/lib/types';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TopAnimeListProps {
  animes: TopAnime[];
}

export default function TopAnimeList({ animes }: TopAnimeListProps) {
    if (!animes || animes.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6">
        Top 10 This Season
      </h2>
      <div className="flex flex-col gap-3">
        {animes.map((anime) => (
          <Link key={anime.animeId} href={`/anime/${anime.animeId}`} className="group">
            <Card className="flex items-center gap-4 p-2 transition-all duration-200 hover:bg-muted/80 hover:shadow-md focus-visible:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 ring-offset-background outline-none">
              <div className="text-3xl font-black font-headline text-muted-foreground/50 w-10 text-center shrink-0">
                {anime.rank}
              </div>
              <div className="relative shrink-0">
                <Image
                  src={anime.poster}
                  alt={anime.title}
                  width={48}
                  height={72}
                  className="rounded-sm object-cover aspect-[2/3]"
                  unoptimized
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold truncate group-hover:text-primary transition-colors text-sm">
                  {anime.title}
                </h3>
                {anime.score && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>{anime.score}</span>
                    </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
