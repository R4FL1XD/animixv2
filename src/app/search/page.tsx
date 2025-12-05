'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { searchAnime } from '@/lib/api';
import type { Anime } from '@/lib/types';
import AnimeCard from '@/components/anime-card';
import { Loader2 } from 'lucide-react';

function SearchPageComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const q = searchParams.get('search');
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      const fetchInitialData = async () => {
        const allAnimes: Anime[] = [];
        let nextHasPage = false;
        for (let i = 1; i <= initialPage; i++) {
          const data = await searchAnime(q, i);
          if (data?.data.animeList) {
            allAnimes.push(...data.data.animeList);
            nextHasPage = data.pagination.hasNextPage;
          } else {
            nextHasPage = false;
            break;
          }
        }
        setResults(allAnimes);
        setHasNextPage(nextHasPage);
        setPage(initialPage);
        setLoading(false);
      };
      fetchInitialData();
    } else {
        setLoading(false);
        setResults([]);
    }
  }, [q, initialPage]);

  const handleLoadMore = useCallback(() => {
    if (!q || !hasNextPage || loadingMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    searchAnime(q, nextPage).then((data) => {
      if (data?.data.animeList) {
        setResults((prevResults) => [...prevResults, ...data.data.animeList]);
        setPage(nextPage);
        setHasNextPage(data.pagination.hasNextPage);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", String(nextPage));
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathname}${query}`, { scroll: false });
      }
      setLoadingMore(false);
    });
  }, [q, hasNextPage, loadingMore, page, router, pathname, searchParams]);

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
          {q ? (
             <>
              <h1 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Search Results for "{q}"
              </h1>
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {results.map((anime, index) => (
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
                  No results found for "{q}". Try another keyword.
                </p>
              )}
             </>
          ) : (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">Search for an anime</h1>
                <p className="text-muted-foreground">Start typing in the search bar above to see results.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
      <SearchPageComponent />
    </Suspense>
  )
}
