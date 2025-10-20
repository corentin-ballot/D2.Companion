import { MouseEventHandler } from "react";
import NamedFighterAvatar from "./NamedFighterAvatar";
import { Fighter } from "../../providers/sockets/FightContext";

interface PlayerFighterAvatarProps {
    fighter: Fighter;
    isHighlighted: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
}

const PlayerFighterAvatar = ({ fighter, isHighlighted, onClick }: PlayerFighterAvatarProps) => {
    const name = fighter.actorInformation.fighter.namedFighter?.name;
    const breed = fighter.actorInformation.fighter.namedFighter?.characterInformation?.breedId || "0";
    const gender = fighter.actorInformation.fighter.namedFighter?.characterInformation?.gender.toLocaleLowerCase() || "male";
    const imgSrc = `${process.env.PUBLIC_URL}/img/classes/${breed}-${gender}.png`

    return <NamedFighterAvatar name={name} isHighlighted={isHighlighted} imgSrc={imgSrc} onClick={onClick} />
}


export default PlayerFighterAvatar;