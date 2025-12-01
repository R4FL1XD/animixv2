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
  episodeId?: string; // Add optional episodeId for recommended episodes
  href: string;
  samehadakuUrl: string;
  genreList?: Genre[];
  type?: string;
  status?: string;
  score?: string | Score | null; // Allow score to be string or Score object
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

// Types for Anime Detail Page
export interface Score {
  value: string;
  users: string;
}

export interface Synopsis {
  paragraphs: string[];
  connections: any[];
}

export interface Batch {
  title: string;
  batchId: string;
  href: string;
  samehadakuUrl: string;
}

export interface Episode {
  title: number | string;
  episodeId: string;
  href: string;
  samehadakuUrl: string;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  score: Score | null;
  japanese: string;
  synonyms: string;
  english: string;
  status: string;
  type: string;
  source: string;
  duration: string;
  episodes: number | null;
  season: string;
  studios: string;
  producers: string;
  aired: string;
  trailer: string;
  synopsis: Synopsis;
  genreList: Genre[];
  batchList: Batch[];
  episodeList: Episode[];
}

export interface AnimeDetailData {
  status: string;
  creator: string;
  message: string;
  data: AnimeDetail;
}


// Types for Episode Detail Page
export interface EpisodeNav {
  title: string;
  episodeId: string;
  href: string;
  samehadakuUrl: string;
}

export interface ServerItem {
  title: string;
  serverId: string;
  href: string;
}

export interface Quality {
  title: string;
  serverList: ServerItem[];
}

export interface Server {
  qualities: Quality[];
}

export interface DownloadURL {
    title: string;
    url: string;
}

export interface DownloadQuality {
    title: string;
    urls: DownloadURL[];
}

export interface DownloadFormat {
    title: string;
    qualities: DownloadQuality[];
}

export interface EpisodeDetail {
    title: string;
    animeId: string;
    poster: string;
    releasedOn: string;
    defaultStreamingUrl: string;
    hasPrevEpisode: boolean;
    prevEpisode: EpisodeNav | null;
    hasNextEpisode: boolean;
    nextEpisode: EpisodeNav | null;
    synopsis: Synopsis;
    genreList: Genre[];
    server: Server;
    downloadUrl: {
        formats: DownloadFormat[];
    };
    recommendedEpisodeList: Anime[];
    movie: {
        href: string;
        samehadakuUrl: string;
        animeList: Anime[];
    };
}

export interface EpisodeDetailData {
    status: string;
    creator: string;
    message: string;
    data: EpisodeDetail;
}

export interface ServerUrlData {
    status: string;
    creator: string;
    message: string;
    data: {
        url: string;
    };
    pagination: null;
}

interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

export interface SearchData {
  status: string;
  creator: string;
  message: string;
  data: {
    animeList: Anime[];
  };
  pagination: Pagination;
}

export interface PaginatedAnimeData {
  status: string;
  creator: string;
  message: string;
  data: {
    animeList: Anime[];
  };
  pagination: Pagination;
}

// Types for Schedule Page
export interface ScheduleAnime {
    title: string;
    poster: string;
    type: string;
    score: string;
    estimation: string;
    genres: string;
    animeId: string;
    href: string;
    samehadakuUrl: string;
}
  
export interface ScheduleDay {
    day: string;
    animeList: ScheduleAnime[];
}
  
export interface ScheduleData {
    status: string;
    creator: string;
    message: string;
    data: {
      days: ScheduleDay[];
    };
    pagination: null;
}

// Types for All Anime List Page
export interface AllAnimeItem {
    title: string;
    animeId: string;
    href: string;
    samehadakuUrl: string;
  }
  
  export interface AllAnimeGroup {
    startWith: string;
    animeList: AllAnimeItem[];
  }
  
  export interface AllAnimeData {
    status: string;
    creator: string;
    message: string;
    data: {
      list: AllAnimeGroup[];
    };
    pagination: null;
  }
