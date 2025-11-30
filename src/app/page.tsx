import { getHomeData } from '@/lib/api';
import AnimeCarousel from '@/components/anime-carousel';
import TopAnimeList from '@/components/top-anime-list';
import HeroSection from '@/components/hero-section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function Home() {
  const homeData = await getHomeData();

  if (!homeData || !homeData.data) {
    return (
      <div className="container py-20">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load anime data. The API might be down or there was a network issue. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { recent, movie, top10 } = homeData.data;
  const heroAnime = recent.animeList[0];

  return (
    <div className="flex flex-col">
      {heroAnime && <HeroSection anime={heroAnime} />}
      <div className="container">
        <AnimeCarousel title="Recent Releases" animes={recent.animeList} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8">
          <div className="xl:col-span-2">
            {movie.animeList.length > 0 && <AnimeCarousel title="Movies" animes={movie.animeList} />}
          </div>
          <div className="xl:col-span-1">
            {top10.animeList.length > 0 && <TopAnimeList animes={top10.animeList} />}
          </div>
        </div>
      </div>
    </div>
  );
}
