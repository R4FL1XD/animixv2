import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScheduleAnime } from '@/lib/types';
import { Clock, Star, Tag } from 'lucide-react';

interface ScheduleAnimeCardProps {
  anime: ScheduleAnime;
}

export default function ScheduleAnimeCard({ anime }: ScheduleAnimeCardProps) {
  const linkHref = `/anime/${anime.animeId}`;

  const isUpdating = anime.estimation.toLowerCase() === 'update';

  return (
    <Link href={linkHref} className="group block outline-none" tabIndex={0}>
      <Card className="flex h-full w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-card/95 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 ring-offset-background">
        <div className="relative w-1/3 shrink-0">
          <Image
            src={anime.poster || '/placeholder.jpg'}
            alt={anime.title}
            width={120}
            height={180}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-between p-4 w-2/3">
            <div>
                <h3 className="font-headline text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {anime.title}
                </h3>
                {anime.genres && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Tag className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{anime.genres}</span>
                    </div>
                )}
            </div>
            
            <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={isUpdating ? 'destructive' : 'secondary'} className="gap-1.5">
                        <Clock className="h-3 w-3"/>
                        {anime.estimation}
                    </Badge>
                    {anime.score && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span>{anime.score}</span>
                        </Badge>
                    )}
                </div>
            </div>
        </div>
      </Card>
    </Link>
  );
}
