import type { Anime } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AnimeCard from './anime-card';

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
}

export default function AnimeCarousel({ title, animes }: AnimeCarouselProps) {
  if (!animes || animes.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 px-4 md:px-0">
        {title}
      </h2>
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
