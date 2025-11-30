export interface Genre {
  title: string;
  genreId: string;
  href: string;
  samehadakuUrl: string;
}

export interface Anime {
  title: string;
  poster: string;
  episodes?: string;
  releasedOn?: string;
  releaseDate?: string;
  animeId: string;
  href: string;
  samehadakuUrl: string;
  genreList?: Genre[];
}

export interface TopAnime extends Anime {
  rank: number;
  score: string;
}

export interface HomeData {
  status: string;
  creator: string;
  message: string;
  data: {
    recent: {
      href: string;
      samehadakuUrl: string;
      animeList: Anime[];
    };
    batch: {
      href: string;
      samehadakuUrl: string;
      batchList: any[]; // Assuming empty based on example
    };
    movie: {
      href: string;
      samehadakuUrl: string;
      animeList: Anime[];
    };
    top10: {
      href: string;
      samehadakuUrl: string;
      animeList: TopAnime[];
    };
  };
  pagination: null;
}
