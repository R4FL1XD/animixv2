import Link from 'next/link';
import { Clapperboard, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Clapperboard className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-lg">
            Animix
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground font-medium"
          >
            Home
          </Link>
          <Link
            href="/browse"
            className="transition-colors hover:text-foreground/80 text-muted-foreground"
          >
            Browse
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime..."
                className="pl-9 w-full md:w-48 lg:w-64"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
