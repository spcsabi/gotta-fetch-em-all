import { useRef, useState } from "react";
import { gifUrl } from "../Data/backgrounds";
import { getRandNumber, usePokemon } from "../Data/utils";
import PokemonMain from "./PokemonMain";
import Battle from "./Battle";

export default function Fight({
  activeLocationNumber,
  activeLocationName,
  pocket,
  selectedPokemonId,
  fightState,
  onFightState,
  onClose,
}: {
  activeLocationNumber: number;
  activeLocationName: string;
  pocket: number[];
  selectedPokemonId: number;
  fightState: string;
  onClose: (newPocket: number[]) => void;
  onFightState: (fightStatus: string) => void;
}) {
  const [enemyActualHP, setEnemyActualHP] = useState(-10);
  const [playerActualHP, setPlayerActualHP] = useState(-10);
  const [message, setMessage] = useState("Choose your champion or run away");
  const randomNumber = useRef(getRandNumber(1, 1025));
  const enemyData = usePokemon(randomNumber.current);
  const playerData = usePokemon(selectedPokemonId);


  return (
    <div className="text-black relative z-10 ">
      <img
        src={gifUrl[activeLocationNumber - 1]}
        alt="background"
        className="w-full h-full object-cover "
      />

      <div className="overlay-components">
        <div className="w-3/5 grid grid-cols-1 gap-3">
          <h1 className="grid grid-cols-1 card  justify-between text-center text-xl bg-slate-50/75 p-2">
            {activeLocationName.toLocaleUpperCase()}
          </h1>
          <p className="grid grid-cols-1 card justify-between text-center text-sm bg-slate-50/75 p-2">
            {message}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Player data load */}
            {selectedPokemonId === 0 ? (
              <h1 className=" text-center load-info">Choose your champion</h1>
            ) : playerData.error ? (
              <h1 className="text-center warning-message">
                Something went wrong...
              </h1>
            ) : playerData.isLoading ? (
              <h1 className="text-center load-info">Loading...</h1>
            ) : playerData.isSuccess ? (
              <PokemonMain
                pokemonById={playerData.data}
                newHP={playerActualHP}
                fightState={""}
              />
            ) : (
              <></>
            )}

            {/* Enemy data load */}
            {enemyData.error ? (
              <h1 className="text-center warning-message">
                Something went wrong...
              </h1>
            ) : enemyData.isLoading ? (
              <h1 className="text-center load-info">Loading...</h1>
            ) : enemyData.isSuccess ? (
              <PokemonMain
                pokemonById={enemyData.data}
                newHP={enemyActualHP}
                fightState={fightState}
              />
            ) : (
              <></>
            )}
          </div>

          {/* Battle component */}
          <div className="grid grid-cols-1">
            {playerData.isSuccess && enemyData.isSuccess ? (
              <Battle
                actualPocket={pocket}
                player={{
                  id: playerData.data.id,
                  name: playerData.data.name,
                  hp: playerData.data.stats[0].base_stat,
                  attack: playerData.data.stats[1].base_stat,
                  defense: playerData.data.stats[2].base_stat,
                }}
                enemy={{
                  id: enemyData.data.id,
                  name: enemyData.data.name,
                  hp: enemyData.data.stats[0].base_stat,
                  attack: enemyData.data.stats[1].base_stat,
                  defense: enemyData.data.stats[2].base_stat,
                }}
                fightState={fightState}
                onClose={(newPocket) => {
                  onClose(newPocket);
                }}
                onHPChange={(
                  newEnemyHP,
                  newPlayerHP,
                  damageToEnemy,
                  damageToPlayer
                ) => {
                  setEnemyActualHP(newEnemyHP);
                  setPlayerActualHP(newPlayerHP);

                  if (newEnemyHP <= 0) {
                    setMessage(
                      `${playerData.data.name.toLocaleUpperCase()} 🌟WON🌟 Collect ${enemyData.data.name.toLocaleUpperCase()} `
                    );
                  } else if (newPlayerHP <= 0) {
                    setMessage(
                      `You lost ${playerData.data.name.toLocaleUpperCase()} 🪦RIP🪦`
                    );
                  } else {
                    setMessage(
                      `${playerData.data.name}: -${damageToPlayer}, ${enemyData.data.name}: -${damageToEnemy}`
                    );
                  }
                }}
                onMessage={(message) => {
                  setMessage(message);
                }}
                onFightState={(fightState) => {
                  onFightState(fightState);
                }}
              />
            ) : (
              <div className="card justify-between h-30 bg-slate-50/75 p-5">
                <button
                  className="btn btn-outline btn-accent cursor-poke-full"
                  onClick={() => {
                    onClose(pocket);
                    setMessage("Choose a fighter or run");
                  }}
                >
                  RUN AWAY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
