import useDofusSpell from "../../hooks/dofus-data/useDofusSpell";
import { Fighter, GameActionFightEvent } from "../../providers/sockets/FightContext"
import FighterName from "../FighterName";
import Effect from "../Effect";

interface RemovableEffectActionProps {
    action: GameActionFightEvent
    fighters: Fighter[]
}

const RemovableEffectAction = ({ action, fighters }: RemovableEffectActionProps) => {
    const source = fighters.find(fighter => fighter.actorId === action.sourceId);
    const target = fighters.find(fighter => fighter.actorId === action.removableEffect?.effect.targetId);
    const spellId = action.removableEffect?.effect.spellId || 0;
    const effectId = action.actionId;

    const spellRequest = useDofusSpell(spellId);

    if(spellRequest.isPending) return <div>loading...</div>;

    return <div><FighterName fighter={target}/> est sous l&apos;effet de {spellRequest.data?.name.fr} pour {action.removableEffect?.effect.turnDuration} tour(s){source && <span> (<FighterName fighter={source} />)</span>}. <Effect id={effectId} value={action.removableEffect?.effect.temporaryBoostEffect?.delta} /></div>
}

export default RemovableEffectAction;