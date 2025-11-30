import { getAnimeDetails } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Tv, Calendar, Clock, Film, Users } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AnimeDetailPageProps {
  params: {
    id: string;
  };
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const animeDetails = await getAnimeDetails(params.id);

  if (!animeDetails || !animeDetails.data) {
    notFound();
  }

  const { data: anime } = animeDetails;

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <Image
              src={anime.poster}
              alt={anime.title}
              width={400}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <p className="text-sm text-accent font-semibold">{anime.status}</p>
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-3">
            {anime.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">{anime.japanese}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genreList.map((genre) => (
              <Badge key={genre.genreId} variant="secondary" className="transition-colors hover:bg-primary/20 hover:text-primary">
                {genre.title}
              </Badge>
            ))}
          </div>

          {anime.score?.value && (
            <div className="flex items-center gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Star className="h-7 w-7 text-yellow-500 fill-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{anime.score.value}</p>
                  <p className="text-xs text-muted-foreground -mt-1">Score</p>
                </div>
              </div>
              <div className="border-l h-10 border-border"></div>
              <div className="flex items-center gap-2">
                 <Users className="h-6 w-6 text-muted-foreground" />
                 <div>
                    <p className="text-lg font-semibold">{anime.score.users}</p>
                    <p className="text-xs text-muted-foreground -mt-1">Users</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
             <h2 className="text-2xl font-headline font-bold mb-4">Synopsis</h2>
            {anime.synopsis.paragraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-headline font-bold mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem icon={Tv} label="Type" value={`${anime.type}${anime.source ? ` (${anime.source})` : ''}`} />
              <DetailItem icon={Film} label="Episodes" value={anime.episodes?.toString()} />
              <DetailItem icon={Clock} label="Duration" value={anime.duration} />
              <DetailItem icon={Calendar} label="Aired" value={anime.aired} />
              <DetailItem icon={Tv} label="Season" value={anime.season} />
              <DetailItem icon={Users} label="Studios" value={anime.studios} />
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="episodes">
            <AccordionItem value="episodes">
              <AccordionTrigger className="text-2xl font-headline font-bold">Episodes</AccordionTrigger>
              <AccordionContent>
                <div className="max-h-[400px] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {anime.episodeList.map(ep => (
                    <Button key={ep.episodeId} variant="outline" asChild>
                      <Link href={ep.href}>Eps {ep.title}</Link>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </div>
    </div>
  );
}