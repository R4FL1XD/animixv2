import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Github, Twitter } from 'lucide-react';

const footerNavs = [
    { href: '/genre', text: 'Genre' },
    { href: '/movies', text: 'Movies' },
    { href: '/recent', text: 'New Episodes' },
    { href: '/popular', text: 'Popular' },
    { href: '/schedule', text: 'Schedule' },
];


export default function Footer() {
  return (
    <footer className="border-t bg-background/90 mt-16">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="mb-4 inline-flex items-center space-x-2">
                <Image src="https://i.ibb.co/0VsSsQ45/IMG-20251201-090159.jpg" alt="Animix Logo" width={32} height={32} className="h-8 w-8 rounded-sm" />
                <span className="font-bold sm:inline-block text-lg">
                    Animix
                </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
                Your world of anime, unbound. Stream the latest episodes, discover new series, and dive into your favorite worlds.
            </p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Explore</h3>
              <nav className="flex flex-col space-y-2">
                {footerNavs.map((item) => (
                  <Link key={item.text} href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4">
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
               <h3 className="font-semibold text-foreground mb-3">Legal</h3>
               <nav className="flex flex-col space-y-2">
                    <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4">Terms of Service</Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4">Privacy Policy</Link>
               </nav>
            </div>
             <div>
               <h3 className="font-semibold text-foreground mb-3">Social</h3>
               <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Twitter">
                        <Twitter className="h-6 w-6" />
                    </a>
                  </Button>
                   <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="GitHub">
                        <Github className="h-6 w-6" />
                    </a>
                  </Button>
               </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t">
            <p className="text-center text-xs text-muted-foreground">
                Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
            </p>
             <p className="text-center text-xs text-muted-foreground mt-2">
                &copy; {new Date().getFullYear()} Animix. All rights reserved. This is a fictional project for demonstration purposes.
            </p>
        </div>
      </div>
    </footer>
  );
}
