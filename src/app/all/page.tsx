import { getAllAnimeList } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default async function AllAnimePage() {
  const allAnimeData = await getAllAnimeList();

  if (!allAnimeData || !allAnimeData.data || !allAnimeData.data.list) {
    return (
      <div className="container py-20">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load the anime list. The API might be down or there was a network issue. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { list } = allAnimeData.data;

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        All Anime
      </h1>

      <div className="space-y-8">
        {list.map((group) => (
          <div key={group.startWith}>
            <h2 className="text-2xl font-bold font-headline text-primary border-b-2 border-primary pb-2 mb-4">
              {group.startWith}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
              {group.animeList.map((anime) => (
                <Link
                  key={anime.animeId}
                  href={`/anime/${anime.animeId}`}
                  className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 py-1"
                >
                  {anime.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}