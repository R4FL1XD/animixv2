import type { HomeData, AnimeDetailData, EpisodeDetailData, ServerUrlData, SearchData, PaginatedAnimeData, ScheduleData, AllAnimeData, Anime } from './types';

const API_BASE_URL = 'https://www.sankavollerei.com';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return res;
      }
      if (res.status >= 500 && i < retries - 1) {
        console.warn(`API call failed with status ${res.status}. Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        backoff *= 2; // Exponential backoff
        continue;
      }
      return res; // Return non-5xx errors immediately
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`API call failed with error: ${error}. Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        backoff *= 2;
        continue;
      }
      throw error;
    }
  }
  // This part should be unreachable if retries > 0
  throw new Error('API request failed after multiple retries.');
}


function addGenreListToAnime(anime: Anime, details: AnimeDetailData): Anime {
    if (details.data && details.data.genreList) {
        return {
            ...anime,
            genreList: details.data.genreList,
        };
    }
    return anime;
}

export async function getHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/home`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch home data:', res.status, res.statusText);
      return null;
    }

    let data: HomeData = await res.json();
    
    // Enrich recent anime with genre data
    if (data.data && data.data.recent && data.data.recent.animeList) {
        const enrichedRecentList = await Promise.all(
            data.data.recent.animeList.map(async (anime) => {
                const details = await getAnimeDetails(anime.animeId);
                return details ? addGenreListToAnime(anime, details) : anime;
            })
        );
        data.data.recent.animeList = enrichedRecentList;
    }


    return data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}


export async function getAnimeDetails(animeId: string): Promise<AnimeDetailData | null> {
  if (!animeId) {
    console.error('getAnimeDetails called with undefined or null animeId');
    return null;
  }
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/anime/${animeId}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error(`Failed to fetch details for ${animeId}:`, res.status, res.statusText);
      return null;
    }

    const data: AnimeDetailData = await res.json();
    if (data.data && !data.data.title) {
        data.data.title = animeId.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${animeId}:`, error);
    return null;
  }
}

export async function getEpisodeDetails(episodeId: string): Promise<EpisodeDetailData | null> {
    if (!episodeId) return null;
    try {
        const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/episode/${episodeId}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Failed to fetch episode details for ${episodeId}:`, res.status, res.statusText);
            return null;
        }

        const data: EpisodeDetailData = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching episode details for ${episodeId}:`, error);
        return null;
    }
}

export async function getServerUrl(serverId: string): Promise<ServerUrlData | null> {
    if (!serverId) return null;
    
    try {
        const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/server/${serverId}`, {});

        if (!res.ok) {
            console.error(`Failed to fetch server URL for ${serverId}:`, res.status, res.statusText);
            return null;
        }

        const data: ServerUrlData = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching server URL for ${serverId}:`, error);
        return null;
    }
}

export async function searchAnime(query: string, page: number = 1): Promise<SearchData | null> {
  if (!query) return null;
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/search?q=${encodeURIComponent(query)}&page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to search for ${query}:`, res.status, res.statusText);
      return null;
    }

    const data: SearchData = await res.json();
    return data;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error);
    return null;
  }
}

export async function getRecentAnime(page: number = 1): Promise<PaginatedAnimeData | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/recent?page=${page}`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      console.error('Failed to fetch recent anime:', res.status, res.statusText);
      return null;
    }

    const data: PaginatedAnimeData = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent anime:', error);
    return null;
  }
}

export async function getAnimeByGenre(genreId: string, page: number = 1): Promise<PaginatedAnimeData | null> {
  if (!genreId) return null;
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/genres/${genreId}?page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch anime for genre ${genreId}:`, res.status, res.statusText);
      return null;
    }

    const data: PaginatedAnimeData = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching anime for genre ${genreId}:`, error);
    return null;
  }
}

export async function getScheduleData(): Promise<ScheduleData | null> {
    try {
      const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/schedule`, {
        next: { revalidate: 3600 * 6 },
      });
  
      if (!res.ok) {
        console.error('Failed to fetch schedule data:', res.status, res.statusText);
        return null;
      }
  
      const data: ScheduleData = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      return null;
    }
  }

export async function getMovies(page: number = 1): Promise<PaginatedAnimeData | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/movies?page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('Failed to fetch movies:', res.status, res.statusText);
      return null;
    }

    const data: PaginatedAnimeData = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
}

export async function getPopularAnime(page: number = 1): Promise<PaginatedAnimeData | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/popular?page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('Failed to fetch popular anime:', res.status, res.statusText);
      return null;
    }

    const data: PaginatedAnimeData = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    return null;
  }
}

export async function getAllAnimeList(): Promise<AllAnimeData | null> {
    try {
      const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/list`, {
        next: { revalidate: 3600 * 24 },
      });
  
      if (!res.ok) {
        console.error('Failed to fetch all anime list:', res.status, res.statusText);
        return null;
      }
  
      const data: AllAnimeData = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching all anime list:', error);
      return null;
    }
}
  
export async function getCompletedAnime(page: number = 1): Promise<PaginatedAnimeData | null> {
    try {
      const res = await fetchWithRetry(`${API_BASE_URL}/anime/samehadaku/completed?page=${page}`, {
        next: { revalidate: 3600 },
      });
  
      if (!res.ok) {
        console.error('Failed to fetch completed anime:', res.status, res.statusText);
        return null;
      }
  
      const data: PaginatedAnimeData = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching completed anime:', error);
      return null;
    }
}
