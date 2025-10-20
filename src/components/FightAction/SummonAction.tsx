import useDofusMonster from "../../hooks/dofus-data/useDofusMonster";
import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface SummonActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const SummonAction = ({ action, fighters }: SummonActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const summonId = action.summons?.summonsByContextInformation.summons[0].spawnInformation.monster.monsterGid || 0;

    const monsterRequest = useDofusMonster(summonId);
    if(monsterRequest.isPending) return <div>loading...</div>

    return <div><FighterName fighter={source}/> invoque {monsterRequest.data?.name.fr}</div>
}

export default SummonAction;