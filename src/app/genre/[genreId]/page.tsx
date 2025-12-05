'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getAnimeByGenre } from '@/lib/api';
import type { Anime } from '@/lib/types';
import AnimeCard from '@/components/anime-card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GenrePage() {
  const params = useParams();
  const genreId = Array.isArray(params.genreId) ? params.genreId[0] : params.genreId;

  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const genreTitle = genreId ? genreId.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : 'Genre';

  useEffect(() => {
    if (genreId) {
      setLoading(true);
      getAnimeByGenre(genreId, 1).then((data) => {
        if (data?.data.animeList) {
          setAnimes(data.data.animeList);
          setHasNextPage(data.pagination.hasNextPage);
        }
        setLoading(false);
      });
    }
  }, [genreId]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasNextPage || !genreId) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    getAnimeByGenre(genreId, nextPage).then((data) => {
      if (data?.data.animeList) {
        setAnimes((prev) => [...prev, ...data.data.animeList]);
        setPage(nextPage);
        setHasNextPage(data.pagination.hasNextPage);
      }
      setLoadingMore(false);
    });
  }, [loadingMore, hasNextPage, page, genreId]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
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
