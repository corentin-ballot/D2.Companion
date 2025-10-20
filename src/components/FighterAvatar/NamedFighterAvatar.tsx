import { Avatar, Tooltip, useTheme } from "@mui/material";
import { MouseEventHandler } from "react";

interface NamedFighterAvatarProps {
    name: string | undefined;
    imgSrc: string;
    isHighlighted: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
}

const NamedFighterAvatar = ({ name, imgSrc, isHighlighted, onClick }: NamedFighterAvatarProps) => {
    const theme = useTheme();
    
    return <Tooltip title={name}>
        <Avatar
            onClick={onClick} 
            alt={name}
            sx={{
                width: 96, height: 96,
                cursor: "pointer",
                bgcolor: isHighlighted ? theme.palette.primary.main : theme.palette.grey[100],
                ":hover": {
                    bgcolor: isHighlighted ? theme.palette.primary.main : theme.palette.grey[300],
                    "img": {
                        transform: "scale(1.6)",
                    }
                }
            }}
            data-img={imgSrc}
            src={imgSrc} />
    </Tooltip>
}


export default NamedFighterAvatar;