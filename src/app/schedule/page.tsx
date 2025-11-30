import { getScheduleData } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleAnimeCard from '@/components/schedule-anime-card';

export default async function SchedulePage() {
  const scheduleData = await getScheduleData();

  if (!scheduleData || !scheduleData.data || !scheduleData.data.days) {
    return (
      <div className="container py-20">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load schedule. The API might be down or there was a network issue. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { days } = scheduleData.data;
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-8">
        Weekly Release Schedule
      </h1>

      <Tabs defaultValue={today} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
          {days.map((day) => (
            <TabsTrigger key={day.day} value={day.day}>
              {day.day}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {days.map((day) => (
          <TabsContent key={day.day} value={day.day}>
            {day.animeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.animeList.map((anime, index) => (
                        <ScheduleAnimeCard key={`${anime.animeId}-${index}`} anime={anime} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-10">No release schedule for today.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
