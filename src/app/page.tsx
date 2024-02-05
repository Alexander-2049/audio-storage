import getCurrentUser from "@/auth/getCurrentUser";
import Player from "@/components/player/player";

export default async function Home() {
  const user = await getCurrentUser();
  
  return (
    <main>
      <Player user={user}/>
    </main>
  );
}
