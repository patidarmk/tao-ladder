import { GameContainer } from "@/components/game/GameContainer";
import { MadeWithApplaa } from "@/components/made-with-applaa";

const Index = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white overflow-hidden">
      <GameContainer />
      <div className="absolute bottom-0 w-full">
        <MadeWithApplaa />
      </div>
    </div>
  );
};

export default Index;