import NamedFighterName from "./NamedFighterName";
import { Fighter } from "../../providers/sockets/FightContext";
import useDofusCompagnon from "../../hooks/dofus-data/useDofusCompagnon";

interface EntityFighterNameProps {
    fighter: Fighter;
}

const EntityFighterName = ({ fighter }: EntityFighterNameProps) => {
    const entityModelId = fighter.actorInformation.fighter.entityFighter?.entityModelId || 0;
    const companionRequest = useDofusCompagnon(entityModelId);

    if(companionRequest.isPending) return <NamedFighterName name="loading..." />

    return <NamedFighterName name={companionRequest.data?.name} />
}


export default EntityFighterName;