import type { Anime } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AnimeCard from './anime-card';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
  viewAllLink?: string;
}

export default function AnimeCarousel({ title, animes, viewAllLink }: AnimeCarouselProps) {
  if (!animes || animes.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline">
          {title}
        </h2>
        {viewAllLink && (
            <Button asChild variant="ghost" className="text-primary hover:text-primary/90">
                <Link href={viewAllLink}>
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        )}
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {animes.map((anime, index) => (
            <CarouselItem key={`${anime.animeId}-${index}`} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <AnimeCard anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  );
}
