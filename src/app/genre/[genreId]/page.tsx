'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getAnimeByGenre } from '@/lib/api';
import type { Anime } from '@/lib/types';
import AnimeCard from '@/components/anime-card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GenrePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genreId = Array.isArray(params.genreId) ? params.genreId[0] : params.genreId;

  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialPage = parseInt(searchParams.get('page') || '1');
  const [page, setPage] = useState(initialPage);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const genreTitle = genreId ? genreId.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : 'Genre';

  useEffect(() => {
    if (genreId) {
      setLoading(true);
      const fetchInitialData = async () => {
        const allAnimes: Anime[] = [];
        let nextHasPage = false;
        for (let i = 1; i <= initialPage; i++) {
          const data = await getAnimeByGenre(genreId, i);
          if (data?.data.animeList) {
            allAnimes.push(...data.data.animeList);
            nextHasPage = data.pagination.hasNextPage;
          } else {
            nextHasPage = false;
            break;
          }
        }
        setAnimes(allAnimes);
        setHasNextPage(nextHasPage);
        setLoading(false);
      };

      fetchInitialData();
    }
  }, [genreId, initialPage]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasNextPage || !genreId) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    getAnimeByGenre(genreId, nextPage).then((data) => {
      if (data?.data.animeList) {
        setAnimes((prev) => [...prev, ...data.data.animeList]);
        setPage(nextPage);
        setHasNextPage(data.pagination.hasNextPage);
        router.replace(`${pathname}?page=${nextPage}`, { scroll: false });
      }
      setLoadingMore(false);
    });
  }, [loadingMore, hasNextPage, page, genreId, router, pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore]);

  return (
    <div className="container py-8 md:py-12">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            {genreTitle} Anime
          </h1>
          {animes.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {animes.map((anime, index) => (
                  <AnimeCard key={`${anime.animeId}-${index}`} anime={anime} />
                ))}
              </div>
              {loadingMore && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-center">
              No anime found for this genre.
            </p>
          )}
        </>
      )}
    </div>
  );
}
