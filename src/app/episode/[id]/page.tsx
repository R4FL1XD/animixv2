'use client';

import { getEpisodeDetails, getServerUrl } from '@/lib/api';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Download, Server, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimeCarousel from '@/components/anime-carousel';
import type { EpisodeDetail } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function EpisodeDetailPage() {
  const params = useParams();
  const { id } = params;

  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamingUrl, setStreamingUrl] = useState('');
  const [loadingStream, setLoadingStream] = useState(false);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (typeof id !== 'string') return;
      setLoading(true);
      const details = await getEpisodeDetails(id);
      if (!details || !details.data) {
        notFound();
        return;
      }
      setEpisodeDetails(details.data);
      setStreamingUrl(details.data.defaultStreamingUrl);
      setActiveServerId(details.data.defaultStreamingUrl);
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  const handleServerClick = async (serverId: string, serverTitle: string) => {
    if (serverTitle.toLowerCase().includes('blogspot')) {
        setStreamingUrl(serverId);
        setActiveServerId(serverId);
        return;
    }
    
    setLoadingStream(true);
    setActiveServerId(serverId);
    const serverData = await getServerUrl(serverId);
    if (serverData && serverData.data.url) {
      setStreamingUrl(serverData.data.url);
    } else {
      // Handle error, maybe show a toast
      console.error('Failed to get server URL');
    }
    setLoadingStream(false);
  };
  
  if (loading || !episodeDetails) {
    // You can return a loading skeleton here
    return <div className="container flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }
  
  const episode = episodeDetails;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-4">
        <Link href={`/anime/${episode.animeId}`} className="text-sm text-primary hover:underline">
          &larr; Back to Anime Details
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{episode.title}</h1>
      <p className="text-muted-foreground mb-6">Released: {episode.releasedOn}</p>

      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
        {loadingStream ? (
           <div className="flex justify-center items-center h-full w-full bg-black">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
           </div>
        ) : (
            <iframe
            key={streamingUrl} // Re-render iframe when URL changes
            src={streamingUrl}
            allowFullScreen
            className="w-full h-full border-0"
            ></iframe>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        {episode.hasPrevEpisode && episode.prevEpisode ? (
          <Button asChild variant="outline">
            <Link href={`/episode/${episode.prevEpisode.episodeId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev Episode
            </Link>
          </Button>
        ) : <div />}
        {episode.hasNextEpisode && episode.nextEpisode ? (
          <Button asChild variant="outline">
            <Link href={`/episode/${episode.nextEpisode.episodeId}`}>
              Next Episode <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : <div />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Tabs defaultValue="downloads" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="downloads"><Download className="mr-2"/> Download Links</TabsTrigger>
                    <TabsTrigger value="streaming"><Server className="mr-2"/> Streaming Servers</TabsTrigger>
                </TabsList>
                <TabsContent value="downloads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Download Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {episode.downloadUrl.formats.map((format, formatIndex) => (
                                    <AccordionItem value={`format-${formatIndex}`} key={`format-${formatIndex}`}>
                                        <AccordionTrigger>{format.title}</AccordionTrigger>
                                        <AccordionContent>
                                            {format.qualities.map((quality, qualityIndex) => (
                                                <div key={`q-${qualityIndex}`} className="mb-4 last:mb-0">
                                                    <h4 className="font-semibold mb-2">{quality.title}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {quality.urls.map((url, urlIndex) => (
                                                            <Button asChild variant="secondary" size="sm" key={`url-${urlIndex}`}>
                                                                <a href={url.url} target="_blank" rel="noopener noreferrer">{url.title}</a>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="streaming">
                     <Card>
                        <CardHeader>
                            <CardTitle>Streaming Servers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                            {episode.server.qualities.map((quality, qualityIndex) => (
                                quality.serverList.length > 0 && (
                                    <div key={`sq-${qualityIndex}`}>
                                        <h3 className="font-semibold text-lg mb-2">{quality.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {quality.serverList.map(server => (
                                                <Button 
                                                    key={server.serverId} 
                                                    variant={activeServerId === server.serverId ? 'default' : 'outline'}
                                                    onClick={() => handleServerClick(server.serverId, server.title)}
                                                    disabled={loadingStream && activeServerId === server.serverId}
                                                >
                                                     {loadingStream && activeServerId === server.serverId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    {server.title}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1">
          {episode.recommendedEpisodeList && episode.recommendedEpisodeList.length > 0 && (
             <div className="-mt-8">
                <AnimeCarousel title="Recommended Episodes" animes={episode.recommendedEpisodeList} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}