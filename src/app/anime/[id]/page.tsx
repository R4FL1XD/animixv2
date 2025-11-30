import { notFound } from 'next/navigation';

interface AnimeDetailPageProps {
  params: {
    id: string;
  };
}

async function getAnimeDetails(id: string) {
  // In a real application, you would fetch details for the specific anime ID.
  // Example: const res = await fetch(`https://www.sankavollerei.com/anime/samehadaku/anime/${id}`)
  // if (!res.ok) return undefined
  // return res.json()
  
  if (!id) {
    return null;
  }
  // Simulate finding an anime to demonstrate the page structure
  return { id, title: `Details for ${id.replace(/-/g, ' ')}` };
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const anime = await getAnimeDetails(params.id);

  if (!anime) {
    notFound();
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-headline font-bold mb-4 capitalize">
        {anime.title}
      </h1>
      <p className="text-muted-foreground">
        This is where detailed information about the anime will be displayed, including a synopsis, episode list, and more.
      </p>
      <p className="mt-8 font-mono bg-muted p-4 rounded-md text-sm text-muted-foreground">
        [Anime ID: {params.id}]
      </p>
    </div>
  );
}
