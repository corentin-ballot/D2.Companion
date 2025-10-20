import { MouseEventHandler } from "react";
import NamedFighterAvatar from "./NamedFighterAvatar";
import { Fighter } from "../../providers/sockets/FightContext";
import useDofusMonster from "../../hooks/dofus-data/useDofusMonster";

interface AiFighterAvatarProps {
    fighter: Fighter;
    isHighlighted: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
}

const AiFighterAvatar = ({ fighter, isHighlighted, onClick }: AiFighterAvatarProps) => {
    const monsterGid = fighter.actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid || 0;
    const monsterRequest = useDofusMonster(monsterGid);

    if(monsterRequest.isPending) return <NamedFighterAvatar name="..." isHighlighted={isHighlighted} imgSrc="..." onClick={onClick} />

    return <NamedFighterAvatar name={monsterRequest.data?.name.fr} isHighlighted={isHighlighted} imgSrc={`http://localhost:3960/images/monsters/${monsterGid}`} onClick={onClick} />
}


export default AiFighterAvatar;