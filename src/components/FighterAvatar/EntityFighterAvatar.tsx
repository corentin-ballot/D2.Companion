import { MouseEventHandler } from "react";
import NamedFighterAvatar from "./NamedFighterAvatar";
import { Fighter } from "../../providers/sockets/FightContext";
import useDofusCompagnon from "../../hooks/dofus-data/useDofusCompagnon";

interface EntityFighterAvatarProps {
    fighter: Fighter;
    isHighlighted: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
}

const EntityFighterAvatar = ({ fighter, isHighlighted, onClick }: EntityFighterAvatarProps) => {
    const entityModelId = fighter.actorInformation.fighter.entityFighter?.entityModelId || 0;
    const companionRequest = useDofusCompagnon(entityModelId);

    if(companionRequest.isPending) return <NamedFighterAvatar name="..." isHighlighted={isHighlighted} imgSrc="..." onClick={onClick} />

    return <NamedFighterAvatar name={companionRequest.data?.name} isHighlighted={isHighlighted} imgSrc={`http://localhost:3960/images/items/${companionRequest.data?.signeId}`} onClick={onClick} />
}


export default EntityFighterAvatar;