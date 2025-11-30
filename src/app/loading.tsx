import { Skeleton } from '@/components/ui/skeleton';

function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-auto w-full aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4 mt-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="w-full">
        <div className="flex space-x-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 shrink-0">
            <AnimeCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
                    <Skeleton className="h-10 w-12 text-center shrink-0" />
                    <Skeleton className="h-[90px] w-[60px] rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Loading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
         <Skeleton className="h-full w-full" />
        <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex flex-col justify-end pb-12 md:pb-24">
            <div className="max-w-xl">
                <Skeleton className="h-14 md:h-20 w-3/4" />
                <Skeleton className="h-5 w-1/2 mt-4" />
                <div className="flex gap-4 mt-8">
                    <Skeleton className="h-12 w-36 rounded-md" />
                    <Skeleton className="h-12 w-36 rounded-md" />
                </div>
            </div>
        </div>
      </section>

      <div className="container">
        {/* Recent Releases Skeleton */}
        <section className="py-8 md:py-12">
            <Skeleton className="h-8 w-64 mb-6" />
            <CarouselSkeleton />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
                {/* Movies Skeleton */}
                <section className="py-8 md:py-12">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <CarouselSkeleton />
                </section>
            </div>
            <div className="xl:col-span-1">
                {/* Top 10 Skeleton */}
                <section className="py-8 md:py-12">
                    <Skeleton className="h-8 w-64 mb-6" />
                    <TopListSkeleton />
                </section>
            </div>
        </div>
      </div>
    </>
  );
}
