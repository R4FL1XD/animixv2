
'use client';

import { getEpisodeDetails, getServerUrl, getAnimeDetails } from '@/lib/api';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Download, Server, Loader2, Home, ChevronsRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimeCarousel from '@/components/anime-carousel';
import type { EpisodeDetail, AnimeDetail } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const Breadcrumb = ({ animeTitle, episodeTitle, animeId }: { animeTitle: string; episodeTitle: string; animeId: string; }) => {
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronsRight className="h-4 w-4" />
      <Link href={`/anime/${animeId}`} className="hover:text-primary transition-colors truncate max-w-48 md:max-w-96">
        {animeTitle}
      </Link>
      <ChevronsRight className="h-4 w-4" />
      <span className="font-medium text-foreground truncate">{episodeTitle}</span>
    </div>
  );
};


export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetail | null>(null);
  const [animeDetails, setAnimeDetails] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamingUrl, setStreamingUrl] = useState('');
  const [loadingStream, setLoadingStream] = useState(false);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (typeof id !== 'string') return;
      setLoading(true);
      
      const detailsPromise = getEpisodeDetails(id);
      
      const details = await detailsPromise;
      if (!details || !details.data) {
        notFound();
        return;
      }
      setEpisodeDetails(details.data);
      
      if (details.data.defaultStreamingUrl) {
          setStreamingUrl(details.data.defaultStreamingUrl);
      }
      
      const initialServer = details.data.server.qualities
        .flatMap(q => q.serverList)
        .find(s => s.title.toLowerCase().includes('blogspot'));

      if (initialServer) {
        setActiveServerId(initialServer.serverId);
      } else {
        const firstServer = details.data.server.qualities.find(q => q.serverList.length > 0)?.serverList[0];
        if (firstServer) {
          setActiveServerId(firstServer.serverId);
        }
      }

      if (details.data.animeId) {
        const animeData = await getAnimeDetails(details.data.animeId);
        if (animeData?.data) {
          setAnimeDetails(animeData.data);
        }
      }

      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  const handleServerClick = async (serverId: string, serverTitle: string) => {
    setLoadingStream(true);
    setActiveServerId(serverId);

    if (serverTitle.toLowerCase().includes('blogspot')) {
        if(episodeDetails?.defaultStreamingUrl) {
            setStreamingUrl(episodeDetails.defaultStreamingUrl);
        }
        setLoadingStream(false);
        return;
    }
    
    try {
        const serverData = await getServerUrl(serverId);
        if (serverData && serverData.data.url) {
          setStreamingUrl(serverData.data.url);
        } else {
          console.error('Failed to get server URL, serverData is null or missing url');
          setStreamingUrl('');
        }
    } catch(e) {
        console.error('Error fetching server URL:', e);
        setStreamingUrl('');
    } finally {
        setLoadingStream(false);
    }
  };
  
  if (loading || !episodeDetails) {
    return <div className="container flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }
  
  const episode = episodeDetails;
  const currentEpisodeId = typeof id === 'string' ? id : '';

  return (
    <div className="container py-8 md:py-12">
      {animeDetails && (
        <Breadcrumb 
          animeTitle={animeDetails.title} 
          episodeTitle={episode.title}
          animeId={episode.animeId}
        />
      )}

      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{episode.title}</h1>
      <p className="text-muted-foreground mb-6">Released: {episode.releasedOn}</p>

      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
        {loadingStream ? (
           <div className="flex justify-center items-center h-full w-full bg-black">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
           </div>
        ) : streamingUrl ? (
            <iframe
            key={streamingUrl}
            src={streamingUrl}
            allowFullScreen
            className="w-full h-full border-0"
            ></iframe>
        ) : (
          <div className="flex justify-center items-center h-full w-full bg-black text-white">
            <p>Select a server to start streaming.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8 gap-2 md:gap-4">
        {episode.hasPrevEpisode && episode.prevEpisode ? (
          <Button asChild variant="outline" className="flex-shrink-0">
            <Link href={`/episode/${episode.prevEpisode.episodeId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev
            </Link>
          </Button>
        ) : <div className="flex-shrink-0" />}
        
        {animeDetails && animeDetails.episodeList.length > 0 && (
          <Select
            value={currentEpisodeId}
            onValueChange={(value) => router.push(`/episode/${value}`)}
          >
            <SelectTrigger className="w-full max-w-xs mx-auto">
              <SelectValue placeholder="Select an episode" />
            </SelectTrigger>
            <SelectContent>
              {animeDetails.episodeList.map(ep => (
                <SelectItem key={ep.episodeId} value={ep.episodeId}>
                  Episode {ep.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {episode.hasNextEpisode && episode.nextEpisode ? (
          <Button asChild variant="outline" className="flex-shrink-0">
            <Link href={`/episode/${episode.nextEpisode.episodeId}`}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : <div className="flex-shrink-0" />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Tabs defaultValue="streaming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="streaming"><Server className="mr-2"/> Streaming Servers</TabsTrigger>
                    <TabsTrigger value="downloads"><Download className="mr-2"/> Download Links</TabsTrigger>
                </TabsList>
                 <TabsContent value="streaming">
                     <Card>
                        <CardHeader>
                            <CardTitle>Streaming Servers</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                                                    disabled={loadingStream}
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
                <TabsContent value="downloads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Download Options</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
            </Tabs>
        </div>
        <div className="lg:col-span-1">
          {episode.recommendedEpisodeList && episode.recommendedEpisodeList.length > 0 && (
             <div className="pt-8">
                <AnimeCarousel title="Recommended Episodes" animes={episode.recommendedEpisodeList} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
