
"use client";

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    // Set initial search query from URL params on component mount
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        // If the query is cleared, go back to the homepage
        const currentSearch = searchParams.get('search');
        if (currentSearch) {
          router.push('/');
        }
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, router, searchParams]);

  return (
    <div className="relative w-full max-w-xs">
      <Input
        type="search"
        placeholder="Search anime..."
        className="h-9 w-full rounded-full border bg-transparent pl-4 pr-10 focus:border-primary transition-colors"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground flex items-center justify-center pointer-events-none"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </div>
    </div>
  );
}
