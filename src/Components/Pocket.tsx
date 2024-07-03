import PokemonPocket from "./PokemonPocket";
import gifUrl from "../assets/pokeball.gif"
import { useState } from "react";

export default function Pocket({
  pocket,
  fightState,
  onSelect,
}: {
  pocket: number[];
  fightState: string;
  onSelect: (id: number) => void;
}) {

  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className=" absolute bottom-0 left-0 z-50 text-black">
      <div className="flex flex-row items-center">
        <img onClick={()=>{setIsVisible(!isVisible)}} src={gifUrl} alt="pokeball" className="size-[80px] ml-8 mb-4 cursor-poke-full " />
        <div className={`flex flex-row items-center ${isVisible ? "visible" : "invisible"}`}>
        {pocket.map((id) => (
          <PokemonPocket
            key={id}
            id={id}
            fightState={fightState}
            onSelect={(id) => {
              onSelect(id);
            }}
          />
        ))}
        </div>
      </div>
    </div>
  );
}
