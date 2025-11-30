import type { HomeData, AnimeDetailData, EpisodeDetailData } from './types';

const API_BASE_URL = 'https://www.sankavollerei.com';

export async function getHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/anime/samehadaku/home`, {
      // Revalidate every hour to get fresh data
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch home data:', res.status, res.statusText);
      // Don't throw, return null to handle gracefully in the UI
      return null;
    }

    const data: HomeData = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}


export async function getAnimeDetails(animeId: string): Promise<AnimeDetailData | null> {
  if (!animeId) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/anime/samehadaku/anime/${animeId}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error(`Failed to fetch details for ${animeId}:`, res.status, res.statusText);
      return null;
    }

    const data: AnimeDetailData = await res.json();
    // The API returns an empty title for some reason, so we'll patch it.
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
        const res = await fetch(`${API_BASE_URL}/anime/samehadaku/episode/${episodeId}`, {
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