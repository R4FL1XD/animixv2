"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '../ui/separator';
import { ThemeToggle } from '../theme-toggle';
import Image from 'next/image';
import SearchBar from './search-bar';
import { Suspense } from 'react';

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src="https://i.ibb.co/0VsSsQ45/IMG-20251201-090159.jpg" alt="Animix Logo" width={32} height={32} className="h-8 w-8 rounded-sm" />
              <span className="font-bold sm:inline-block text-lg">
                  Animix
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
                href="/genre"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                Genre
            </Link>
             <Link
                href="/movies"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                Movies
            </Link>
            <Link
                href="/recent"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                New Episodes
            </Link>
            <Link
                href="/popular"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                Popular
            </Link>
            <Link
                href="/completed"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                Completed
            </Link>
            <Link
                href="/schedule"
                className="transition-colors hover:text-foreground/80 text-foreground"
            >
                Schedule
            </Link>
            <Link
                href="/all"
                className="transition-colors hover:text-foreground/80 text-foreground"
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
            <SheetTitle className="sr-only">Menu</SheetTitle>
             <Link href="/" className="mr-6 flex items-center space-x-2 px-6" onClick={handleLinkClick}>
                <Image src="https://i.ibb.co/0VsSsQ45/IMG-20251201-090159.jpg" alt="Animix Logo" width={32} height={32} className="h-8 w-8 rounded-sm" />
                <span className="font-bold text-lg">
                    Animix
                </span>
            </Link>
            <Separator className="my-4" />
            <div className="flex flex-col space-y-3 px-6">
                <Link
                    href="/genre"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Genre
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
                    New Episodes
                </Link>
                <Link
                    href="/popular"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Popular
                </Link>
                 <Link
                    href="/completed"
                    onClick={handleLinkClick}
                    className="transition-colors hover:text-primary"
                >
                    Completed
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
                 <Image src="https://i.ibb.co/0VsSsQ45/IMG-20251201-090159.jpg" alt="Animix Logo" width={32} height={32} className="h-8 w-8 rounded-sm" />
                 <span className="font-bold sm:inline-block text-lg">
                    Animix
                </span>
            </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
            <Suspense fallback={<div className="h-9 w-full max-w-xs animate-pulse rounded-full bg-muted" />}>
              <SearchBar />
            </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
