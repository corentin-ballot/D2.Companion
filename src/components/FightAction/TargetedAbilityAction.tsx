import useDofusSpell from "../../hooks/dofus-data/useDofusSpell";
import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";

interface TargetedAbilityActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const TargetedAbilityAction = ({ action, fighters }: TargetedAbilityActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.targetedAbility?.targetId);
    const spellId = action.targetedAbility?.spellCast?.spellId || 0;

    const spellRequest = useDofusSpell(spellId);

    if(spellRequest.isPending) return <div>loading...</div>;

    return <div><FighterName fighter={source}/> lance {spellRequest?.data?.name?.fr}{target && <span> sur <FighterName fighter={target} /></span>}</div>
}

export default TargetedAbilityAction;