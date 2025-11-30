'use client';

import Link from 'next/link';
import { Clapperboard, Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '../ui/separator';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSheetOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
                Animix
            </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
                href="/browse"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Browse
            </Link>
             <Link
                href="/movies"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Movies
            </Link>
            <Link
                href="/recent"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                New
            </Link>
            <Link
                href="/popular"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Popular
            </Link>
            <Link
                href="/schedule"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Schedule
            </Link>
            <Link
                href="/all"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                All Anime
            </Link>
            </nav>
        </div>

        {/* Mobile Header */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetTitle className='sr-only'>Menu</SheetTitle>
             <Link href="/" className="mr-6 flex items-center space-x-2 px-6" onClick={handleLinkClick}>
                <Clapperboard className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">
                    Animix
                </span>
            </Link>
            <Separator className="my-4" />
            <div className="flex flex-col space-y-3 px-6">
                <Link
                    href="/browse"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Browse
                </Link>
                <Link
                    href="/movies"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Movies
                </Link>
                <Link
                    href="/recent"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    New
                </Link>
                <Link
                    href="/popular"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Popular
                </Link>
                <Link
                    href="/schedule"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Schedule
                </Link>
                 <Link
                    href="/all"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    All Anime
                </Link>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="md:hidden flex-1">
            <Link href="/" className="flex items-center space-x-2 justify-center">
                 <Clapperboard className="h-6 w-6 text-primary" />
                 <span className="font-bold sm:inline-block text-lg">
                    Animix
                </span>
            </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <form
            onSubmit={handleSearch}
            className="w-full flex-1 md:w-auto md:flex-none"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 w-full md:w-48 lg:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}