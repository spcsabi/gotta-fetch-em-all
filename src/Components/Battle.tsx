import { useState } from "react";
import { getRandNumber } from "../data/utils";
import { PokemonDetailsRefactored } from "../Types/types";

export default function Battle({
  actualPocket,
  player,
  enemy,
  fightState,
  onClose,
  onHPChange,
  onMessage: onMessage,
  onFightState,
}: {
  actualPocket: number[];
  player: PokemonDetailsRefactored;
  enemy: PokemonDetailsRefactored;
  fightState: string;
  onClose: (newPocket: number[]) => void;
  onHPChange: (
    newEnemyHP: number,
    newPlayerHP: number,
    damageToEnemy: number,
    damageToPlayer: number
  ) => void;
  onMessage: (message: string) => void;
  onFightState: (fightState: string) => void;
}) {
  const [enemyActualHP, setEnemyActualHP] = useState(enemy.hp);
  const [playerActualHP, setPlayerActualHP] = useState(player.hp);
  const [newPocket, setNewPocket] = useState(actualPocket);

  function countPoints(attack: number, defense: number) {
    return Math.round(
      ((((2 / 5 + 2) * attack * 60) / defense / 50 + 2) *
        getRandNumber(217, 255)) /
        255
    );
  }

  function fight() {
    const damageToEnemy = countPoints(player.attack, enemy.defense);
    const damageToPlayer = countPoints(enemy.attack, player.defense);
    if (enemyActualHP - damageToEnemy <= 0) {
      setEnemyActualHP(0);
      setNewPocket([...actualPocket, player.id, enemy.id]);
      onHPChange(0, playerActualHP, damageToEnemy, damageToPlayer);
      onFightState("result");
    }
    if (playerActualHP - damageToPlayer <= 0) {
      setPlayerActualHP(0);
      setNewPocket(actualPocket);
      onHPChange(enemyActualHP, 0, damageToEnemy, damageToPlayer);
      onFightState("result");
    } else {
      setEnemyActualHP(enemyActualHP - damageToEnemy);
      setPlayerActualHP(playerActualHP - damageToPlayer);
      onHPChange(
        enemyActualHP - damageToEnemy,
        playerActualHP - damageToPlayer,
        damageToEnemy,
        damageToPlayer
      );
    }
  }
  return (
    <div className="card justify-between h-30 bg-slate-50/75 p-5">
      {fightState === "select" ? (
        <>
          <div className={"grid grid-cols-2 gap-4"}>
            <button
              className="btn btn-outline btn-primary cursor-poke-full"
              onClick={() => {
                onFightState("fight");
                onMessage("HIT ATTACK");
              }}
            >
              START FIGHT
            </button>
            <button
              className="btn btn-outline btn-accent cursor-poke-full"
              onClick={() => {
                onClose([...actualPocket, player.id]);
                onMessage("Choose a fighter or run");
              }}
            >
              RUN AWAY
            </button>
          </div>
        </>
      ) : fightState === "fight" ? (
        <>
          <button
            className="btn btn-outline btn-error cursor-poke-full"
            onClick={() => {
              fight();
            }}
          >
            ATTACK
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-outline btn-info cursor-poke-full"
            onClick={() => {
              onClose(newPocket);
              onFightState("stop");
            }}
          >
            BACK TO MAP
          </button>
        </>
      )}
    </div>
  );
}
