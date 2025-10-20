import { MouseEventHandler } from "react";
import { Fighter } from "../../providers/sockets/FightContext";
import PlayerFighterAvatar from "./PlayerFighterAvatar";
import NamedFighterAvatar from "./NamedFighterAvatar";
import AiFighterAvatar from "./AiFighterAvatar";
import EntityFighterAvatar from "./EntityFighterAvatar";

interface FighterAvatarProps {
    fighter: Fighter | undefined
    isHighlighted: boolean
    onClick?: MouseEventHandler<HTMLDivElement>
}

const FighterAvatar = ({ fighter, isHighlighted, onClick }: FighterAvatarProps) => {
    if(typeof fighter?.actorInformation.fighter.namedFighter !== "undefined") return <PlayerFighterAvatar fighter={fighter} isHighlighted={isHighlighted} onClick={onClick} />
    if(typeof fighter?.actorInformation.fighter.aiFighter !== "undefined") return <AiFighterAvatar fighter={fighter} isHighlighted={isHighlighted} onClick={onClick} />
    if(typeof fighter?.actorInformation.fighter.entityFighter !== "undefined") return <EntityFighterAvatar fighter={fighter} isHighlighted={isHighlighted} onClick={onClick} />
    return <NamedFighterAvatar name="undefined" isHighlighted={isHighlighted} imgSrc="null" onClick={onClick} />
}

export default FighterAvatar;