import useDofusSpell from "../../hooks/dofus-data/useDofusSpell";
import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface MarkCellsActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const MarkCellsAction = ({ action, fighters }: MarkCellsActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const spellId = action.markCells?.mark.spellId || 0;

    const spellRequest = useDofusSpell(spellId);

    if(spellRequest.isPending) return <div>loading...</div>;

    return <div><FighterName fighter={source}/> marque la cellue {action.markCells?.mark.markImpactCell} avec {spellRequest.data?.name.fr}</div>
}

export default MarkCellsAction;