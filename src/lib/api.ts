import type { HomeData } from './types';

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
