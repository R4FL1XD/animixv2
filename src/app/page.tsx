import { getHomeData } from '@/lib/api';
import AnimeCarousel from '@/components/anime-carousel';
import TopAnimeList from '@/components/top-anime-list';
import HeroSection from '@/components/hero-section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import SearchPage from './search/page';
import { Suspense } from 'react';

function HomePageContent({ homeData }: { homeData: Awaited<ReturnType<typeof getHomeData>> }) {
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
  const heroAnimes = recent.animeList.slice(0, 5);

  return (
    <div className="flex flex-col">
      {heroAnimes.length > 0 && <HeroSection animes={heroAnimes} />}
      <div className="container">
        <AnimeCarousel title="Recent Releases" animes={recent.animeList} viewAllLink="/recent"/>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8">
          <div className="xl:col-span-2">
            {movie.animeList.length > 0 && <AnimeCarousel title="Movies" animes={movie.animeList} viewAllLink="/movies" />}
          </div>
          <div className="xl:col-span-1">
            {top10.animeList.length > 0 && <TopAnimeList animes={top10.animeList} />}
          </div>
        </div>
      </div>
    </div>
  );
}


export default async function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const searchQuery = searchParams?.search as string | undefined;

  if (searchQuery) {
    return (
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchPage />
      </Suspense>
    );
  }

  const homeData = await getHomeData();
  return <HomePageContent homeData={homeData} />;
}
