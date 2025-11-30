import { Button } from "@/components/ui/button";
import Link from "next/link";

// Statically defined list of genres
const genres = [
    { id: "action", name: "Action" },
    { id: "adventure", name: "Adventure" },
    { id: "comedy", name: "Comedy" },
    { id: "drama", name: "Drama" },
    { id: "fantasy", name: "Fantasy" },
    { id: "magic", name: "Magic" },
    { id: "romance", name: "Romance" },
    { id: "sci-fi", name: "Sci-Fi" },
    { id: "shounen", name: "Shounen" },
    { id: "slice-of-life", name: "Slice of Life" },
    { id: "supernatural", name: "Supernatural" },
    { id: "sports", name: "Sports" },
    { id: "school", name: "School" },
    { id: "military", name: "Military" },
    { id: "harem", name: "Harem" },
    { id: "ecchi", name: "Ecchi" },
    { id: "isekai", name: "Isekai" },
    { id: "mecha", name: "Mecha" },
    { id: "mystery", name: "Mystery" },
    { id: "psychological", name: "Psychological" },
    { id: "thriller", name: "Thriller" },
    { id: "horror", name: "Horror" },
];

export default function BrowsePage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-8">
        Browse by Genre
      </h1>
      <div className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <Button key={genre.id} asChild variant="outline" size="lg">
            <Link href={`/browse/${genre.id}`}>{genre.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
