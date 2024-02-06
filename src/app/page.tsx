import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const PlayerPage = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Your Playlists</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Workout Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              alt="Playlist cover"
              className="aspect-square rounded-md object-cover"
              height="200"
              src="/placeholder.svg"
              width="200"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chill Vibes</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              alt="Playlist cover"
              className="aspect-square rounded-md object-cover"
              height="200"
              src="/placeholder.svg"
              width="200"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              alt="Playlist cover"
              className="aspect-square rounded-md object-cover"
              height="200"
              src="/placeholder.svg"
              width="200"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Party Hits</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              alt="Playlist cover"
              className="aspect-square rounded-md object-cover"
              height="200"
              src="/placeholder.svg"
              width="200"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PlayerPage;
