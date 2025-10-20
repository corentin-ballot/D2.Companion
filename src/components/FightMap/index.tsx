import React, { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";

import { Fight } from '../../providers/sockets/FightContext';

interface FightMapProps {
    fight: Fight
    width?: number
    height?: number
}

const DEFAULT_WITH = 1910;
const DEFAULT_HEIGHT = 970;

const FightMap = ({ fight, width, height }: FightMapProps) => {
    const [stageSize, setStageSize] = useState({ width: DEFAULT_WITH, height: DEFAULT_HEIGHT });
    const [background, setBackground] = useState(null);

    // Load Background Image
    useEffect(() => {
        const bg = new window.Image();
        bg.src = `http://localhost:3960/images/maps/${fight?.mapId}`;
        // @ts-ignore
        bg.onload = () => setBackground(bg);
    }, [fight]);

    // Responsive Scaling
    useEffect(() => {
        if (typeof width === "number" && typeof height === "number") {
            return setStageSize({ width, height });
        }
        if (typeof height === "number") {
            const h = DEFAULT_WITH * height / DEFAULT_HEIGHT;
            return setStageSize({ width: h, height });
        }
        if (typeof width === "number") {
            const w = DEFAULT_HEIGHT * width / DEFAULT_WITH;
            return setStageSize({ width, height: w });
        }
        return setStageSize({ width: DEFAULT_WITH, height: DEFAULT_HEIGHT });
    }, [width, height]);

    const getCellPosition = (cellid: number) => {
        const x = 368 + 86.4 * (cellid % 14) + 44 * (Math.floor(cellid / 14) % 2);
        const y = 10 + 22 * Math.floor(cellid / 14);

        return { x, y };
    };
    if (!fight) return null;

    return (
        <div style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
            <Stage width={stageSize.width} height={stageSize.height} scaleX={stageSize.width / 1910} scaleY={stageSize.height / 970}>
                <Layer>
                    {background && <Image image={background} width={1910} height={970} />}
                    {/* Grid debug */}
                    {/* {Array.from({length: 559}, (_, i) => {
                        const cell = getCellPosition(i+1);
                        return <Circle x={cell.x} y={cell.y} radius={10} fill="red" />
                    })} */}

                    {fight.fighters.map(fighter => {
                        const cell = getCellPosition(fighter.disposition.cellId);
                        const avatar = new window.Image();

                        if(fighter.actorInformation.fighter.namedFighter) {
                            const breed = fighter.actorInformation.fighter.namedFighter?.characterInformation?.breedId || "0";
                            const gender = fighter.actorInformation.fighter.namedFighter?.characterInformation?.gender.toLocaleLowerCase() || "male";
                            avatar.src = `${process.env.PUBLIC_URL}/img/classes/${breed}-${gender}.png`;
                        } else if(fighter.actorInformation.fighter.aiFighter) {
                            avatar.src = `http://localhost:3960/images/monsters/${fighter.actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid}`
                        }

                        return <Image image={avatar} x={cell.x} y={cell.y} width={80} height={80} />
                    })}
                </Layer>
            </Stage>
        </div>
    );

    // return <Box component="img" sx={{ maxWidth: "100%", height: "auto", width: "auto", maxHeight: 300, margin: "auto", display: "block" }} src={`http://localhost:3960/images/maps/${fight.mapId}`} alt={`map-${fight.mapId}`} />
}

export default FightMap;