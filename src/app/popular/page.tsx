'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPopularAnime } from '@/lib/api';
import type { Anime } from '@/lib/types';
import AnimeCard from '@/components/anime-card';
import { Loader2 } from 'lucide-react';

export default function PopularPage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPopularAnime(1).then((data) => {
      if (data?.data.animeList) {
        setAnimes(data.data.animeList);
        setHasNextPage(data.pagination.hasNextPage);
      }
      setLoading(false);
    });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    getPopularAnime(nextPage).then((data) => {
      if (data?.data.animeList) {
        setAnimes((prev) => [...prev, ...data.data.animeList]);
        setPage(nextPage);
        setHasNextPage(data.pagination.hasNextPage);
      }
      setLoadingMore(false);
    });
  }, [loadingMore, hasNextPage, page]);

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
            Popular Anime
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
              No popular anime found.
            </p>
          )}
        </>
      )}
    </div>
  );
}
