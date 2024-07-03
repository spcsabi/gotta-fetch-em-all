import Map from "./Components/Map";
import Fight from "./Components/Fight";
import { useEffect, useState } from "react";
import Pocket from "./Components/Pocket";
import { gifColor, gifColorBottom } from "./Data/backgrounds";
import pngUrl from "./assets/PokemonSign.png";

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [locationSelectionState, setLocationSelectionState] = useState(true);
  const [fightState, setFightState] = useState("stop");
  const [pocket, setPocket] = useState([2, 6, 7]);
  const [selectedPokemonId, setSelectedPokemonId] = useState(0);
  const [activeLocations, setActiveLocations] = useState("");
  const [activeLocationNumber, setActiveLocationNumber] = useState(0);

  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (locationSelectionState) {
    return (
      <div
        className="relative h-screen bg-white m-auto content-center"
        style={{ maxWidth: (height * 2520) / 2170 }}
      >
        {gameState === "start" && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50 text-white text-center text-3xl font-bold cursor-poke-full">
            <img
              src={pngUrl}
              alt="Pokemon"
              className="absolute top-[20%] w-[500px]"
            />
            <button
              className="cursor-poke-full transition-transform transform hover:scale-110 "
              onClick={() => {
                setGameState("on");
              }}
            >
              START THE GAME
            </button>
          </div>
        )}
        {gameState === "gameover" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 text-white text-center  cursor-poke-full ">
            <div className="grid grid-rows-2">
              <h1 className="text-3xl font-bold">GAME OVER</h1>
              <button
                className={
                  "cursor-poke-full transition-transform transform hover:scale-110"
                }
                onClick={() => {
                  setGameState("on");
                  setPocket([2, 6, 7]);
                }}
              >
                START A NEW GAME
              </button>
            </div>
          </div>
        )}
        <>
          <img
            src={pngUrl}
            alt="Pokemon"
            className="absolute top-1 right-1/2 transform translate-x-1/2 z-10 w-[200px]"
          />
          <Pocket pocket={pocket} fightState={fightState} onSelect={() => {}} />
          <Map
            onSelectLocation={(n, name) => {
              setActiveLocationNumber(n);
              setActiveLocations(name);
              setLocationSelectionState(false);
              setFightState("select");
            }}
          />
        </>
      </div>
    );
  }
  if (fightState) {
    return (
      <div
        className="relative h-screen m-auto mb-0 content-center"
        style={{
          maxWidth: (height * 2520) / 2170,
          backgroundImage: `linear-gradient(to bottom, ${
            gifColor[activeLocationNumber - 1]
          } 50%, ${gifColorBottom[activeLocationNumber - 1]} 50%)`,
        }}
      >
        <>
          <img
            src={pngUrl}
            alt="Pokemon"
            className="absolute top-1 right-1/2 transform translate-x-1/2 z-10 w-[200px]"
          />
          <Fight
            onClose={(newPocket) => {
              setPocket([...newPocket]);
              setFightState("stop");
              setLocationSelectionState(true);
              setSelectedPokemonId(0);
              if (newPocket.length === 0) {
                setGameState("gameover");
              }
            }}
            selectedPokemonId={selectedPokemonId}
            activeLocationNumber={activeLocationNumber}
            activeLocationName={activeLocations}
            pocket={pocket}
            fightState={fightState}
            onFightState={(fightState) => {
              setFightState(fightState);
            }}
          />
          <Pocket
            pocket={pocket}
            fightState={fightState}
            onSelect={(id) => {
              setSelectedPokemonId(id);
              if (fightState === "select" && selectedPokemonId === 0) {
                setPocket([
                  ...pocket.filter((item) => {
                    return item !== id;
                  }),
                ]);
              } else if (fightState === "select" && selectedPokemonId !== 0) {
                setPocket([
                  ...pocket.filter((item) => {
                    return item !== id;
                  }),
                  selectedPokemonId,
                ]);
              }
            }}
          />
        </>
      </div>
    );
  }
}
