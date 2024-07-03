import { useState } from "react";
import { usePokemon } from "../data/utils";

export default function PokemonPocket({
  id,
  fightState,
  onSelect,
}: {
  id: number;
  fightState: string;
  onSelect: (id: number) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { error, isLoading, isSuccess, data } = usePokemon(id);

  return (
    <div
      className="max-w-16 items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => {
        if (fightState === "select") {
          onSelect(id);
        }
      }}
    >
      {error && <h1 className="warning-message">Something went wrong...</h1>}
      {isLoading && <h1 className="load-info">Loading...</h1>}
      {isSuccess && (
        <>
          <div className="card p-2 cursor-poke-full">
            <img
              className="h-10"
              src={
                data.sprites.other.showdown.front_default
                  ? data.sprites.other.showdown.front_default
                  : data.sprites.front_default
                  ? data.sprites.front_default
                  : ""
              }
              alt={data.name}
            />
                      <p className={`m-0 text-base text-slate-400 ${isVisible ? "visible" : "invisible"}`}>
            {data.name}
          </p>
          </div>
        </>
      )}
    </div>
  );
}
